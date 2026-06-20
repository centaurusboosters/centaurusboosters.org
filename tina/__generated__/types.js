export function gql(strings, ...args) {
  let str = "";
  strings.forEach((string, i) => {
    str += string + (args[i] || "");
  });
  return str;
}
export const SponsorsPartsFragmentDoc = gql`
    fragment SponsorsParts on Sponsors {
  __typename
  items {
    __typename
    name
    logo
    alt
    enabled
  }
}
    `;
export const TournamentPartsFragmentDoc = gql`
    fragment TournamentParts on Tournament {
  __typename
  edition
  date
  time
  venue
  address
  price_player
  price_foursome
  holes
  format
  format_label
  inclusions
  add_ons
  auction_description
  section_headline
  section_intro
  course_description
  register_headline
  register_intro
  arrive_by
}
    `;
export const ContactsPartsFragmentDoc = gql`
    fragment ContactsParts on Contacts {
  __typename
  players {
    __typename
    name
    email
  }
  sponsorship {
    __typename
    name
    email
  }
}
    `;
export const Sponsor_BenefitsPartsFragmentDoc = gql`
    fragment Sponsor_benefitsParts on Sponsor_benefits {
  __typename
  items
}
    `;
export const Get_InvolvedPartsFragmentDoc = gql`
    fragment Get_involvedParts on Get_involved {
  __typename
  items {
    __typename
    title
    description
    link_label
    form
    form_title
    coming_soon
  }
}
    `;
export const SitePartsFragmentDoc = gql`
    fragment SiteParts on Site {
  __typename
  copyright
  social {
    __typename
    facebook
  }
  hero_mission {
    __typename
    badge
    headline_line1
    headline_line2
    headline_accent
    body
  }
  donate {
    __typename
    headline
    body
  }
  sponsor_cta {
    __typename
    headline_line1
    headline_line2
    intro
  }
}
    `;
export const AboutPartsFragmentDoc = gql`
    fragment AboutParts on About {
  __typename
  title
  body
}
    `;
export const GrantsPartsFragmentDoc = gql`
    fragment GrantsParts on Grants {
  __typename
  audience
  title
  body
  cta_label
  form
  theme
}
    `;
export const SponsorsDocument = gql`
    query sponsors($relativePath: String!) {
  sponsors(relativePath: $relativePath) {
    ... on Document {
      _sys {
        filename
        basename
        hasReferences
        breadcrumbs
        path
        relativePath
        extension
      }
      id
    }
    ...SponsorsParts
  }
}
    ${SponsorsPartsFragmentDoc}`;
export const SponsorsConnectionDocument = gql`
    query sponsorsConnection($before: String, $after: String, $first: Float, $last: Float, $sort: String, $filter: SponsorsFilter) {
  sponsorsConnection(
    before: $before
    after: $after
    first: $first
    last: $last
    sort: $sort
    filter: $filter
  ) {
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
    totalCount
    edges {
      cursor
      node {
        ... on Document {
          _sys {
            filename
            basename
            hasReferences
            breadcrumbs
            path
            relativePath
            extension
          }
          id
        }
        ...SponsorsParts
      }
    }
  }
}
    ${SponsorsPartsFragmentDoc}`;
export const TournamentDocument = gql`
    query tournament($relativePath: String!) {
  tournament(relativePath: $relativePath) {
    ... on Document {
      _sys {
        filename
        basename
        hasReferences
        breadcrumbs
        path
        relativePath
        extension
      }
      id
    }
    ...TournamentParts
  }
}
    ${TournamentPartsFragmentDoc}`;
export const TournamentConnectionDocument = gql`
    query tournamentConnection($before: String, $after: String, $first: Float, $last: Float, $sort: String, $filter: TournamentFilter) {
  tournamentConnection(
    before: $before
    after: $after
    first: $first
    last: $last
    sort: $sort
    filter: $filter
  ) {
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
    totalCount
    edges {
      cursor
      node {
        ... on Document {
          _sys {
            filename
            basename
            hasReferences
            breadcrumbs
            path
            relativePath
            extension
          }
          id
        }
        ...TournamentParts
      }
    }
  }
}
    ${TournamentPartsFragmentDoc}`;
