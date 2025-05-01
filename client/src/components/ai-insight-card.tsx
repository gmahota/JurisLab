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
    <div className={cn("flex items-start", className)}>
      <div className={cn("p-2 rounded-full", iconBgClass)}>
        {icon}
      </div>
      <div className="ml-3">
        <h3 className="text-sm font-medium text-slate-900 dark:text-white">{title}</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{content}</p>
      </div>
    </div>
  );
}
