import React from 'react';
import { StatsCard } from '../stats-card';
import { FileText, Clock, Calendar, BarChart2, Download } from 'lucide-react';

interface StatsGridProps {
  stats: {
    totalDocuments?: number;
    recentDocuments?: number;
    categoriesCount?: number;
    downloadsCount?: number;
  };
  type?: 'judicial' | 'contracts';
  className?: string;
}

export function StatsGrid({ stats, type = 'judicial', className }: StatsGridProps) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}>
      <StatsCard
        title={type === 'judicial' ? "Total Decisions" : "Total Contracts"}
        value={stats.totalDocuments || 0}
        icon={<FileText className="h-6 w-6" />}
        iconBgClass="bg-blue-100 dark:bg-blue-900"
      />
      <StatsCard
        title="Recent Added"
        value={stats.recentDocuments || 0}
        icon={<Clock className="h-6 w-6" />}
        iconBgClass="bg-green-100 dark:bg-green-900"
      />
      <StatsCard
        title={type === 'judicial' ? "Jurisdictions" : "Industries"}
        value={stats.categoriesCount || 0}
        icon={<BarChart2 className="h-6 w-6" />}
        iconBgClass="bg-purple-100 dark:bg-purple-900"
      />
      {type === 'contracts' && (
        <StatsCard
          title="Downloads"
          value={stats.downloadsCount || 0}
          icon={<Download className="h-6 w-6" />}
          iconBgClass="bg-amber-100 dark:bg-amber-900"
        />
      )}
      {type === 'judicial' && (
        <StatsCard
          title="Time Period"
          value={stats.downloadsCount || 0}
          icon={<Calendar className="h-6 w-6" />}
          iconBgClass="bg-amber-100 dark:bg-amber-900"
        />
      )}
    </div>
  );
}