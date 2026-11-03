import { Link } from 'react-router';

export interface MegaMenuCategory {
  /** Display label for the category tab */
  label: string;
  /** Links to show in this category's column */
  items: MegaMenuItem[];
}

export interface MegaMenuItem {
  label: string;
  path: string;
  isExternal?: boolean;
}

interface MegaMenuProps {
  categories: MegaMenuCategory[];
  onClose: () => void;
}

const FONT_FAMILY = 'ChulaCharasNew, sans-serif';

export function MegaMenu({ categories, onClose }: MegaMenuProps) {
  return (
    <div
      className="fixed left-0 right-0 bg-white z-50 shadow-[0px_10px_30px_rgba(0,0,0,0.12)] border-b border-[#E5E5E5] transition-all"
      style={{ top: '81px' }}
    >
      {/* Inner container */}
      <div className="max-w-[1282px] mx-auto px-6 lg:px-12 py-8">
        {/* 6 Category Columns Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 xl:gap-8">
          {categories.map((cat) => (
            <div key={cat.label} className="flex flex-col gap-3 min-w-0">
              <span
                style={{
                  fontFamily: FONT_FAMILY,
                  fontWeight: 700,
                  fontSize: '18px',
                  lineHeight: '26px',
                  color: 'var(--color-grey-900, #404041)',
                }}
                className="pb-1 block min-h-[44px] flex items-end"
              >
                {cat.label}
              </span>
              <div className="flex flex-col gap-2">
                {cat.items.map((item) => {
                  const isExt = item.isExternal || item.path.startsWith('http');
                  const itemStyle = {
                    fontFamily: FONT_FAMILY,
                    fontWeight: 400,
                    fontSize: '16px',
                    lineHeight: '24px',
                    color: 'var(--color-grey-800, #545455)',
                  };
                  if (isExt) {
                    return (
                      <a
                        key={item.path + item.label}
                        href={item.path}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={onClose}
                        style={itemStyle}
                        className="hover:!text-[#CA5582] transition-colors line-clamp-1 block"
                      >
                        {item.label}
                      </a>
                    );
                  }
                  return (
                    <Link
                      key={item.path + item.label}
                      to={item.path}
                      onClick={onClose}
                      style={itemStyle}
                      className="hover:!text-[#CA5582] transition-colors line-clamp-1 block"
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
