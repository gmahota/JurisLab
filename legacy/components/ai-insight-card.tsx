import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface AiInsightCardProps {
  title: string;
  content: string;
  icon: React.ReactNode;
  iconBgClass: string;
  className?: string;
}

export function AiInsightCard({ title, content, icon, iconBgClass, className }: AiInsightCardProps) {
  return (
    <Card className={cn("h-full overflow-hidden transition-all hover:shadow-md", className)}>
      <CardHeader className="flex flex-row items-center gap-4 pb-2">
        <div className={cn("p-2 rounded-full", iconBgClass)}>
          {icon}
        </div>
        <h3 className="text-lg font-semibold leading-none tracking-tight">
          {title}
        </h3>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          {content}
        </p>
        <div className="pt-4 mt-4 border-t border-border">
          <p className="text-xs text-muted-foreground font-medium">
            AI-generated insight
          </p>
        </div>
      </CardContent>
    </Card>
  );
}