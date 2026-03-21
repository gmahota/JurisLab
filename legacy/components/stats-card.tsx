import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  iconBgClass: string;
  className?: string;
}

export function StatsCard({ title, value, icon, iconBgClass, className }: StatsCardProps) {
  return (
    <Card className={cn("bg-white dark:bg-slate-800", className)}>
      <CardContent className="p-6">
        <div className="flex items-center">
          <div className={cn("p-3 rounded-full", iconBgClass)}>
            {icon}
          </div>
          <div className="ml-4">
            <h2 className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</h2>
            <p className="text-2xl font-semibold text-slate-900 dark:text-white">{value.toLocaleString()}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
