import { defineConfig, LocalAuthProvider } from 'tinacms';
import { GoogleAuthProvider } from '../src/lib/google-auth-provider';
import { isAuthBypassEnabled } from '../src/lib/tina-auth-bypass';

const branch =
  process.env.NEXT_PUBLIC_TINA_BRANCH ||
  process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF ||
  process.env.HEAD ||
  'main';

export default defineConfig({
  branch,
  contentApiUrlOverride: '/api/tina/gql',
  authProvider: isAuthBypassEnabled() ? new LocalAuthProvider() : new GoogleAuthProvider(),
  build: {
    publicFolder: 'public',
    outputFolder: 'admin',
  },
  media: {
    loadCustomStore: async () => {
      const { VercelBlobMediaStore } = await import('../src/lib/tina-vercel-blob-store');
      return VercelBlobMediaStore;
    },
  },
  schema: {
    collections: [
      {
        name: 'page',
        label: 'Home Page',
        path: 'src/data',
        format: 'json',
        match: { include: 'home' },
        ui: {
          router: () => '/',
          global: true,
          allowedActions: {
            create: false,
            delete: false,
          },
        },
        fields: [
          {
            type: 'object',
            name: 'tournament',
            label: 'Tournament',
            fields: [
              { type: 'boolean', name: 'enabled', label: 'Show tournament section' },
              { type: 'string', name: 'edition', label: 'Edition', required: true },
              { type: 'string', name: 'date', label: 'Date', required: true },
              { type: 'string', name: 'time', label: 'Time', required: true },
              { type: 'string', name: 'venue', label: 'Venue', required: true },
              { type: 'string', name: 'address', label: 'Address', required: true },
              { type: 'number', name: 'price_player', label: 'Price per player ($)', required: true },
              { type: 'number', name: 'price_foursome', label: 'Price per foursome ($)', required: true },
              { type: 'number', name: 'holes', label: 'Holes', required: true },
              { type: 'string', name: 'format', label: 'Format', required: true },
              { type: 'string', name: 'format_label', label: 'Format label', required: true },
              { type: 'string', name: 'inclusions', label: 'Inclusions', list: true },
              { type: 'string', name: 'add_ons', label: 'Event-day add-ons', list: true },
              { type: 'string', name: 'auction_description', label: 'Auction description', ui: { component: 'textarea' } },
              { type: 'string', name: 'section_headline', label: 'Section headline', required: true },
              { type: 'string', name: 'section_intro', label: 'Section intro', ui: { component: 'textarea' } },
              { type: 'string', name: 'course_description', label: 'Course description', ui: { component: 'textarea' } },
              { type: 'string', name: 'register_headline', label: 'Register headline', required: true },
              { type: 'string', name: 'register_intro', label: 'Register intro', ui: { component: 'textarea' } },
              { type: 'string', name: 'arrive_by', label: 'Arrive by', required: true },
              // required: false is deliberate on both datetime fields below —
              // Tina's datetime picker defaults an empty required-unset field
              // to "today", so leaving this off would silently write today's
              // date the first time the form is opened.
              { type: 'datetime', name: 'registration_closes', label: 'Registration closes (optional)', required: false, ui: { timeFormat: false } },
              // Gates the whole tournament section (course info, pricing, footer,
              // nav links) — separate from registration_closes above, which only
              // gates the register CTA. Deliberately not reusing the free-text
              // `date` field below to avoid migrating it.
              { type: 'datetime', name: 'event_date', label: 'Tournament date (for auto-hide, optional)', required: false, ui: { timeFormat: false } },
              { type: 'string', name: 'registration_closed_message', label: 'Registration closed message' },
              { type: 'string', name: 'register_cta_label', label: 'Register button label' },
              { type: 'string', name: 'hero_headline_line1', label: 'Hero headline line 1' },
              { type: 'string', name: 'hero_headline_line2', label: 'Hero headline line 2' },
              { type: 'string', name: 'hero_cta_label', label: 'Hero button label' },
              { type: 'string', name: 'map_embed_url', label: 'Map embed URL', ui: { component: 'textarea' } },
              {
                type: 'object',
                name: 'photos',
                label: 'Photos',
                fields: [
                  { type: 'image', name: 'hero', label: 'Hero photo' },
                  { type: 'string', name: 'hero_alt', label: 'Hero photo description (alt text)' },
                  { type: 'image', name: 'event', label: 'Main event photo' },
                  { type: 'string', name: 'event_alt', label: 'Main event photo description (alt text)' },
                  { type: 'image', name: 'course_1', label: 'Course photo 1' },
                  { type: 'string', name: 'course_1_alt', label: 'Course photo 1 description (alt text)' },
                  { type: 'image', name: 'course_2', label: 'Course photo 2' },
                  { type: 'string', name: 'course_2_alt', label: 'Course photo 2 description (alt text)' },
                ],
              },
            ],
          },
          {
            type: 'object',
            name: 'site',
            label: 'Site Content',
            fields: [
              { type: 'string', name: 'copyright', label: 'Copyright line', required: true },
              {
                type: 'object',
                name: 'social',
                label: 'Social links',
                fields: [
                  { type: 'string', name: 'facebook', label: 'Facebook URL' },
                  { type: 'string', name: 'instagram', label: 'Instagram URL' },
                ],
              },
              {
                type: 'object',
                name: 'hero_mission',
                label: 'Hero - Mission slide',
                fields: [
                  { type: 'string', name: 'badge', label: 'Badge text' },
                  { type: 'string', name: 'headline_line1', label: 'Headline line 1' },
                  { type: 'string', name: 'headline_line2', label: 'Headline line 2 (before accent)' },
                  { type: 'string', name: 'headline_accent', label: 'Headline accent word (red)' },
                  { type: 'string', name: 'body', label: 'Body', ui: { component: 'textarea' } },
                  { type: 'string', name: 'cta_primary', label: 'Primary button label' },
                  { type: 'string', name: 'cta_secondary', label: 'Secondary button label' },
                ],
              },
              {
                type: 'object',
                name: 'donate',
                label: 'Donate section',
                fields: [
                  { type: 'string', name: 'headline', label: 'Headline' },
                  { type: 'string', name: 'body', label: 'Body', ui: { component: 'textarea' } },
                  { type: 'string', name: 'cta_label', label: 'Button label' },
                ],
              },
              {
                type: 'object',
                name: 'sponsor_cta',
                label: 'Sponsor CTA section',
                fields: [
                  { type: 'string', name: 'headline_line1', label: 'Headline line 1' },
                  { type: 'string', name: 'headline_line2', label: 'Headline line 2' },
                  { type: 'string', name: 'intro', label: 'Intro', ui: { component: 'textarea' } },
                  { type: 'string', name: 'cta_label', label: 'Button label' },
                ],
              },
            ],
          },
          {
            type: 'object',
            name: 'contacts',
            label: 'Contacts',
            fields: [
              {
                type: 'object',
                name: 'players',
                label: 'Players contact',
                fields: [
                  { type: 'string', name: 'name', label: 'Name', required: true },
                  { type: 'string', name: 'email', label: 'Email', required: true },
                ],
              },
              {
                type: 'object',
                name: 'sponsorship',
                label: 'Sponsorship contacts',
                list: true,
                ui: { itemProps: (item) => ({ label: item?.name }) },
                fields: [
                  { type: 'string', name: 'name', label: 'Name', required: true },
                  { type: 'string', name: 'email', label: 'Email', required: true },
                ],
              },
            ],
          },
          {
            type: 'object',
            name: 'sponsors',
            label: 'Sponsors',
            fields: [
              { type: 'string', name: 'label', label: 'Strip heading' },
              {
                type: 'object',
                name: 'items',
                label: 'Sponsors',
                list: true,
                ui: { itemProps: (item) => ({ label: item?.name }) },
                fields: [
                  { type: 'string', name: 'name', label: 'Name', required: true },
                  { type: 'image', name: 'logo', label: 'Logo', required: true },
                  { type: 'string', name: 'alt', label: 'Alt text', required: true },
                  { type: 'string', name: 'url', label: 'Website URL' },
                  { type: 'boolean', name: 'enabled', label: 'Enabled' },
                ],
              },
            ],
          },
          {
            type: 'object',
            name: 'programs',
            label: 'Programs',
            fields: [
              { type: 'string', name: 'kicker', label: 'Section label' },
              { type: 'string', name: 'intro', label: 'Intro line' },
              { type: 'string', name: 'items', label: 'Programs', list: true },
            ],
          },
          {
            type: 'object',
            name: 'store',
            label: 'Apparel Store Promo',
            fields: [
              { type: 'boolean', name: 'enabled', label: 'Show store promotion' },
              { type: 'string', name: 'url', label: 'Store URL', required: true },
              // required: false on both dates — see the note on
              // tournament.registration_closes above for why this matters.
              // Blank open_date = already open; blank close_date = no deadline.
              { type: 'datetime', name: 'open_date', label: 'Store opens (optional)', required: false, ui: { timeFormat: false } },
              { type: 'datetime', name: 'close_date', label: 'Store closes (last day to order)', required: false, ui: { timeFormat: false } },
              { type: 'string', name: 'announcement', label: 'Announcement bar text' },
              { type: 'string', name: 'headline', label: 'Section headline' },
              { type: 'string', name: 'body', label: 'Section body', ui: { component: 'textarea' } },
              { type: 'string', name: 'cta_label', label: 'Button label' },
              {
                type: 'object',
                name: 'products',
                label: 'Product photos',
                list: true,
                ui: { itemProps: (item) => ({ label: item?.alt }) },
                fields: [
                  { type: 'image', name: 'image', label: 'Photo', required: true },
                  { type: 'string', name: 'alt', label: 'Alt text', required: true },
                ],
              },
            ],
          },
          {
            type: 'object',
            name: 'stat_band',
            label: 'Stat Band (off-season)',
            fields: [
              {
                type: 'object',
                name: 'items',
                label: 'Stats',
                list: true,
                ui: { itemProps: (item) => ({ label: item?.label }) },
                fields: [
                  { type: 'string', name: 'value', label: 'Value' },
                  { type: 'string', name: 'label', label: 'Label' },
                ],
              },
            ],
          },
          {
            type: 'object',
            name: 'sponsor_benefits',
            label: 'Sponsor Benefits',
            fields: [{ type: 'string', name: 'items', label: 'Benefits', list: true }],
          },
          {
            type: 'object',
            name: 'get_involved',
            label: 'Get Involved Cards',
            fields: [
              { type: 'string', name: 'kicker', label: 'Section label' },
              { type: 'string', name: 'headline', label: 'Headline' },
              {
                type: 'object',
                name: 'items',
                label: 'Cards',
                list: true,
                ui: { itemProps: (item) => ({ label: item?.title }) },
                fields: [
                  { type: 'string', name: 'title', label: 'Title', required: true },
                  { type: 'string', name: 'description', label: 'Description', ui: { component: 'textarea' } },
                  { type: 'string', name: 'link_label', label: 'Link label' },
                  { type: 'string', name: 'form', label: 'Form key' },
                  { type: 'string', name: 'form_title', label: 'Form title' },
                  { type: 'string', name: 'url', label: 'External link URL' },
                  { type: 'boolean', name: 'store_link', label: 'Hide with store schedule' },
                  { type: 'boolean', name: 'coming_soon', label: 'Coming soon' },
                ],
              },
            ],
          },
          {
            type: 'object',
            name: 'about',
            label: 'About / Mission',
            fields: [
              { type: 'string', name: 'title', label: 'Title', required: true },
              { type: 'rich-text', name: 'body', label: 'Body' },
            ],
          },
          {
            type: 'object',
            name: 'grants',
            label: 'Grants',
            fields: [
              { type: 'string', name: 'kicker', label: 'Section label' },
              { type: 'string', name: 'headline', label: 'Headline' },
              {
                type: 'object',
                name: 'items',
                label: 'Grant Cards',
                list: true,
                ui: { itemProps: (item) => ({ label: item?.title }) },
                fields: [
                  { type: 'string', name: 'audience', label: 'Audience label', required: true },
                  { type: 'string', name: 'title', label: 'Title', required: true },
                  { type: 'string', name: 'body', label: 'Body', ui: { component: 'textarea' } },
                  { type: 'string', name: 'cta_label', label: 'CTA label', required: true },
                  { type: 'string', name: 'form', label: 'Form key', required: true },
                ],
              },
            ],
          },
        ],
      },
      {
        name: 'forms',
        label: 'Forms',
        path: 'src/data',
        format: 'json',
        match: { include: 'forms' },
        ui: {
          global: true,
          allowedActions: {
            create: false,
            delete: false,
          },
        },
        fields: [
          {
            type: 'string',
            name: 'registration',
            label: 'Tournament registration form URL',
            ui: { component: 'textarea' },
          },
          {
            type: 'string',
            name: 'sponsorship',
            label: 'Sponsorship inquiry form URL',
            ui: { component: 'textarea' },
          },
          {
            type: 'string',
            name: 'donate',
            label: 'Donate form URL',
            ui: { component: 'textarea' },
          },
          {
            type: 'string',
            name: 'team_grant',
            label: 'Team grant form URL',
            ui: { component: 'textarea' },
          },
          {
            type: 'string',
            name: 'scholarship',
            label: 'Scholarship form URL',
            ui: { component: 'textarea' },
          },
        ],
      },
    ],
  },
});
