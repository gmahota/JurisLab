import { LaborContract } from "@shared/schema";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bookmark, Download, Edit } from "lucide-react";
import { formatDate, getContractTypeColor } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useState } from "react";

interface TemplateCardProps {
  template: LaborContract;
}

export function TemplateCard({ template }: TemplateCardProps) {
  const [loading, setLoading] = useState(false);

  const badgeColors = getContractTypeColor(template.contractType);
  
  const { mutate: incrementDownloads } = useMutation({
    mutationFn: async () => {
      return apiRequest('POST', `/api/labor-contracts/${template.id}/download`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/labor-contracts'] });
      queryClient.invalidateQueries({ queryKey: ['/api/recent-documents'] });
    },
  });

  const { mutate: trackView } = useMutation({
    mutationFn: async () => {
      return apiRequest('POST', '/api/history', {
        documentType: 'contract',
        documentId: template.id,
        action: 'viewed'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/history'] });
    }
  });

  const { mutate: toggleFavorite } = useMutation({
    mutationFn: async () => {
      return apiRequest('POST', '/api/favorites', {
        documentType: 'contract',
        documentId: template.id
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/favorites'] });
    }
  });

  const handleDownload = () => {
    setLoading(true);
    incrementDownloads();
    
    // Simulate download delay
    setTimeout(() => {
      setLoading(false);
      
      // Track the download in history
      apiRequest('POST', '/api/history', {
        documentType: 'contract',
        documentId: template.id,
        action: 'downloaded'
      }).then(() => {
        queryClient.invalidateQueries({ queryKey: ['/api/history'] });
      });
    }, 1000);
  };

  const handlePreview = () => {
    trackView();
    // This would open a preview in a real implementation
  };

  return (
    <Card className="bg-white dark:bg-slate-800 rounded-lg shadow hover:shadow-md transition-shadow">
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-3">
          <Badge className={`${badgeColors.bg} ${badgeColors.text} ${badgeColors.darkBg} ${badgeColors.darkText} font-medium`}>
            {template.contractType}
          </Badge>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Updated {formatDate(template.updatedAt)}
          </span>
        </div>
        <h3 className="font-medium text-slate-900 dark:text-white mb-2">{template.title}</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{template.description}</p>
        <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
          <span className="flex items-center mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file-text mr-1"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/></svg>
            {template.pages} pages
          </span>
          <span className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-download mr-1"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
            {template.downloads} downloads
          </span>
        </div>
      </CardContent>
      <CardFooter className="border-t border-slate-200 dark:border-slate-700 px-5 py-3 flex justify-between">
        <Button 
          size="sm" 
          onClick={handlePreview}
          className="px-3 py-1 text-xs bg-primary-600 hover:bg-primary-700 text-white rounded"
        >
          Preview
        </Button>
        <div className="flex space-x-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => toggleFavorite()}
            className="text-xs text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400"
          >
            <Bookmark className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleDownload}
            className={`text-xs text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={loading}
          >
            <Download className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-xs text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400"
          >
            <Edit className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
