// Server-side reads go through the in-process database client, not the
// generated HTTP client (tina/__generated__/client.ts hardcodes a relative
// URL "/api/tina/gql" - fine for the browser, but unfetchable from a Next.js
// server component, which has no origin to resolve it against). That silent
// fetch failure was making every SSR request fall back to static JSON.
import databaseClient from '../../tina/__generated__/databaseClient';

export async function getTinaDocument(queryName, relativePath) {
  try {
    const result = await databaseClient.queries[queryName]({ relativePath });
    // The in-process resolver's result isn't a plain object (Next.js refuses
    // to pass it from this server component to the client component), so
    // round-trip it through JSON to strip whatever it actually is.
    return JSON.parse(
      JSON.stringify({
        data: result.data,
        query: result.query,
        variables: result.variables,
      })
    );
  } catch {
    return null;
  }
}
