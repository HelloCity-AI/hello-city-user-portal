import type { UIMessage } from 'ai';
import type { ChecklistBanner } from '@/compoundComponents/ChatPage/ChecklistPanel/types';

/**
 * Extended message part types for custom content
 */
export type ChecklistBannerPart = {
  type: 'checklist-banner';
  banner: ChecklistBanner;
};

/**
 * Extended UIMessage that supports custom part types
 */
export type ExtendedUIMessage = Omit<UIMessage, 'parts'> & {
  parts: Array<UIMessage['parts'][number] | ChecklistBannerPart>;
};

/**
 * Type guard to check if a part is a checklist banner
 */
export function isChecklistBannerPart(
  part: ExtendedUIMessage['parts'][number],
): part is ChecklistBannerPart {
  return (part as ChecklistBannerPart).type === 'checklist-banner';
}
