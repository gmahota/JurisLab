import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { DocumentList } from "@/components/document-list";
import { FiltersPanel } from "@/components/filters-panel";
import { DocumentDetail } from "@/components/document-detail";
import { JudicialDecision } from "@shared/schema";
import { useToggle } from "@/hooks/use-toggle";
import { Filter, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function JudicialDecisions() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("recent");
  const [filters, setFilters] = useState({
    dateRange: "all",
    jurisdictions: ["Supreme Court", "Federal Court", "State Court"],
    topics: ["Labor Law"]
  });
  
  const [selectedDecision, setSelectedDecision] = useState<JudicialDecision | null>(null);
  const [filtersPanelOpen, toggleFiltersPanel] = useToggle(false);
  const [documentPanelOpen, setDocumentPanelOpen] = useState(false);

  const { data: decisions, isLoading } = useQuery<JudicialDecision[]>({
    queryKey: ['/api/judicial-decisions', filters, sortOrder, searchQuery],
  });

  const handleDecisionClick = (decision: JudicialDecision) => {
    setSelectedDecision(decision);
    setDocumentPanelOpen(true);
  };

  const handleFilterChange = (newFilters: any) => {
    setFilters({ ...filters, ...newFilters });
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-6 py-4">
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">Judicial Decisions</h1>
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
              <SelectItem value="relevant">Sort: Relevant</SelectItem>
              <SelectItem value="date_asc">Sort: Date (asc)</SelectItem>
              <SelectItem value="date_desc">Sort: Date (desc)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="flex-1 flex overflow-hidden">
        {filtersPanelOpen && (
          <FiltersPanel 
            filters={filters}
            onFilterChange={handleFilterChange}
            onClose={toggleFiltersPanel}
          />
        )}
        
        <DocumentList 
          documents={decisions || []}
          isLoading={isLoading}
          onDocumentClick={handleDecisionClick}
          documentType="judicial"
        />
        
        {documentPanelOpen && selectedDecision && (
          <DocumentDetail 
            document={selectedDecision}
            onClose={() => setDocumentPanelOpen(false)}
            documentType="judicial"
          />
        )}
      </div>
    </div>
  );
}
