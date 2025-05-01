import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({ currentPage, totalPages, onPageChange, className }: PaginationProps) {
  const generatePagination = () => {
    // Always show first and last pages
    // Show ellipsis if needed
    const pages = [];
    const ellipsis = <span key="ellipsis" className="text-slate-400 dark:text-slate-600">...</span>;
    
    if (totalPages <= 5) {
      // If 5 or fewer pages, show all
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show page 1
      pages.push(1);
      
      if (currentPage <= 3) {
        // Near start: show 1, 2, 3, ..., totalPages
        pages.push(2, 3);
        pages.push(ellipsis);
      } else if (currentPage >= totalPages - 2) {
        // Near end: show 1, ..., totalPages-2, totalPages-1, totalPages
        pages.push(ellipsis);
        pages.push(totalPages - 2, totalPages - 1);
      } else {
        // Middle: show 1, ..., currentPage-1, currentPage, currentPage+1, ..., totalPages
        pages.push(ellipsis);
        pages.push(currentPage - 1, currentPage, currentPage + 1);
        pages.push(ellipsis);
      }
      
      // Always show last page
      pages.push(totalPages);
    }
    
    return pages;
  };

  return (
    <div className={cn("flex items-center justify-between", className)}>
      <Button
        variant="ghost"
        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center text-sm text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400"
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        Previous
      </Button>
      
      <div className="flex items-center space-x-1">
        {generatePagination().map((page, index) => 
          typeof page === "number" ? (
            <Button
              key={index}
              variant={page === currentPage ? "default" : "ghost"}
              onClick={() => onPageChange(page)}
              className={cn(
                "w-8 h-8 p-0",
                page === currentPage 
                  ? "bg-primary-600 text-white" 
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              )}
            >
              {page}
            </Button>
          ) : (
            page
          )
        )}
      </div>
      
      <Button
        variant="ghost"
        onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center text-sm text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400"
      >
        Next
        <ChevronRight className="h-4 w-4 ml-1" />
      </Button>
    </div>
  );
}
