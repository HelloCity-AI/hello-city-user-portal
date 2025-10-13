import type { ChecklistItem, FilterType, ChecklistStats } from '../types';

export const filterChecklistItems = (
  items: ChecklistItem[],
  filter: FilterType,
): ChecklistItem[] => {
  switch (filter) {
    case 'completed':
      return items.filter((item) => item.isComplete);
    case 'incomplete':
      return items.filter((item) => !item.isComplete);
    default:
      return items;
  }
};

export const calculateChecklistStats = (items: ChecklistItem[]): ChecklistStats => {
  const completed = items.filter((item) => item.isComplete).length;
  const total = items.length;
  const progress = total > 0 ? (completed / total) * 100 : 0;

  return { completed, total, progress };
};

export const toggleChecklistItem = (items: ChecklistItem[], itemId: string): ChecklistItem[] => {
  return items.map((item) =>
    item.id === itemId
      ? {
          ...item,
          isComplete: !item.isComplete,
        }
      : item,
  );
};

export const deleteChecklistItem = (items: ChecklistItem[], itemId: string): ChecklistItem[] => {
  return items.filter((item) => item.id !== itemId);
};

export const reorderChecklistItems = (
  items: ChecklistItem[],
  visibleIds: string[],
  reorderedIds: string[],
): ChecklistItem[] => {
  const idToItem = new Map(items.map((item) => [item.id, item]));
  const originalPositions = visibleIds.map((id) =>
    items.findIndex((listItem) => listItem.id === id),
  );

  const nextList = [...items];

  originalPositions.forEach((position, index) => {
    const nextId = reorderedIds[index];
    const nextItem = nextId ? idToItem.get(nextId) : undefined;
    if (position !== -1 && nextItem) {
      nextList[position] = nextItem;
    }
  });

  return nextList;
};

export const getVisibleItemIds = (items: ChecklistItem[]): string[] => {
  return items.map((item) => item.id);
};

export const getItemsToRender = (
  allItems: ChecklistItem[],
  visibleIds: string[],
): ChecklistItem[] => {
  return visibleIds
    .map((id) => allItems.find((item) => item.id === id))
    .filter((item): item is ChecklistItem => Boolean(item));
};

export const isReorderSame = (current: string[], reordered: string[]): boolean => {
  return (
    reordered.length === current.length && reordered.every((id, index) => id === current[index])
  );
};
