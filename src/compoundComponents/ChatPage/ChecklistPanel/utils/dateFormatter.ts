/**
 * Formats ISO date string to human-readable format
 *
 * @param isoDateString - ISO 8601 date string (e.g., "2025-01-15T00:00:00.000Z")
 * @returns Formatted date string (e.g., "Jan 15")
 */
export function formatDueDate(isoDateString: string): string {
  try {
    const date = new Date(isoDateString);

    // Check if date is valid
    if (isNaN(date.getTime())) {
      return isoDateString; // Return original if invalid
    }

    const now = new Date();
    const diffInMs = date.getTime() - now.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    // Today
    if (diffInDays === 0) {
      return 'Today';
    }

    // Tomorrow
    if (diffInDays === 1) {
      return 'Tomorrow';
    }

    // Yesterday
    if (diffInDays === -1) {
      return 'Yesterday';
    }

    // Within 7 days (future)
    if (diffInDays > 0 && diffInDays <= 7) {
      return `In ${diffInDays} days`;
    }

    // Past dates within 7 days
    if (diffInDays < 0 && diffInDays >= -7) {
      return `${Math.abs(diffInDays)} days ago`;
    }

    // Same year - show month and day only
    if (date.getFullYear() === now.getFullYear()) {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }

    // Different year - show full date
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return isoDateString;
  }
}

/**
 * Get urgency color based on due date
 *
 * @param isoDateString - ISO 8601 date string
 * @returns Color class name for urgency indication
 */
export function getDueDateUrgencyColor(isoDateString: string): string {
  try {
    const date = new Date(isoDateString);
    const now = new Date();
    const diffInMs = date.getTime() - now.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    // Overdue (past)
    if (diffInDays < 0) {
      return 'bg-red-100 text-red-700';
    }

    // Due today or tomorrow (urgent)
    if (diffInDays <= 1) {
      return 'bg-orange-100 text-orange-700';
    }

    // Due within 7 days (warning)
    if (diffInDays <= 7) {
      return 'bg-yellow-100 text-yellow-700';
    }

    // Normal (future)
    return 'bg-gray-100 text-gray-700';
  } catch (error) {
    return 'bg-gray-100 text-gray-700';
  }
}
