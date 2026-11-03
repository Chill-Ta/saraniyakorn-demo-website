import { Chip } from '@artsgoz/design-system';
import { useTranslation } from 'react-i18next';

interface CategoryFilterBarProps {
  categories: readonly string[] | string[];
  selectedCategory: string;
  onSelect: (category: string) => void;
}

export function CategoryFilterBar({
  categories,
  selectedCategory,
  onSelect,
}: CategoryFilterBarProps) {
  const { t } = useTranslation('articles');

  const getLabel = (category: string) => {
    if (category === 'all' || category === 'categories.all') {
      return t('categories.all', { defaultValue: 'ทั้งหมด' });
    }
    if (/^\d{4}$/.test(category)) {
      return `ปี ${category}`;
    }
    return t(category, { defaultValue: category });
  };

  return (
    <div className="flex gap-[12px] overflow-x-auto pb-1 -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap md:overflow-visible [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden snap-x">
      {categories.map((category) => (
        <Chip
          key={category}
          size="large"
          selected={selectedCategory === category}
          onClick={() => onSelect(category)}
          className="snap-start"
        >
          {getLabel(category)}
        </Chip>
      ))}
    </div>
  );
}
