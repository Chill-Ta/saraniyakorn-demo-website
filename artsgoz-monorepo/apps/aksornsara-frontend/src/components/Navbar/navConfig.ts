import { PATHS } from '../../routes/paths.js';
import type { MegaMenuCategory } from './MegaMenu.js';

export interface NavItem {
  /** Translation key — call t(item.label) in components to render the label. */
  label: string;
  path: string;
  hasDropdown?: boolean;
  hasMegaMenu?: boolean;
  megaMenu?: MegaMenuCategory[];
}

export interface DropdownItem {
  /** Translation key — call t(item.label) in components to render the label. */
  label: string;
  path: string;
}

export interface MegaMenuItem {
  label: string;
  path: string;
  isExternal?: boolean;
}

// ─── Nav items for Aksornsara ────────────────────────────────────────────────
// Only "หน้าบทความ" (Articles) and "ที่บันทึกไว้" (Saved)

export const NAV_ITEMS: NavItem[] = [
  { label: 'navbar.articles', path: PATHS.ARTICLES },
  { label: 'navbar.saved', path: `${PATHS.ARTICLES}?tab=saved` },
];

export const DROPDOWN_ITEMS: DropdownItem[] = [];
