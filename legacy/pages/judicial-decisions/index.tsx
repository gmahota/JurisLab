import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { DocumentList } from '../../client/src/components/document-list';
import { DocumentDetail } from '../../client/src/components/document-detail';
import { FiltersPanel } from '../../client/src/components/filters-panel';
import { Button } from '../../client/src/components/ui/button';
import { apiRequest } from '../../client/src/lib/queryClient';
import { JudicialDecision } from '../../shared/schema';
import { FilterX, SlidersHorizontal } from 'lucide-react';

export default function JudicialDecisions() {
  const [selectedDecision, setSelectedDecision] = useState<JudicialDecision | null>(null);
  const [isFiltersPanelOpen, setIsFiltersPanelOpen] = useState(false);
  const [filters, setFilters] = useState({
    dateRange: '',
    jurisdictions: [],
    topics: [],
    sortOrder: 'date_desc',
    searchQuery: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const hasActiveFilters = filters.dateRange || filters.jurisdictions.length > 0 || filters.topics.length > 0 || filters.searchQuery;

  const { data, isLoading } = useQuery({
    queryKey: [
      '/api/judicial-decisions', 
      filters.dateRange, 
      filters.jurisdictions.join(','), 
      filters.topics.join(','), 
      filters.sortOrder,
      filters.searchQuery,
      currentPage
    ],
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      if (filters.dateRange) queryParams.append('dateRange', filters.dateRange);
      if (filters.jurisdictions.length) queryParams.append('jurisdictions', filters.jurisdictions.join(','));
      if (filters.topics.length) queryParams.append('topics', filters.topics.join(','));
      if (filters.sortOrder) queryParams.append('sortOrder', filters.sortOrder);
      if (filters.searchQuery) queryParams.append('searchQuery', filters.searchQuery);
      queryParams.append('page', currentPage.toString());
      queryParams.append('limit', pageSize.toString());
      
      return apiRequest<{
        decisions: JudicialDecision[];
        totalDecisions: number;
        currentPage: number;
        totalPages: number;
      }>('GET', `/api/judicial-decisions?${queryParams.toString()}`);
    },
  });

  const handleDecisionClick = (decision: any) => {
    // Make sure we have all the required fields for a judicial decision
    setSelectedDecision(decision as JudicialDecision);
  };

  const handleCloseDecisionDetail = () => {
    setSelectedDecision(null);
  };

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset page when filters change
  };

  const clearFilters = () => {
    setFilters({
      dateRange: '',
      jurisdictions: [],
      topics: [],
      sortOrder: 'date_desc',
      searchQuery: '',
    });
    setCurrentPage(1);
  };

  const decisions = data?.decisions || [];
  const totalPages = data?.totalPages || 1;

  return (
    <div className="container mx-auto p-4 flex h-full">
      <div className={`flex-1 ${selectedDecision ? 'hidden md:block' : ''}`}>
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Judicial Decisions</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {isLoading ? 'Loading...' : `${data?.totalDecisions || 0} decisions found`}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 self-stretch sm:self-auto">
            {hasActiveFilters && (
              <Button 
                variant="outline" 
                onClick={clearFilters}
                className="gap-2"
              >
                <FilterX className="h-4 w-4" />
                Clear Filters
              </Button>
            )}
            <Button 
              onClick={() => setIsFiltersPanelOpen(true)}
              className="gap-2"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </Button>
          </div>
        </div>
        
        <DocumentList
          documents={decisions}
          isLoading={isLoading}
          onDocumentClick={handleDecisionClick}
          documentType="judicial"
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          emptyMessage="No judicial decisions found. Try adjusting your filters."
        />
      </div>
      
      {selectedDecision && (
        <DocumentDetail
          document={selectedDecision}
          onClose={handleCloseDecisionDetail}
          documentType="judicial"
        />
      )}
      
      {isFiltersPanelOpen && (
        <FiltersPanel
          filters={filters}
          onFilterChange={handleFilterChange}
          onClose={() => setIsFiltersPanelOpen(false)}
          type="judicial"
        />
      )}
    </div>
  );
}