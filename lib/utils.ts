import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, parseISO } from "date-fns";

/**
 * Combines multiple class names and Tailwind classes together
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a date into a localized string
 */
export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return "";
  
  try {
    const dateObj = typeof date === "string" ? parseISO(date) : date;
    return format(dateObj, "PPP"); // Format as 'April 29, 2023'
  } catch (error) {
    console.error("Error formatting date:", error);
    return "";
  }
}

/**
 * Truncates text to a specified length and adds ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (!text || text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trim()}...`;
}

/**
 * Returns a color scheme for a given jurisdiction
 */
export function getJurisdictionColor(jurisdiction: string): {
  textColor: string;
  bgColor: string;
  borderColor: string;
} {
  // Map jurisdictions to color schemes
  const colorMap: Record<string, { textColor: string; bgColor: string; borderColor: string }> = {
    "Federal": { 
      textColor: "text-blue-700 dark:text-blue-300", 
      bgColor: "bg-blue-50 dark:bg-blue-950", 
      borderColor: "border-blue-200 dark:border-blue-800" 
    },
    "State": { 
      textColor: "text-green-700 dark:text-green-300", 
      bgColor: "bg-green-50 dark:bg-green-950", 
      borderColor: "border-green-200 dark:border-green-800" 
    },
    "Local": { 
      textColor: "text-purple-700 dark:text-purple-300", 
      bgColor: "bg-purple-50 dark:bg-purple-950", 
      borderColor: "border-purple-200 dark:border-purple-800" 
    },
    "International": { 
      textColor: "text-orange-700 dark:text-orange-300", 
      bgColor: "bg-orange-50 dark:bg-orange-950", 
      borderColor: "border-orange-200 dark:border-orange-800" 
    }
  };

  // Return color scheme or default
  return colorMap[jurisdiction] || { 
    textColor: "text-gray-700 dark:text-gray-300", 
    bgColor: "bg-gray-50 dark:bg-gray-900", 
    borderColor: "border-gray-200 dark:border-gray-800" 
  };
}

/**
 * Returns a color scheme for a given contract type
 */
export function getContractTypeColor(type: string): {
  textColor: string;
  bgColor: string;
  borderColor: string;
} {
  // Map contract types to color schemes
  const colorMap: Record<string, { textColor: string; bgColor: string; borderColor: string }> = {
    "Employment": { 
      textColor: "text-blue-700 dark:text-blue-300", 
      bgColor: "bg-blue-50 dark:bg-blue-950", 
      borderColor: "border-blue-200 dark:border-blue-800" 
    },
    "Service": { 
      textColor: "text-green-700 dark:text-green-300", 
      bgColor: "bg-green-50 dark:bg-green-950", 
      borderColor: "border-green-200 dark:border-green-800" 
    },
    "Confidentiality": { 
      textColor: "text-red-700 dark:text-red-300", 
      bgColor: "bg-red-50 dark:bg-red-950", 
      borderColor: "border-red-200 dark:border-red-800" 
    },
    "Non-Compete": { 
      textColor: "text-purple-700 dark:text-purple-300", 
      bgColor: "bg-purple-50 dark:bg-purple-950", 
      borderColor: "border-purple-200 dark:border-purple-800" 
    },
    "Collective Bargaining": { 
      textColor: "text-orange-700 dark:text-orange-300", 
      bgColor: "bg-orange-50 dark:bg-orange-950", 
      borderColor: "border-orange-200 dark:border-orange-800" 
    }
  };

  // Return color scheme or default
  return colorMap[type] || { 
    textColor: "text-gray-700 dark:text-gray-300", 
    bgColor: "bg-gray-50 dark:bg-gray-900", 
    borderColor: "border-gray-200 dark:border-gray-800" 
  };
}