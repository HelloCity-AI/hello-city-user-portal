import { memo } from 'react';
import { mergeClassNames } from '@/utils/classNames';
import type { PanelLayoutProps } from '../../types';

const PanelLayout = memo(
  ({ isCollapsed, children }: Pick<PanelLayoutProps, 'isCollapsed' | 'children'>) => {
    return (
      // Layer 1: Width Animation Container - Controls layout space occupation
      <div
        className={mergeClassNames(
          'relative z-10 h-screen flex-none overflow-visible p-4',
          'transition-[width,max-width,min-width] duration-300 ease-out',
          isCollapsed
            ? 'w-0 min-w-0 max-w-0'
            : 'w-[min(40vw,560px)] min-w-[min(40vw,560px)] max-w-[min(40vw,560px)]',
        )}
      >
        {/* Layer 2: Transform Animation Container - Controls visual sliding effect */}
        <div
          className={mergeClassNames(
            'absolute inset-y-0 right-0 flex',
            'w-[min(40vw,560px)] max-w-[min(40vw,560px)]',
            'transition-transform duration-300',
            isCollapsed ? 'translate-x-full' : 'translate-x-0',
          )}
        >
          {/* Layer 3: Visual Panel Container - Handles styling and content layout */}
          <div
            className={mergeClassNames(
              'relative m-2 flex flex-1 flex-col overflow-hidden rounded-xl',
              'shadow-[0_0_40px_rgba(0,0,0,0.15),0_0_80px_rgba(0,0,0,0.1)]',
              'border border-white/50',
              isCollapsed ? 'pointer-events-none' : 'pointer-events-auto',
            )}
          >
            {children}
          </div>
        </div>
      </div>
    );
  },
);

PanelLayout.displayName = 'PanelLayout';

export default PanelLayout;
