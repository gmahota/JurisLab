import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

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
  if (!date) return "N/A";
  
  try {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return dateObj instanceof Date && !isNaN(dateObj.getTime())
      ? dateObj.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "N/A";
  } catch (error) {
    return "N/A";
  }
}

/**
 * Truncates text to a specified length and adds ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (!text) return "";
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
}

/**
 * Returns a color scheme for a given jurisdiction
 */
export function getJurisdictionColor(jurisdiction: string): {
  textColor: string;
  bgColor: string;
  borderColor: string;
} {
  const hash = jurisdiction.split("").reduce((hash, char) => {
    return (hash * 31 + char.charCodeAt(0)) % 8;
  }, 0);

  const colorSchemes = [
    { textColor: "text-blue-700", bgColor: "bg-blue-50", borderColor: "border-blue-200" },
    { textColor: "text-green-700", bgColor: "bg-green-50", borderColor: "border-green-200" },
    { textColor: "text-purple-700", bgColor: "bg-purple-50", borderColor: "border-purple-200" },
    { textColor: "text-amber-700", bgColor: "bg-amber-50", borderColor: "border-amber-200" },
    { textColor: "text-red-700", bgColor: "bg-red-50", borderColor: "border-red-200" },
    { textColor: "text-indigo-700", bgColor: "bg-indigo-50", borderColor: "border-indigo-200" },
    { textColor: "text-pink-700", bgColor: "bg-pink-50", borderColor: "border-pink-200" },
    { textColor: "text-teal-700", bgColor: "bg-teal-50", borderColor: "border-teal-200" },
  ];

  return colorSchemes[hash];
}

/**
 * Returns a color scheme for a given contract type
 */
export function getContractTypeColor(type: string): {
  textColor: string;
  bgColor: string;
  borderColor: string;
} {
  const typeMap: Record<string, {
    textColor: string;
    bgColor: string;
    borderColor: string;
  }> = {
    "Employment": {
      textColor: "text-blue-700",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200"
    },
    "Non-Disclosure": {
      textColor: "text-purple-700",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200"
    },
    "Service": {
      textColor: "text-green-700",
      bgColor: "bg-green-50",
      borderColor: "border-green-200"
    },
    "Lease": {
      textColor: "text-amber-700",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200"
    },
    "Consulting": {
      textColor: "text-indigo-700",
      bgColor: "bg-indigo-50",
      borderColor: "border-indigo-200"
    },
    "Partnership": {
      textColor: "text-pink-700",
      bgColor: "bg-pink-50",
      borderColor: "border-pink-200"
    },
    "Vendor": {
      textColor: "text-teal-700",
      bgColor: "bg-teal-50",
      borderColor: "border-teal-200"
    },
  };

  return typeMap[type] || {
    textColor: "text-gray-700",
    bgColor: "bg-gray-50",
    borderColor: "border-gray-200"
  };
}