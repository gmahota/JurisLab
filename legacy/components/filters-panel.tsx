import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { X } from "lucide-react";

interface FiltersProps {
  filters: any;
  onFilterChange: (filters: any) => void;
  onClose: () => void;
  type?: "judicial" | "contracts";
}

export function FiltersPanel({ filters, onFilterChange, onClose, type = "judicial" }: FiltersProps) {
  const [localFilters, setLocalFilters] = useState({ ...filters });

  const handleDateRangeChange = (value: string) => {
    setLocalFilters({ ...localFilters, dateRange: value });
  };

  const handleJurisdictionChange = (jurisdiction: string, checked: boolean) => {
    let jurisdictions = [...(localFilters.jurisdictions || [])];
    
    if (checked) {
      jurisdictions.push(jurisdiction);
    } else {
      jurisdictions = jurisdictions.filter(j => j !== jurisdiction);
    }
    
    setLocalFilters({ ...localFilters, jurisdictions });
  };

  const handleTopicChange = (topic: string, checked: boolean) => {
    let topics = [...(localFilters.topics || [])];
    
    if (checked) {
      topics.push(topic);
    } else {
      topics = topics.filter(t => t !== topic);
    }
    
    setLocalFilters({ ...localFilters, topics });
  };

  const handleContractTypeChange = (contractType: string, checked: boolean) => {
    let contractTypes = [...(localFilters.contractTypes || [])];
    
    if (checked) {
      contractTypes.push(contractType);
    } else {
      contractTypes = contractTypes.filter(c => c !== contractType);
    }
    
    setLocalFilters({ ...localFilters, contractTypes });
  };

  const handleIndustryChange = (industry: string, checked: boolean) => {
    let industries = [...(localFilters.industries || [])];
    
    if (checked) {
      industries.push(industry);
    } else {
      industries = industries.filter(i => i !== industry);
    }
    
    setLocalFilters({ ...localFilters, industries });
  };

  const handleApplyFilters = () => {
    onFilterChange(localFilters);
    onClose();
  };

  const handleClearFilters = () => {
    if (type === "judicial") {
      setLocalFilters({
        dateRange: "all",
        jurisdictions: ["Supreme Court", "Federal Court", "State Court", "Administrative"],
        topics: []
      });
    } else {
      setLocalFilters({
        contractTypes: ["Employment", "Remote Work", "Confidentiality", "Consulting", "Termination", "Collective"],
        industries: ["All Industries"]
      });
    }
  };

  return (
    <div className="w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col overflow-hidden">
      <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
        <h2 className="font-medium text-slate-900 dark:text-white">Filters</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <ScrollArea className="flex-1 p-4">
        {type === "judicial" ? (
          <div className="space-y-6">
            {/* Date Range */}
            <div>
              <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-2">Date Range</h3>
              <RadioGroup value={localFilters.dateRange} onValueChange={handleDateRangeChange}>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <RadioGroupItem id="date-all" value="all" />
                    <Label htmlFor="date-all" className="ml-2 text-sm text-slate-700 dark:text-slate-300">All time</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem id="date-year" value="year" />
                    <Label htmlFor="date-year" className="ml-2 text-sm text-slate-700 dark:text-slate-300">Past year</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem id="date-month" value="month" />
                    <Label htmlFor="date-month" className="ml-2 text-sm text-slate-700 dark:text-slate-300">Past month</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem id="date-custom" value="custom" />
                    <Label htmlFor="date-custom" className="ml-2 text-sm text-slate-700 dark:text-slate-300">Custom range</Label>
                  </div>
                </div>
              </RadioGroup>
            </div>
            
            {/* Jurisdiction */}
            <div>
              <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-2">Jurisdiction</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Checkbox 
                    id="jur-supreme" 
                    checked={localFilters.jurisdictions?.includes("Supreme Court")}
                    onCheckedChange={(checked) => handleJurisdictionChange("Supreme Court", !!checked)}
                  />
                  <Label htmlFor="jur-supreme" className="ml-2 text-sm text-slate-700 dark:text-slate-300">Supreme Court</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox 
                    id="jur-federal" 
                    checked={localFilters.jurisdictions?.includes("Federal Court")}
                    onCheckedChange={(checked) => handleJurisdictionChange("Federal Court", !!checked)}
                  />
                  <Label htmlFor="jur-federal" className="ml-2 text-sm text-slate-700 dark:text-slate-300">Federal Courts</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox 
                    id="jur-state" 
                    checked={localFilters.jurisdictions?.includes("State Court")}
                    onCheckedChange={(checked) => handleJurisdictionChange("State Court", !!checked)}
                  />
                  <Label htmlFor="jur-state" className="ml-2 text-sm text-slate-700 dark:text-slate-300">State Courts</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox 
                    id="jur-admin"
                    checked={localFilters.jurisdictions?.includes("Administrative")}
                    onCheckedChange={(checked) => handleJurisdictionChange("Administrative", !!checked)}
                  />
                  <Label htmlFor="jur-admin" className="ml-2 text-sm text-slate-700 dark:text-slate-300">Administrative Tribunals</Label>
                </div>
              </div>
            </div>
            
            {/* Legal Topics */}
            <div>
              <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-2">Legal Topics</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Checkbox 
                    id="topic-labor" 
                    checked={localFilters.topics?.includes("Labor Law")}
                    onCheckedChange={(checked) => handleTopicChange("Labor Law", !!checked)}
                  />
                  <Label htmlFor="topic-labor" className="ml-2 text-sm text-slate-700 dark:text-slate-300">Labor Law</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox 
                    id="topic-const" 
                    checked={localFilters.topics?.includes("Constitutional Law")}
                    onCheckedChange={(checked) => handleTopicChange("Constitutional Law", !!checked)}
                  />
                  <Label htmlFor="topic-const" className="ml-2 text-sm text-slate-700 dark:text-slate-300">Constitutional Law</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox 
                    id="topic-admin" 
                    checked={localFilters.topics?.includes("Administrative Law")}
                    onCheckedChange={(checked) => handleTopicChange("Administrative Law", !!checked)}
                  />
                  <Label htmlFor="topic-admin" className="ml-2 text-sm text-slate-700 dark:text-slate-300">Administrative Law</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox 
                    id="topic-civil" 
                    checked={localFilters.topics?.includes("Civil Law")}
                    onCheckedChange={(checked) => handleTopicChange("Civil Law", !!checked)}
                  />
                  <Label htmlFor="topic-civil" className="ml-2 text-sm text-slate-700 dark:text-slate-300">Civil Law</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox 
                    id="topic-crim" 
                    checked={localFilters.topics?.includes("Criminal Law")}
                    onCheckedChange={(checked) => handleTopicChange("Criminal Law", !!checked)}
                  />
                  <Label htmlFor="topic-crim" className="ml-2 text-sm text-slate-700 dark:text-slate-300">Criminal Law</Label>
                </div>
              </div>
              <Button variant="link" size="sm" className="text-xs text-primary-600 dark:text-primary-400 mt-2 px-0">
                Show more topics
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Contract Type */}
            <div>
              <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-2">Contract Type</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Checkbox 
                    id="type-employment" 
                    checked={localFilters.contractTypes?.includes("Employment")}
                    onCheckedChange={(checked) => handleContractTypeChange("Employment", !!checked)}
                  />
                  <Label htmlFor="type-employment" className="ml-2 text-sm text-slate-700 dark:text-slate-300">Employment</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox 
                    id="type-remote" 
                    checked={localFilters.contractTypes?.includes("Remote Work")}
                    onCheckedChange={(checked) => handleContractTypeChange("Remote Work", !!checked)}
                  />
                  <Label htmlFor="type-remote" className="ml-2 text-sm text-slate-700 dark:text-slate-300">Remote Work</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox 
                    id="type-confidentiality" 
                    checked={localFilters.contractTypes?.includes("Confidentiality")}
                    onCheckedChange={(checked) => handleContractTypeChange("Confidentiality", !!checked)}
                  />
                  <Label htmlFor="type-confidentiality" className="ml-2 text-sm text-slate-700 dark:text-slate-300">Confidentiality</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox 
                    id="type-consulting" 
                    checked={localFilters.contractTypes?.includes("Consulting")}
                    onCheckedChange={(checked) => handleContractTypeChange("Consulting", !!checked)}
                  />
                  <Label htmlFor="type-consulting" className="ml-2 text-sm text-slate-700 dark:text-slate-300">Consulting</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox 
                    id="type-termination" 
                    checked={localFilters.contractTypes?.includes("Termination")}
                    onCheckedChange={(checked) => handleContractTypeChange("Termination", !!checked)}
                  />
                  <Label htmlFor="type-termination" className="ml-2 text-sm text-slate-700 dark:text-slate-300">Termination</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox 
                    id="type-collective" 
                    checked={localFilters.contractTypes?.includes("Collective")}
                    onCheckedChange={(checked) => handleContractTypeChange("Collective", !!checked)}
                  />
                  <Label htmlFor="type-collective" className="ml-2 text-sm text-slate-700 dark:text-slate-300">Collective</Label>
                </div>
              </div>
            </div>
            
            {/* Industry */}
            <div>
              <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-2">Industry</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Checkbox 
                    id="industry-all" 
                    checked={localFilters.industries?.includes("All Industries")}
                    onCheckedChange={(checked) => handleIndustryChange("All Industries", !!checked)}
                  />
                  <Label htmlFor="industry-all" className="ml-2 text-sm text-slate-700 dark:text-slate-300">All Industries</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox 
                    id="industry-tech" 
                    checked={localFilters.industries?.includes("Technology")}
                    onCheckedChange={(checked) => handleIndustryChange("Technology", !!checked)}
                  />
                  <Label htmlFor="industry-tech" className="ml-2 text-sm text-slate-700 dark:text-slate-300">Technology</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox 
                    id="industry-healthcare" 
                    checked={localFilters.industries?.includes("Healthcare")}
                    onCheckedChange={(checked) => handleIndustryChange("Healthcare", !!checked)}
                  />
                  <Label htmlFor="industry-healthcare" className="ml-2 text-sm text-slate-700 dark:text-slate-300">Healthcare</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox 
                    id="industry-finance" 
                    checked={localFilters.industries?.includes("Finance")}
                    onCheckedChange={(checked) => handleIndustryChange("Finance", !!checked)}
                  />
                  <Label htmlFor="industry-finance" className="ml-2 text-sm text-slate-700 dark:text-slate-300">Finance</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox 
                    id="industry-manufacturing" 
                    checked={localFilters.industries?.includes("Manufacturing")}
                    onCheckedChange={(checked) => handleIndustryChange("Manufacturing", !!checked)}
                  />
                  <Label htmlFor="industry-manufacturing" className="ml-2 text-sm text-slate-700 dark:text-slate-300">Manufacturing</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox 
                    id="industry-retail" 
                    checked={localFilters.industries?.includes("Retail")}
                    onCheckedChange={(checked) => handleIndustryChange("Retail", !!checked)}
                  />
                  <Label htmlFor="industry-retail" className="ml-2 text-sm text-slate-700 dark:text-slate-300">Retail</Label>
                </div>
              </div>
            </div>
          </div>
        )}
      </ScrollArea>
      
      <div className="p-4 border-t border-slate-200 dark:border-slate-700 flex justify-between">
        <Button variant="ghost" onClick={handleClearFilters} className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">
          Clear filters
        </Button>
        <Button onClick={handleApplyFilters} className="text-sm text-primary-600 dark:text-primary-400 font-medium hover:text-primary-800 dark:hover:text-primary-300">
          Apply filters
        </Button>
      </div>
    </div>
  );
}
