export const COMMON_STYLES = [
  { name: 'backgroundColor', label: 'Background Color', type: 'color', default: '#ffffff' },
  { name: 'textColor', label: 'Text Color', type: 'color', default: '#111827' },
  { name: 'paddingTop', label: 'Top Padding', type: 'range', min: 0, max: 24, default: 8 },
  { name: 'paddingBottom', label: 'Bottom Padding', type: 'range', min: 0, max: 24, default: 8 },
];

export const COMPONENT_SCHEMAS = {
  heroProduct: {
    label: 'Hero Product',
    fields: [
      { name: 'subtitle', label: 'Subtitle', type: 'text', default: 'Best Seller' },
      { name: 'title', label: 'Title', type: 'text', default: 'Premium Leather Backpack' },
      { name: 'description', label: 'Description', type: 'textarea', default: 'Handcrafted from full-grain leather, this backpack is built to last a lifetime. Features a padded laptop sleeve and multiple organizer pockets.' },
      { name: 'price', label: 'Price', type: 'text', default: '$129.00' },
      { name: 'originalPrice', label: 'Original Price', type: 'text', default: '$189.00' },
      { name: 'buttonText', label: 'Button Text', type: 'text', default: 'Buy Now' },
    ],
    styles: [...COMMON_STYLES]
  },
  trustBadge: {
    label: 'Trust Badges',
    fields: [
      { name: 'badge1Title', label: 'Badge 1 Title', type: 'text', default: 'Verified Seller' },
      { name: 'badge1Text', label: 'Badge 1 Text', type: 'text', default: 'Identity confirmed' },
      { name: 'badge2Title', label: 'Badge 2 Title', type: 'text', default: '99% Positive' },
      { name: 'badge2Text', label: 'Badge 2 Text', type: 'text', default: 'Based on 1.2k reviews' },
      { name: 'badge3Title', label: 'Badge 3 Title', type: 'text', default: 'Fast Shipper' },
      { name: 'badge3Text', label: 'Badge 3 Text', type: 'text', default: 'Ships within 24h' },
    ],
    styles: [...COMMON_STYLES, { name: 'accentColor', label: 'Icon Color', type: 'color', default: '#4f46e5' }]
  },
  collectionsGrid: {
    label: 'Collections Grid',
    fields: [
      { name: 'title', label: 'Section Title', type: 'text', default: 'Featured Collections' },
      { name: 'col1Name', label: 'Collection 1 Name', type: 'text', default: 'New Arrivals' },
      { name: 'col1Count', label: 'Collection 1 Count', type: 'text', default: '42 items' },
      { name: 'col2Name', label: 'Collection 2 Name', type: 'text', default: 'Best Sellers' },
      { name: 'col2Count', label: 'Collection 2 Count', type: 'text', default: '18 items' },
      { name: 'col3Name', label: 'Collection 3 Name', type: 'text', default: 'Accessories' },
      { name: 'col3Count', label: 'Collection 3 Count', type: 'text', default: '56 items' },
      { name: 'col4Name', label: 'Collection 4 Name', type: 'text', default: 'Sale' },
      { name: 'col4Count', label: 'Collection 4 Count', type: 'text', default: '24 items' },
    ],
    styles: [...COMMON_STYLES]
  },
  sellerVideo: {
    label: 'Seller Video',
    fields: [
      { name: 'title', label: 'Video Title', type: 'text', default: 'Meet the Maker: Studio Tour' },
      { name: 'description', label: 'Description', type: 'textarea', default: 'Join us behind the scenes to see how we craft our products with care and attention to detail.' },
    ],
    styles: [...COMMON_STYLES]
  },
};

export const getDefaultsForType = (type) => {
  const schema = COMPONENT_SCHEMAS[type];
  if (!schema) return {};

  const content = schema.fields.reduce((acc, field) => {
    acc[field.name] = field.default;
    return acc;
  }, {});

  const styles = schema.styles ? schema.styles.reduce((acc, field) => {
      acc[field.name] = field.default;
      return acc;
  }, {}) : {};

  return { ...content, ...styles };
};
