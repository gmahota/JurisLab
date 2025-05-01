import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { DocumentList } from "@/components/document-list";
import { DocumentDetail } from "@/components/document-detail";
import { JudicialDecision, LaborContract } from "@shared/schema";

type DocumentType = "judicial" | "contract";

export default function Favorites() {
  const [documentType, setDocumentType] = useState<DocumentType>("judicial");
  const [selectedDocument, setSelectedDocument] = useState<JudicialDecision | LaborContract | null>(null);
  const [documentPanelOpen, setDocumentPanelOpen] = useState(false);

  const { data: favorites, isLoading } = useQuery<{
    judicialDecisions: JudicialDecision[],
    laborContracts: LaborContract[]
  }>({
    queryKey: ['/api/favorites'],
  });

  const handleDocumentClick = (document: JudicialDecision | LaborContract) => {
    setSelectedDocument(document);
    setDocumentPanelOpen(true);
  };

  const documents = documentType === "judicial" 
    ? favorites?.judicialDecisions || [] 
    : favorites?.laborContracts || [];

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-6 py-4">
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">Favorite Documents</h1>
        <RadioGroup 
          defaultValue="judicial" 
          value={documentType}
          onValueChange={(value) => setDocumentType(value as DocumentType)}
          className="flex space-x-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="judicial" id="judicial" />
            <Label htmlFor="judicial">Judicial Decisions</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="contract" id="contract" />
            <Label htmlFor="contract">Labor Contracts</Label>
          </div>
        </RadioGroup>
      </div>
      
      <div className="flex-1 flex overflow-hidden">
        <DocumentList 
          documents={documents}
          isLoading={isLoading}
          onDocumentClick={handleDocumentClick}
          documentType={documentType}
          emptyMessage="You haven't saved any favorites yet. Browse documents and click the bookmark icon to add them here."
        />
        
        {documentPanelOpen && selectedDocument && (
          <DocumentDetail 
            document={selectedDocument}
            onClose={() => setDocumentPanelOpen(false)}
            documentType={documentType}
          />
        )}
      </div>
    </div>
  );
}
