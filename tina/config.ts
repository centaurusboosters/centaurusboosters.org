import { defineConfig } from 'tinacms';

const branch =
  process.env.NEXT_PUBLIC_TINA_BRANCH ||
  process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF ||
  process.env.HEAD ||
  'main';

export default defineConfig({
  branch,
  build: {
    publicFolder: 'public',
    outputFolder: 'admin',
  },
  media: {
    tina: {
      publicFolder: 'public',
      mediaRoot: 'assets',
    },
  },
  schema: {
    collections: [
      {
        name: 'sponsors',
        label: 'Sponsors',
        path: 'src/data',
        format: 'json',
        match: { include: 'sponsors' },
        ui: {
          allowedActions: {
            create: false,
            delete: false,
          },
        },
        fields: [
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
              { type: 'boolean', name: 'enabled', label: 'Enabled' },
            ],
          },
        ],
      },
      {
        name: 'tournament',
        label: 'Tournament Details',
        path: 'src/data',
        format: 'json',
        match: { include: 'tournament' },
        ui: {
          allowedActions: {
            create: false,
            delete: false,
          },
        },
        fields: [
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
        ],
      },
      {
        name: 'contacts',
        label: 'Contacts',
        path: 'src/data',
        format: 'json',
        match: { include: 'contacts' },
        ui: {
          allowedActions: {
            create: false,
            delete: false,
          },
        },
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
        name: 'sponsor_benefits',
        label: 'Sponsor Benefits',
        path: 'src/data',
        format: 'json',
        match: { include: 'sponsor-benefits' },
        ui: {
          allowedActions: {
            create: false,
            delete: false,
          },
        },
        fields: [{ type: 'string', name: 'items', label: 'Benefits', list: true }],
      },
      {
        name: 'get_involved',
        label: 'Get Involved Cards',
        path: 'src/data',
        format: 'json',
        match: { include: 'get-involved' },
        ui: {
          allowedActions: {
            create: false,
            delete: false,
          },
        },
        fields: [
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
              { type: 'boolean', name: 'coming_soon', label: 'Coming soon' },
            ],
          },
        ],
      },
      {
        name: 'site',
        label: 'Site Content',
        path: 'src/data',
        format: 'json',
        match: { include: 'site' },
        ui: {
          allowedActions: {
            create: false,
            delete: false,
          },
        },
        fields: [
          { type: 'string', name: 'copyright', label: 'Copyright line', required: true },
          {
            type: 'object',
            name: 'social',
            label: 'Social links',
            fields: [{ type: 'string', name: 'facebook', label: 'Facebook URL' }],
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
            ],
          },
          {
            type: 'object',
            name: 'donate',
            label: 'Donate section',
            fields: [
              { type: 'string', name: 'headline', label: 'Headline' },
              { type: 'string', name: 'body', label: 'Body', ui: { component: 'textarea' } },
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
            ],
          },
        ],
      },
      {
        name: 'about',
        label: 'About / Mission',
        path: 'src/content/about',
        format: 'mdx',
        ui: {
          allowedActions: {
            create: false,
            delete: false,
          },
        },
        fields: [
          { type: 'string', name: 'title', label: 'Title', required: true },
          { type: 'rich-text', name: 'body', label: 'Body', isBody: true },
        ],
      },
      {
        name: 'grants',
        label: 'Grants',
        path: 'src/content/grants',
        format: 'mdx',
        ui: {
          allowedActions: {
            create: false,
            delete: false,
          },
        },
        fields: [
          { type: 'string', name: 'audience', label: 'Audience label', required: true },
          { type: 'string', name: 'title', label: 'Title', required: true },
          { type: 'rich-text', name: 'body', label: 'Body', isBody: true },
          { type: 'string', name: 'cta_label', label: 'CTA label', required: true },
          { type: 'string', name: 'form', label: 'Form key', required: true },
          { type: 'string', name: 'theme', label: 'Theme' },
        ],
      },
    ],
  },
});
