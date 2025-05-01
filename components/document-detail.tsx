import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useMutation } from "@tanstack/react-query";
import { AIAnalysisPanel } from "@/components/ai-analysis-panel";
import { DocumentAnalytics } from "@/components/document-analytics";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface DocumentDetailProps {
  document: any; // Using any for now to avoid type issues during refactoring
  onClose: () => void;
  documentType: "judicial" | "contract";
}

export function DocumentDetail({ document, onClose, documentType }: DocumentDetailProps) {
  const renderMetadata = () => {
    if (documentType === "judicial") {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-sm">
          <div>
            <p className="text-muted-foreground">Case Number</p>
            <p className="font-medium">{document.caseNumber || "N/A"}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Date</p>
            <p className="font-medium">{document.date || "N/A"}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Jurisdiction</p>
            <p className="font-medium">{document.jurisdiction || "N/A"}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Judge</p>
            <p className="font-medium">{document.judge || "N/A"}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Parties</p>
            <p className="font-medium">{document.parties || "N/A"}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Category</p>
            <p className="font-medium">{document.category || "N/A"}</p>
          </div>
        </div>
      );
    } else {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-sm">
          <div>
            <p className="text-muted-foreground">Industry</p>
            <p className="font-medium">{document.industry || "N/A"}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Contract Type</p>
            <p className="font-medium">{document.contractType || "N/A"}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Pages</p>
            <p className="font-medium">{document.pages || "N/A"}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Created</p>
            <p className="font-medium">
              {document.createdAt
                ? new Date(document.createdAt).toLocaleDateString()
                : "N/A"}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Updated</p>
            <p className="font-medium">
              {document.updatedAt
                ? new Date(document.updatedAt).toLocaleDateString()
                : "N/A"}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Downloads</p>
            <p className="font-medium">{document.downloads || 0}</p>
          </div>
        </div>
      );
    }
  };

  const downloadMutation = useMutation({
    mutationFn: () => {
      const url = `/api/${
        documentType === "judicial" ? "judicial-decisions" : "labor-contracts"
      }/${document.id}/download`;
      
      // For a real download, we would use a fetch with appropriate headers
      // and handle the response as a blob to trigger a file download
      // For now, we're just simulating the API call
      return fetch(url, { method: "POST" }).then((res) => res.json());
    },
  });

  const handleDownload = () => {
    downloadMutation.mutate();
  };

  return (
    <Dialog open onOpenChange={() => onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{document.title}</DialogTitle>
          <DialogDescription>
            <div className="flex gap-2 mt-2">
              {document.tags?.map((tag: string, index: number) => (
                <Badge key={index} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="content" className="mt-4">
          <TabsList>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="metadata">Metadata</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="ai-analysis">AI Analysis</TabsTrigger>
          </TabsList>
          
          <TabsContent value="content" className="mt-4">
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <div dangerouslySetInnerHTML={{ __html: document.content }} />
            </div>
          </TabsContent>
          
          <TabsContent value="metadata" className="mt-4">
            {renderMetadata()}
          </TabsContent>
          
          <TabsContent value="analytics" className="mt-4">
            <DocumentAnalytics document={document} documentType={documentType} />
          </TabsContent>
          
          <TabsContent value="ai-analysis" className="mt-4">
            <AIAnalysisPanel document={document} documentType={documentType} />
          </TabsContent>
        </Tabs>
        
        <DialogFooter className="mt-6">
          <Button
            variant="outline" 
            onClick={handleDownload} 
            disabled={downloadMutation.isPending}
          >
            {downloadMutation.isPending ? "Downloading..." : "Download Document"}
          </Button>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}