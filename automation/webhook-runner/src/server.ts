import Fastify from 'fastify';
import type { FastifyInstance } from 'fastify';
import type { Config } from './config.js';
import { isDbOpen, isDeliveryDuplicate, recordDelivery } from './db.js';
import { checkEligibility } from './eligibility.js';
import type { WebhookPayload } from './eligibility.js';
import { enqueue } from './queue.js';
import { validateSignature } from './validator.js';

export function buildServer(config: Config): FastifyInstance {
  const fastify = Fastify({
    logger: {
      level: config.logLevel,
    },
    // We need raw body for HMAC validation — use addContentTypeParser
    bodyLimit: 10 * 1024 * 1024, // 10 MB limit
  });

  // Register raw body content type parser for GitHub webhooks
  fastify.addContentTypeParser(
    'application/json',
    { parseAs: 'buffer' },
    (_req, body, done) => {
      done(null, body);
    },
  );

  // Health check
  fastify.get('/health', async (_req, reply) => {
    return reply.status(200).send({ status: 'ok' });
  });

  // Readiness check
  fastify.get('/ready', async (_req, reply) => {
    if (!isDbOpen()) {
      return reply.status(503).send({ status: 'error', dbOpen: false });
    }
    return reply.status(200).send({ status: 'ok', dbOpen: true });
  });

  // GitHub webhook receiver
  fastify.post('/webhooks/github', async (req, reply) => {
    const rawBody = req.body as Buffer;

    // Validate signature BEFORE any other processing
    const signatureHeader = req.headers['x-hub-signature-256'] as string;
    if (!validateSignature(rawBody, signatureHeader, config.webhookSecret)) {
      req.log.warn({ signatureHeader: signatureHeader ? '[present]' : '[missing]' }, 'Invalid webhook signature');
      return reply.status(401).send({ error: 'Invalid signature' });
    }

    const deliveryId = req.headers['x-github-delivery'] as string | undefined;
    const eventType = req.headers['x-github-event'] as string | undefined;

    if (!deliveryId) {
      req.log.warn('Webhook delivery missing x-github-delivery header — rejected');
      return reply.status(200).send({ status: 'rejected', reason: 'missing delivery id' });
    }

    // Only process issues events
    if (eventType !== 'issues') {
      req.log.info({ eventType, deliveryId }, 'Ignoring non-issues event');
      return reply.status(200).send({ status: 'ignored', reason: `event type '${eventType}' is not 'issues'` });
    }

    let payload: WebhookPayload;
    try {
      payload = JSON.parse(rawBody.toString('utf8')) as WebhookPayload;
    } catch (err) {
      req.log.error({ deliveryId }, 'Failed to parse webhook JSON body');
      return reply.status(200).send({ status: 'error', reason: 'Invalid JSON body' });
    }

    const issueNumber = payload.issue?.number;
    const repo = payload.repository?.full_name;
    const action = payload.action;
    const creatorLogin = payload.issue?.user?.login;

    // Check for duplicate delivery
    if (deliveryId && isDeliveryDuplicate(deliveryId)) {
      req.log.info(
        { deliveryId, repo, issueNumber, action },
        'Duplicate delivery ignored',
      );
      return reply.status(200).send({ status: 'duplicate' });
    }

    // Check eligibility
    const eligibility = checkEligibility(payload, config);

    req.log.info(
      {
        deliveryId,
        repo,
        issueNumber,
        action,
        creatorLogin,
        eligible: eligibility.eligible,
        reason: eligibility.reason,
      },
      'Webhook delivery received',
    );

    recordDelivery(deliveryId);

    if (!eligibility.eligible) {
      return reply.status(200).send({
        status: 'ineligible',
        reason: eligibility.reason,
      });
    }

    // Enqueue the job (async — returns quickly)
    const result = enqueue(deliveryId, issueNumber, repo);

    if (!result.enqueued) {
      return reply.status(200).send({
        status: 'duplicate',
        reason: result.reason,
      });
    }

    return reply.status(200).send({ status: 'queued', issueNumber });
  });

  return fastify;
}