export const ContactsDocument = gql`
    query contacts($relativePath: String!) {
  contacts(relativePath: $relativePath) {
    ... on Document {
      _sys {
        filename
        basename
        hasReferences
        breadcrumbs
        path
        relativePath
        extension
      }
      id
    }
    ...ContactsParts
  }
}
    ${ContactsPartsFragmentDoc}`;
export const ContactsConnectionDocument = gql`
    query contactsConnection($before: String, $after: String, $first: Float, $last: Float, $sort: String, $filter: ContactsFilter) {
  contactsConnection(
    before: $before
    after: $after
    first: $first
    last: $last
    sort: $sort
    filter: $filter
  ) {
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
    totalCount
    edges {
      cursor
      node {
        ... on Document {
          _sys {
            filename
            basename
            hasReferences
            breadcrumbs
            path
            relativePath
            extension
          }
          id
        }
        ...ContactsParts
      }
    }
  }
}
    ${ContactsPartsFragmentDoc}`;
export const Sponsor_BenefitsDocument = gql`
    query sponsor_benefits($relativePath: String!) {
  sponsor_benefits(relativePath: $relativePath) {
    ... on Document {
      _sys {
        filename
        basename
        hasReferences
        breadcrumbs
        path
        relativePath
        extension
      }
      id
    }
    ...Sponsor_benefitsParts
  }
}
    ${Sponsor_BenefitsPartsFragmentDoc}`;
export const Sponsor_BenefitsConnectionDocument = gql`
    query sponsor_benefitsConnection($before: String, $after: String, $first: Float, $last: Float, $sort: String, $filter: Sponsor_benefitsFilter) {
  sponsor_benefitsConnection(
    before: $before
    after: $after
    first: $first
    last: $last
    sort: $sort
    filter: $filter
  ) {
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
    totalCount
    edges {
      cursor
      node {
        ... on Document {
          _sys {
            filename
            basename
            hasReferences
            breadcrumbs
            path
            relativePath
            extension
          }
          id
        }
        ...Sponsor_benefitsParts
      }
    }
  }
}
    ${Sponsor_BenefitsPartsFragmentDoc}`;
export const Get_InvolvedDocument = gql`
    query get_involved($relativePath: String!) {
  get_involved(relativePath: $relativePath) {
    ... on Document {
      _sys {
        filename
        basename
        hasReferences
        breadcrumbs
        path
        relativePath
        extension
      }
      id
    }
    ...Get_involvedParts
  }
}
    ${Get_InvolvedPartsFragmentDoc}`;
export const Get_InvolvedConnectionDocument = gql`
    query get_involvedConnection($before: String, $after: String, $first: Float, $last: Float, $sort: String, $filter: Get_involvedFilter) {
  get_involvedConnection(
    before: $before
    after: $after
    first: $first
    last: $last
    sort: $sort
    filter: $filter
  ) {
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
    totalCount
    edges {
      cursor
      node {
        ... on Document {
          _sys {
            filename
            basename
            hasReferences
            breadcrumbs
            path
            relativePath
            extension
          }
          id
        }
        ...Get_involvedParts
      }
    }
  }
}
    ${Get_InvolvedPartsFragmentDoc}`;
export const SiteDocument = gql`
    query site($relativePath: String!) {
  site(relativePath: $relativePath) {
    ... on Document {
      _sys {
        filename
        basename
        hasReferences
        breadcrumbs
        path
        relativePath
        extension
      }
      id
    }
    ...SiteParts
  }
}
    ${SitePartsFragmentDoc}`;
export const SiteConnectionDocument = gql`
    query siteConnection($before: String, $after: String, $first: Float, $last: Float, $sort: String, $filter: SiteFilter) {
  siteConnection(
    before: $before
    after: $after
    first: $first
    last: $last
    sort: $sort
    filter: $filter
  ) {
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
    totalCount
    edges {
      cursor
      node {
        ... on Document {
          _sys {
            filename
            basename
            hasReferences
            breadcrumbs
            path
            relativePath
            extension
          }
          id
        }
        ...SiteParts
      }
    }
  }
}
    ${SitePartsFragmentDoc}`;
