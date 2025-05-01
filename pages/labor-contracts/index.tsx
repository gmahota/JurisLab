import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import MainLayout from '../../client/src/components/layout/main-layout';
import { DocumentList } from '../../client/src/components/document-list';
import { DocumentDetail } from '../../client/src/components/document-detail';
import { FiltersPanel } from '../../client/src/components/filters-panel';
import { Button } from '../../client/src/components/ui/button';
import { apiRequest } from '../../client/src/lib/queryClient';
import { LaborContract } from '../../shared/schema';
import { FilterX, SlidersHorizontal } from 'lucide-react';

export default function LaborContracts() {
  const [selectedContract, setSelectedContract] = useState<LaborContract | null>(null);
  const [isFiltersPanelOpen, setIsFiltersPanelOpen] = useState(false);
  const [filters, setFilters] = useState({
    contractTypes: [],
    industries: [],
    sortOrder: 'recent',
    searchQuery: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const hasActiveFilters = filters.contractTypes.length > 0 || filters.industries.length > 0 || filters.searchQuery;

  const { data, isLoading } = useQuery({
    queryKey: [
      '/api/labor-contracts', 
      filters.contractTypes.join(','), 
      filters.industries.join(','), 
      filters.sortOrder,
      filters.searchQuery,
      currentPage
    ],
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      if (filters.contractTypes.length) queryParams.append('contractTypes', filters.contractTypes.join(','));
      if (filters.industries.length) queryParams.append('industries', filters.industries.join(','));
      if (filters.sortOrder) queryParams.append('sortOrder', filters.sortOrder);
      if (filters.searchQuery) queryParams.append('searchQuery', filters.searchQuery);
      queryParams.append('page', currentPage.toString());
      queryParams.append('limit', pageSize.toString());
      
      return apiRequest<{
        contracts: LaborContract[];
        total: number;
        page: number;
        pageSize: number;
        totalPages: number;
      }>('GET', `/api/labor-contracts?${queryParams.toString()}`);
    },
  });

  const handleContractClick = (contract: LaborContract) => {
    setSelectedContract(contract);
  };

  const handleCloseContractDetail = () => {
    setSelectedContract(null);
  };

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset page when filters change
  };

  const clearFilters = () => {
    setFilters({
      contractTypes: [],
      industries: [],
      sortOrder: 'recent',
      searchQuery: '',
    });
    setCurrentPage(1);
  };

  const contracts = data?.contracts || [];
  const totalPages = data?.totalPages || 1;

  return (
    <MainLayout>
      <div className="container mx-auto p-4 flex h-full">
        <div className={`flex-1 ${selectedContract ? 'hidden md:block' : ''}`}>
          <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Labor Contracts</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                {isLoading ? 'Loading...' : `${data?.total || 0} contracts found`}
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
            documents={contracts}
            isLoading={isLoading}
            onDocumentClick={handleContractClick}
            documentType="contract"
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            emptyMessage="No labor contracts found. Try adjusting your filters."
          />
        </div>
        
        {selectedContract && (
          <DocumentDetail
            document={selectedContract}
            onClose={handleCloseContractDetail}
            documentType="contract"
          />
        )}
        
        {isFiltersPanelOpen && (
          <FiltersPanel
            filters={filters}
            onFilterChange={handleFilterChange}
            onClose={() => setIsFiltersPanelOpen(false)}
            type="contracts"
          />
        )}
      </div>
    </MainLayout>
  );
}