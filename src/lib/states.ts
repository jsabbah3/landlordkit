/** Canonical list of US states + DC, with URL slugs used for programmatic pages. */
export interface USState {
  code: string; // USPS code, e.g. "MA"
  name: string; // e.g. "Massachusetts"
  slug: string; // e.g. "massachusetts"
}

export const US_STATES: USState[] = [
  ["AL", "Alabama"], ["AK", "Alaska"], ["AZ", "Arizona"], ["AR", "Arkansas"],
  ["CA", "California"], ["CO", "Colorado"], ["CT", "Connecticut"], ["DE", "Delaware"],
  ["DC", "District of Columbia"], ["FL", "Florida"], ["GA", "Georgia"], ["HI", "Hawaii"],
  ["ID", "Idaho"], ["IL", "Illinois"], ["IN", "Indiana"], ["IA", "Iowa"],
  ["KS", "Kansas"], ["KY", "Kentucky"], ["LA", "Louisiana"], ["ME", "Maine"],
  ["MD", "Maryland"], ["MA", "Massachusetts"], ["MI", "Michigan"], ["MN", "Minnesota"],
  ["MS", "Mississippi"], ["MO", "Missouri"], ["MT", "Montana"], ["NE", "Nebraska"],
  ["NV", "Nevada"], ["NH", "New Hampshire"], ["NJ", "New Jersey"], ["NM", "New Mexico"],
  ["NY", "New York"], ["NC", "North Carolina"], ["ND", "North Dakota"], ["OH", "Ohio"],
  ["OK", "Oklahoma"], ["OR", "Oregon"], ["PA", "Pennsylvania"], ["RI", "Rhode Island"],
  ["SC", "South Carolina"], ["SD", "South Dakota"], ["TN", "Tennessee"], ["TX", "Texas"],
  ["UT", "Utah"], ["VT", "Vermont"], ["VA", "Virginia"], ["WA", "Washington"],
  ["WV", "West Virginia"], ["WI", "Wisconsin"], ["WY", "Wyoming"],
].map(([code, name]) => ({
  code,
  name,
  slug: name.toLowerCase().replace(/\s+/g, "-"),
}));

const BY_SLUG = new Map(US_STATES.map((s) => [s.slug, s]));
const BY_CODE = new Map(US_STATES.map((s) => [s.code, s]));

export const getStateBySlug = (slug: string): USState | undefined =>
  BY_SLUG.get(slug);
export const getStateByCode = (code: string): USState | undefined =>
  BY_CODE.get(code);
export const allStateSlugs = (): string[] => US_STATES.map((s) => s.slug);
