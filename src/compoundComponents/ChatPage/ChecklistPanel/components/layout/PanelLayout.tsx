import { memo } from 'react';
import { mergeClassNames } from '@/utils/classNames';
import type { PanelLayoutProps } from '../../types';

const PanelLayout = memo(
  ({ isCollapsed, children }: Pick<PanelLayoutProps, 'isCollapsed' | 'children'>) => {
    return (
      // Layer 1: Width Animation Container - Controls layout space occupation
      <div
        className={mergeClassNames(
          // Mobile: absolute positioning, Desktop: relative
          'absolute xl:relative',
          'inset-y-0 right-0 xl:inset-auto',
          'z-10 h-screen overflow-visible xl:flex-none',
          'transition-[width,max-width,min-width] duration-300 ease-out',
          isCollapsed
            ? 'w-0 min-w-0 max-w-0 p-0'
            : mergeClassNames(
                // Mobile: full width for maximum content area
                'w-full min-w-full max-w-full',
                // Tablet: 60% width
                'md:w-[60vw] md:min-w-[60vw] md:max-w-[60vw]',
                // Desktop: original 40vw
                'xl:w-[min(40vw,560px)] xl:min-w-[min(40vw,560px)] xl:max-w-[min(40vw,560px)]',
                'p-0 xl:p-4',
              ),
        )}
      >
        {/* Layer 2: Transform Animation Container - Controls visual sliding effect */}
        <div
          className={mergeClassNames(
            'absolute inset-y-0 right-0 flex',
            // Mobile: 100vw fullscreen, Tablet: 60vw, Desktop: 40vw
            'w-screen md:w-[60vw] xl:w-[min(40vw,560px)]',
            'max-w-screen md:max-w-[60vw] xl:max-w-[min(40vw,560px)]',
            'transition-transform duration-300',
            isCollapsed ? 'translate-x-full' : 'translate-x-0',
          )}
        >
          {/* Layer 3: Visual Panel Container - Handles styling and content layout */}
          <div
            className={mergeClassNames(
              'relative flex flex-1 flex-col overflow-hidden',
              // Mobile: fullscreen (no margin, no rounded), Tablet & Desktop: floating panel
              'm-0 md:m-2',
              'rounded-none md:rounded-xl',
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
