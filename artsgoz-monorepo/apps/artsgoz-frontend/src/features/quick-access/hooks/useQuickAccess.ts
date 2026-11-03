import { useState } from 'react';
import { DEFAULT_SERIALIZABLE_MENUS, ICON_MAP } from '../constants.js';
import { FeatureMenu } from '../types.js';
import { HelpCircle } from 'lucide-react';

interface SerializableFeatureMenu {
  title: string;
  description: string;
  iconName: string;
  href: string;
  isExternal?: boolean;
}

const LOCAL_STORAGE_KEY = 'artsgoz_quick_access';

function resolveMenus(serializable: SerializableFeatureMenu[]): FeatureMenu[] {
  return serializable.map((m) => ({
    title: m.title,
    description: m.description,
    icon: ICON_MAP[m.iconName] || HelpCircle,
    href: m.href,
    iconName: m.iconName,
    isExternal: m.isExternal,
  }));
}

function loadInitialMenus(): FeatureMenu[] {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved) as SerializableFeatureMenu[];
      if (parsed && parsed.length > 0) {
        return resolveMenus(parsed);
      }
    }
  } catch (e) {
    console.error('Failed to parse quick access menus from localStorage', e);
  }
  return resolveMenus(DEFAULT_SERIALIZABLE_MENUS);
}

export function useQuickAccess() {
  const [menus, setMenus] = useState<FeatureMenu[]>(loadInitialMenus);

  const saveMenus = (newMenus: FeatureMenu[]) => {
    const serializable: SerializableFeatureMenu[] = newMenus.map((m) => ({
      title: m.title,
      description: m.description,
      iconName: m.iconName || 'Link2',
      href: m.href,
      isExternal: m.isExternal,
    }));
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(serializable));
    setMenus(newMenus);
  };

  const addMenu = (newMenu: { title: string; description: string; iconName: string; href: string; isExternal?: boolean }) => {
    const resolved: FeatureMenu = {
      title: newMenu.title,
      description: newMenu.description,
      icon: ICON_MAP[newMenu.iconName] || HelpCircle,
      href: newMenu.href,
      iconName: newMenu.iconName,
      isExternal: newMenu.isExternal,
    };

    const updated = [...menus, resolved];
    saveMenus(updated);
  };

  const deleteMenu = (indexToDelete: number) => {
    const updated = menus.filter((_, idx) => idx !== indexToDelete);
    saveMenus(updated);
  };

  const resetMenus = () => {
    const resolved = resolveMenus(DEFAULT_SERIALIZABLE_MENUS);
    saveMenus(resolved);
  };

  return {
    menus,
    addMenu,
    deleteMenu,
    resetMenus,
  };
}
