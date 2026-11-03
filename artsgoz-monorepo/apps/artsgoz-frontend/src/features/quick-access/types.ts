import { LucideIcon } from 'lucide-react';

export interface FeatureMenu {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  iconName?: string;
  isExternal?: boolean;
}
