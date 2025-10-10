'use client';

import { memo, useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store';

import Image from 'next/image';

import BackButton from './components/ui/BackButton';
import BackgroundOverlay from './components/ui/BackgroundOverlay';
import CollapsedToggle from './components/ui/CollapsedToggle';
import ImageOverlay from './components/ui/ImageOverlay';
import PanelLayout from './components/layout/PanelLayout';
import ChecklistHeaderSection from './components/sections/ChecklistHeaderSection';
import ChecklistSection from './components/sections/ChecklistSection';
import { defaultPanelConfig } from './data/checklistItems';
import { useChecklistPanel } from './hooks/useChecklistPanel';

import type { ChecklistPanelProps, FilterType } from './types';

const ChecklistPanel = memo(
  ({
    isCollapsed,
    onToggle,
    conversationId,
    cityInfo,
    heroImage,
    title = defaultPanelConfig.title,
    subtitle = defaultPanelConfig.subtitle,
    onChecklistToggle,
    onChecklistEdit,
    onChecklistDelete,
    onChecklistAdd,
  }: ChecklistPanelProps) => {
    // Filter is UI-only state, managed locally
    const [filter, setFilter] = useState<FilterType>('all');

    // Check if current conversation has any completed checklists
    const bannersByConversation = useSelector(
      (state: RootState) => state.checklist.bannersByConversation,
    );
    const hasChecklists = conversationId
      ? bannersByConversation[conversationId]?.some((banner) => banner.status === 'completed') ??
        false
      : false;

    // Unified hook - provides all data and handlers
    const {
      stats,
      itemsToRender,
      displayData,
      imageError,
      setImageError,
      handlers,
    } = useChecklistPanel({
      filter,
      conversationId,
      cityInfo,
      heroImage,
      title,
      subtitle,
      onChecklistToggle,
      onChecklistEdit,
      onChecklistDelete,
      onChecklistAdd,
    });

    return (
      <>
        <PanelLayout isCollapsed={isCollapsed}>
          {/* Background Elements */}
          <BackgroundOverlay />

          {/* Background Image */}
          <div className="absolute left-0 right-0 top-0 z-[1] h-[33.33%] overflow-hidden">
            <Image
              src={
                displayData.image ||
                'https://images.unsplash.com/photo-1624138784614-87fd1b6528f8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80'
              }
              alt="Background"
              fill
              sizes="(max-width: 768px) 100vw, 40vw"
              className="object-cover object-center"
              priority
              onError={() => {
                if (!imageError) {
                  setImageError(true);
                }
              }}
            />
            <ImageOverlay />
          </div>

          {/* Main Content */}
          <div className="relative z-10 flex h-full flex-col p-6 pt-[calc(33.33%+24px)]">
            {/* Back Button */}
            <BackButton onClick={onToggle} />

            {/* Header Section */}
            <ChecklistHeaderSection
              title={displayData.title}
              subtitle={displayData.subtitle}
              cityName={displayData.name}
              stats={stats}
              filter={filter}
              onFilterChange={setFilter}
            />

            {/* Checklist Section */}
            <ChecklistSection items={itemsToRender} filter={filter} handlers={handlers} />
          </div>
        </PanelLayout>

        {/* Collapsed Toggle Button - Only show when there are checklists */}
        {isCollapsed && hasChecklists && <CollapsedToggle onToggle={onToggle} />}
      </>
    );
  },
);

ChecklistPanel.displayName = 'ChecklistPanel';

export default ChecklistPanel;