export const AboutDocument = gql`
    query about($relativePath: String!) {
  about(relativePath: $relativePath) {
    ... on Document {
      _sys {
        filename
        basename
        hasReferences
        breadcrumbs
        path
        relativePath
        extension
      }
      id
    }
    ...AboutParts
  }
}
    ${AboutPartsFragmentDoc}`;
export const AboutConnectionDocument = gql`
    query aboutConnection($before: String, $after: String, $first: Float, $last: Float, $sort: String, $filter: AboutFilter) {
  aboutConnection(
    before: $before
    after: $after
    first: $first
    last: $last
    sort: $sort
    filter: $filter
  ) {
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
    totalCount
    edges {
      cursor
      node {
        ... on Document {
          _sys {
            filename
            basename
            hasReferences
            breadcrumbs
            path
            relativePath
            extension
          }
          id
        }
        ...AboutParts
      }
    }
  }
}
    ${AboutPartsFragmentDoc}`;
export const GrantsDocument = gql`
    query grants($relativePath: String!) {
  grants(relativePath: $relativePath) {
    ... on Document {
      _sys {
        filename
        basename
        hasReferences
        breadcrumbs
        path
        relativePath
        extension
      }
      id
    }
    ...GrantsParts
  }
}
    ${GrantsPartsFragmentDoc}`;
export const GrantsConnectionDocument = gql`
    query grantsConnection($before: String, $after: String, $first: Float, $last: Float, $sort: String, $filter: GrantsFilter) {
  grantsConnection(
    before: $before
    after: $after
    first: $first
    last: $last
    sort: $sort
    filter: $filter
  ) {
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
    totalCount
    edges {
      cursor
      node {
        ... on Document {
          _sys {
            filename
            basename
            hasReferences
            breadcrumbs
            path
            relativePath
            extension
          }
          id
        }
        ...GrantsParts
      }
    }
  }
}
    ${GrantsPartsFragmentDoc}`;
export function getSdk(requester) {
  return {
    sponsors(variables, options) {
      return requester(SponsorsDocument, variables, options);
    },
    sponsorsConnection(variables, options) {
      return requester(SponsorsConnectionDocument, variables, options);
    },
    tournament(variables, options) {
      return requester(TournamentDocument, variables, options);
    },
    tournamentConnection(variables, options) {
      return requester(TournamentConnectionDocument, variables, options);
    },
    contacts(variables, options) {
      return requester(ContactsDocument, variables, options);
    },
    contactsConnection(variables, options) {
      return requester(ContactsConnectionDocument, variables, options);
    },
    sponsor_benefits(variables, options) {
      return requester(Sponsor_BenefitsDocument, variables, options);
    },
    sponsor_benefitsConnection(variables, options) {
      return requester(Sponsor_BenefitsConnectionDocument, variables, options);
    },
    get_involved(variables, options) {
      return requester(Get_InvolvedDocument, variables, options);
    },
    get_involvedConnection(variables, options) {
      return requester(Get_InvolvedConnectionDocument, variables, options);
    },
    site(variables, options) {
      return requester(SiteDocument, variables, options);
    },
    siteConnection(variables, options) {
      return requester(SiteConnectionDocument, variables, options);
    },
    about(variables, options) {
      return requester(AboutDocument, variables, options);
    },
    aboutConnection(variables, options) {
      return requester(AboutConnectionDocument, variables, options);
    },
    grants(variables, options) {
      return requester(GrantsDocument, variables, options);
    },
    grantsConnection(variables, options) {
      return requester(GrantsConnectionDocument, variables, options);
    }
  };
}
import { createClient } from "tinacms/dist/client";
const generateRequester = (client) => {
  const requester = async (doc, vars, options) => {
    let url = client.apiUrl;
    if (options?.branch) {
      const index = client.apiUrl.lastIndexOf("/");
      url = client.apiUrl.substring(0, index + 1) + options.branch;
    }
    const data = await client.request({
      query: doc,
      variables: vars,
      url
    }, options);
    return { data: data?.data, errors: data?.errors, query: doc, variables: vars || {} };
  };
  return requester;
};
export const ExperimentalGetTinaClient = () => getSdk(
  generateRequester(
    createClient({
      url: "http://localhost:4001/graphql",
      queries
    })
  )
);
export const queries = (client) => {
  const requester = generateRequester(client);
  return getSdk(requester);
};
