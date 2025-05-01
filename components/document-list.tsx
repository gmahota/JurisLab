import { Fragment } from "react";
import { JudicialDecision, LaborContract } from "@shared/schema";
import { DocumentCard } from "./document-card";
import { Pagination } from "./pagination";
import { Inbox } from "lucide-react";

interface DocumentListProps {
  documents: JudicialDecision[] | LaborContract[];
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
  emptyMessage = "No documents found. Try adjusting your filters."
}: DocumentListProps) {
  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-900 p-6">
      {isLoading ? (
        <div className="flex justify-center p-6">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      ) : documents.length === 0 ? (
        <div className="h-full flex items-center justify-center">
          <div className="text-center p-6 max-w-md">
            <Inbox className="h-16 w-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">No documents found</h3>
            <p className="text-slate-500 dark:text-slate-400">
              {emptyMessage}
            </p>
          </div>
        </div>
      ) : (
        <Fragment>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {documents.map((document) => (
              <DocumentCard
                key={`${documentType}-${document.id}`}
                document={document}
                documentType={documentType}
                onClick={() => onDocumentClick(document)}
              />
            ))}
          </div>
          
          {totalPages > 1 && onPageChange && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={onPageChange}
              className="mt-8"
            />
          )}
        </Fragment>
      )}
    </div>
  );
}
