import type { UIMessage } from 'ai';
import type { ChecklistMetadata } from '@/compoundComponents/ChatPage/ChecklistPanel/types';

/**
 * Extended message part types for custom content
 * Following Vercel AI SDK data part convention: type="data-<name>"
 */
export type ChecklistDataPart = {
  type: 'data-checklist';
  id?: string;
  data: ChecklistMetadata;
};

/**
 * Extended UIMessage that supports custom part types
 */
export type ExtendedUIMessage = Omit<UIMessage, 'parts'> & {
  parts: Array<UIMessage['parts'][number] | ChecklistDataPart>;
};

/**
 * Type guard to check if a part is a checklist data part
 */
export function isChecklistDataPart(
  part: ExtendedUIMessage['parts'][number],
): part is ChecklistDataPart {
  return (part as ChecklistDataPart).type === 'data-checklist';
}
