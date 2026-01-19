import { Layout, Award, Grid, Video } from 'lucide-react';

export const SIDEBAR_CATEGORIES = [
  {
    id: 'commerce',
    label: 'Commerce',
    items: [
      { type: 'heroProduct', label: 'Hero Product', icon: Layout },
      { type: 'collectionsGrid', label: 'Collections Grid', icon: Grid },
    ]
  },
  {
    id: 'content',
    label: 'Content & Media',
    items: [
      { type: 'trustBadge', label: 'Trust Badges', icon: Award },
      { type: 'sellerVideo', label: 'Seller Video', icon: Video },
    ]
  }
];

// Keep flat list for backward compatibility if needed, or helper
export const ALL_SIDEBAR_ITEMS = SIDEBAR_CATEGORIES.flatMap(cat => cat.items);
