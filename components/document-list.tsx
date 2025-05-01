import React from "react";
import { DocumentCard } from "@/components/document-card";
import { Pagination } from "@/components/ui/pagination";
import { JudicialDecision, LaborContract } from "@shared/schema";
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle 
} from "@/components/ui/card";
import { Search, FileQuestion, Inbox } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface DocumentListProps {
  documents: (JudicialDecision | LaborContract)[];
  isLoading: boolean;
  onDocumentClick: (document: JudicialDecision | LaborContract) => void;
  documentType: "judicial" | "contract";
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  emptyMessage?: string;
}

export function DocumentList({
  documents,
  isLoading,
  onDocumentClick,
  documentType,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  emptyMessage = "No documents found",
}: DocumentListProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array(6)
          .fill(null)
          .map((_, i) => (
            <Card key={i} className="h-[280px]">
              <CardHeader className="pb-2">
                <Skeleton className="h-6 w-3/4" />
              </CardHeader>
              <CardContent className="py-2">
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-5/6 mb-2" />
                <Skeleton className="h-4 w-4/6 mb-4" />
                <Skeleton className="h-4 w-1/3 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-2" />
                <Skeleton className="h-4 w-2/5" />
              </CardContent>
            </Card>
          ))}
      </div>
    );
  }

  if (!documents || documents.length === 0) {
    return (
      <Card className="w-full min-h-[300px] flex flex-col items-center justify-center">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 bg-secondary p-3 rounded-full">
            {documentType === "judicial" ? (
              <FileQuestion className="h-10 w-10 text-muted-foreground" />
            ) : (
              <Inbox className="h-10 w-10 text-muted-foreground" />
            )}
          </div>
          <CardTitle>No documents found</CardTitle>
          <CardDescription>
            {emptyMessage}
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {documents.map((doc) => (
          <DocumentCard
            key={doc.id}
            document={doc}
            documentType={documentType}
            onClick={() => onDocumentClick(doc)}
          />
        ))}
      </div>

      {totalPages > 1 && onPageChange && (
        <div className="flex justify-center mt-8">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
}