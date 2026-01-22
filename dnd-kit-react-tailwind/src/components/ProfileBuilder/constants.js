import { Layout, Award, Grid, Video, User, Link, Mail } from 'lucide-react';

export const SIDEBAR_CATEGORIES = [
  {
    id: 'design',
    label: 'Design',
    items: [
       { type: 'heroProduct', label: 'Hero Section', icon: Layout },
       { type: 'collectionsGrid', label: 'Grid Layout', icon: Grid },
    ]
  },
  {
    id: 'elements',
    label: 'Elements',
    items: [
       { type: 'trustBadge', label: 'Shapes & Badges', icon: Award },
       { type: 'sellerVideo', label: 'Videos', icon: Video },
       { type: 'socialLinks', label: 'Social Links', icon: Link },
       { type: 'contactButton', label: 'Contact Button', icon: Mail },
    ]
  },
  {
    id: 'text',
    label: 'Text',
    items: [
        { type: 'userName', label: 'Name', icon: User },
        { type: 'userInfo', label: 'User Info', icon: User },
    ]
  },
  {
    id: 'uploads',
    label: 'Uploads',
    items: [] // Placeholder
  },
  {
    id: 'projects',
    label: 'Projects',
    items: [] // Placeholder
  }
];

// Keep flat list for backward compatibility if needed, or helper
export const ALL_SIDEBAR_ITEMS = SIDEBAR_CATEGORIES.flatMap(cat => cat.items);
