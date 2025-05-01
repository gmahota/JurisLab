import { JudicialDecision, LaborContract } from "@shared/schema";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bookmark, Share, Download, MoreHorizontal } from "lucide-react";
import { formatDate, getJurisdictionColor, truncateText } from "@/lib/utils";

interface DocumentCardProps {
  document: JudicialDecision | LaborContract;
  documentType: "judicial" | "contract";
  onClick: () => void;
}

export function DocumentCard({ document, documentType, onClick }: DocumentCardProps) {
  const isJudicial = documentType === "judicial";
  const judicialDoc = document as JudicialDecision;
  const contractDoc = document as LaborContract;
  
  let badgeText = "";
  let badgeColors = { bg: "", text: "", darkBg: "", darkText: "" };
  
  if (isJudicial) {
    badgeText = judicialDoc.jurisdiction;
    badgeColors = getJurisdictionColor(judicialDoc.jurisdiction);
  } else {
    badgeText = contractDoc.contractType;
    badgeColors = {
      bg: "bg-secondary-100",
      text: "text-secondary-800",
      darkBg: "dark:bg-secondary-900/50",
      darkText: "dark:text-secondary-300"
    };
  }

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={onClick}>
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-3">
          <Badge className={`${badgeColors.bg} ${badgeColors.text} ${badgeColors.darkBg} ${badgeColors.darkText} font-medium`}>
            {badgeText}
          </Badge>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {formatDate(isJudicial ? judicialDoc.date : contractDoc.updatedAt)}
          </span>
        </div>
        <h3 className="font-medium text-slate-900 dark:text-white mb-2">
          {document.title}
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
          {isJudicial ? truncateText(judicialDoc.summary, 120) : truncateText(contractDoc.description, 120)}
        </p>
        <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
          {isJudicial ? (
            <>
              <span className="flex items-center mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-scale mr-1"><path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/></svg>
                {judicialDoc.category}
              </span>
              <span className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-book-open-text mr-1"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/><path d="M6 8h2"/><path d="M6 12h2"/><path d="M16 8h2"/><path d="M16 12h2"/></svg>
                Case #{judicialDoc.caseNumber}
              </span>
            </>
          ) : (
            <>
              <span className="flex items-center mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file-text mr-1"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/></svg>
                {contractDoc.pages} pages
              </span>
              <span className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-download mr-1"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                {contractDoc.downloads} downloads
              </span>
            </>
          )}
        </div>
      </CardContent>
      <CardFooter className="border-t border-slate-200 dark:border-slate-700 px-5 py-3 flex justify-between">
        <Button variant="ghost" size="icon" className="text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400">
          <Bookmark className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400">
          <Share className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400">
          <Download className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
