import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return '';
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj instanceof Date && !isNaN(dateObj.getTime())
      ? new Intl.DateTimeFormat('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        }).format(dateObj)
      : '';
  } catch {
    return '';
  }
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

export function getJurisdictionColor(jurisdiction: string): {
  bg: string;
  text: string;
  darkBg: string;
  darkText: string;
} {
  switch (jurisdiction.toLowerCase()) {
    case 'supreme court':
      return {
        bg: 'bg-blue-100',
        text: 'text-blue-800',
        darkBg: 'dark:bg-blue-900/50',
        darkText: 'dark:text-blue-300'
      };
    case 'federal court':
      return {
        bg: 'bg-green-100',
        text: 'text-green-800',
        darkBg: 'dark:bg-green-900/50',
        darkText: 'dark:text-green-300'
      };
    case 'state court':
      return {
        bg: 'bg-purple-100',
        text: 'text-purple-800',
        darkBg: 'dark:bg-purple-900/50',
        darkText: 'dark:text-purple-300'
      };
    case 'administrative':
      return {
        bg: 'bg-amber-100',
        text: 'text-amber-800',
        darkBg: 'dark:bg-amber-900/50',
        darkText: 'dark:text-amber-300'
      };
    default:
      return {
        bg: 'bg-slate-100',
        text: 'text-slate-800',
        darkBg: 'dark:bg-slate-700',
        darkText: 'dark:text-slate-300'
      };
  }
}

export function getContractTypeColor(type: string): {
  bg: string;
  text: string;
  darkBg: string;
  darkText: string;
} {
  switch (type.toLowerCase()) {
    case 'employment':
    case 'standard employment agreement':
      return {
        bg: 'bg-secondary-100',
        text: 'text-secondary-800',
        darkBg: 'dark:bg-secondary-900/50',
        darkText: 'dark:text-secondary-300'
      };
    case 'remote work':
    case 'remote work agreement':
      return {
        bg: 'bg-secondary-100',
        text: 'text-secondary-800',
        darkBg: 'dark:bg-secondary-900/50',
        darkText: 'dark:text-secondary-300'
      };
    case 'confidentiality':
    case 'non-disclosure agreement':
      return {
        bg: 'bg-secondary-100',
        text: 'text-secondary-800',
        darkBg: 'dark:bg-secondary-900/50',
        darkText: 'dark:text-secondary-300'
      };
    case 'consulting':
    case 'independent contractor agreement':
      return {
        bg: 'bg-secondary-100',
        text: 'text-secondary-800',
        darkBg: 'dark:bg-secondary-900/50',
        darkText: 'dark:text-secondary-300'
      };
    case 'termination':
    case 'separation agreement':
      return {
        bg: 'bg-secondary-100',
        text: 'text-secondary-800',
        darkBg: 'dark:bg-secondary-900/50',
        darkText: 'dark:text-secondary-300'
      };
    case 'collective':
    case 'collective bargaining template':
      return {
        bg: 'bg-secondary-100',
        text: 'text-secondary-800',
        darkBg: 'dark:bg-secondary-900/50',
        darkText: 'dark:text-secondary-300'
      };
    default:
      return {
        bg: 'bg-slate-100',
        text: 'text-slate-800',
        darkBg: 'dark:bg-slate-700',
        darkText: 'dark:text-slate-300'
      };
  }
}
