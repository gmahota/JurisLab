import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FiltersPanel } from "@/components/filters-panel";
import { useToggle } from "@/hooks/use-toggle";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LaborContract } from "@shared/schema";
import { TemplateCard } from "@/components/template-card";
import { Pagination } from "@/components/pagination";

export default function LaborContracts() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("recent");
  const [filters, setFilters] = useState({
    contractTypes: ["Employment", "Remote Work", "Confidentiality"],
    industries: ["All Industries"]
  });
  
  const [currentPage, setCurrentPage] = useState(1);
  const [filtersPanelOpen, toggleFiltersPanel] = useToggle(false);

  const { data: contractsData, isLoading } = useQuery<{ 
    contracts: LaborContract[],
    totalPages: number 
  }>({
    queryKey: ['/api/labor-contracts', filters, sortOrder, searchQuery, currentPage],
  });

  const handleFilterChange = (newFilters: any) => {
    setFilters({ ...filters, ...newFilters });
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-6 py-4">
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">Labor Contracts</h1>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            onClick={toggleFiltersPanel}
            className="flex items-center"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          <Select value={sortOrder} onValueChange={setSortOrder}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort order" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Sort: Recent</SelectItem>
              <SelectItem value="popular">Sort: Popular</SelectItem>
              <SelectItem value="a-z">Sort: A-Z</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-900 p-6">
        {filtersPanelOpen && (
          <FiltersPanel 
            filters={filters}
            onFilterChange={handleFilterChange}
            onClose={toggleFiltersPanel}
            type="contracts"
          />
        )}
        
        {isLoading ? (
          <div className="flex justify-center p-6">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {contractsData?.contracts.map((contract) => (
                <TemplateCard 
                  key={contract.id}
                  template={contract}
                />
              ))}
            </div>
            
            <Pagination 
              currentPage={currentPage}
              totalPages={contractsData?.totalPages || 1}
              onPageChange={setCurrentPage}
              className="mt-8"
            />
          </>
        )}
      </div>
    </div>
  );
}
