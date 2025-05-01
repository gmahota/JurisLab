import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className = "",
}: PaginationProps) {
  // Calculate page ranges to display
  const generatePages = () => {
    // Always show the first and last page
    const pages = new Set<number>();
    pages.add(1);
    pages.add(totalPages);
    
    // Show pages around the current page
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pages.add(i);
    }
    
    return [...pages].sort((a, b) => a - b);
  };
  
  const pages = generatePages();
  
  // Generate page items with ellipsis for gaps
  const pageItems = [];
  let previousPage = 0;
  
  for (const page of pages) {
    // Add ellipsis if there's a gap
    if (page - previousPage > 1) {
      pageItems.push({
        type: "ellipsis",
        key: `ellipsis-${previousPage}-${page}`,
      });
    }
    
    // Add the page
    pageItems.push({
      type: "page",
      key: `page-${page}`,
      page,
    });
    
    previousPage = page;
  }
  
  return (
    <nav className={`flex items-center space-x-1 ${className}`} aria-label="Pagination">
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      
      {pageItems.map((item) => {
        if (item.type === "ellipsis") {
          return (
            <Button
              key={item.key}
              variant="ghost"
              size="icon"
              disabled
              className="cursor-default"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          );
        }
        
        return (
          <Button
            key={item.key}
            variant={currentPage === item.page ? "default" : "outline"}
            size="icon"
            onClick={() => onPageChange(item.page)}
            aria-current={currentPage === item.page ? "page" : undefined}
            aria-label={`Page ${item.page}`}
          >
            {item.page}
          </Button>
        );
      })}
      
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        aria-label="Next page"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </nav>
  );
}