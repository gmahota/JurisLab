import React from "react";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { JudicialDecision, LaborContract } from "@shared/schema";
import { formatDate, truncateText } from "@/lib/utils";
import { 
  FileText, 
  CalendarDays, 
  MapPin, 
  User, 
  Briefcase,
  Building 
} from "lucide-react";

interface DocumentCardProps {
  document: JudicialDecision | LaborContract;
  documentType: "judicial" | "contract";
  onClick: () => void;
}

export function DocumentCard({ document, documentType, onClick }: DocumentCardProps) {
  const renderJudicialInfo = (doc: JudicialDecision) => (
    <>
      <div className="flex items-center text-sm text-muted-foreground">
        <CalendarDays className="mr-1 h-4 w-4" />
        <span>{formatDate(doc.date || doc.createdAt)}</span>
      </div>
      <div className="flex items-center text-sm text-muted-foreground mt-1">
        <MapPin className="mr-1 h-4 w-4" />
        <span>{doc.jurisdiction}</span>
      </div>
      <div className="flex items-center text-sm text-muted-foreground mt-1">
        <User className="mr-1 h-4 w-4" />
        <span>{doc.judge}</span>
      </div>
    </>
  );

  const renderContractInfo = (doc: LaborContract) => (
    <>
      <div className="flex items-center text-sm text-muted-foreground">
        <CalendarDays className="mr-1 h-4 w-4" />
        <span>{formatDate(doc.createdAt)}</span>
      </div>
      <div className="flex items-center text-sm text-muted-foreground mt-1">
        <Building className="mr-1 h-4 w-4" />
        <span>{doc.industry}</span>
      </div>
      <div className="flex items-center text-sm text-muted-foreground mt-1">
        <Briefcase className="mr-1 h-4 w-4" />
        <span>{doc.contractType}</span>
      </div>
    </>
  );

  return (
    <Card 
      className="h-full flex flex-col transition-shadow hover:shadow-md cursor-pointer"
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold line-clamp-2">
          {document.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="py-2 flex-grow">
        <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
          {documentType === "judicial" 
            ? (document as JudicialDecision).summary 
            : (document as LaborContract).description
          }
        </p>
        
        {documentType === "judicial" 
          ? renderJudicialInfo(document as JudicialDecision)
          : renderContractInfo(document as LaborContract)
        }
      </CardContent>
      <CardFooter className="pt-2 flex flex-wrap gap-1">
        {document.tags?.slice(0, 3).map((tag, index) => (
          <Badge key={index} variant="outline" className="text-xs">
            {tag}
          </Badge>
        ))}
        {document.tags && document.tags.length > 3 && (
          <Badge variant="outline" className="text-xs">
            +{document.tags.length - 3} more
          </Badge>
        )}
      </CardFooter>
    </Card>
  );
}