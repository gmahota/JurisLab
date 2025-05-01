import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import Head from 'next/head';
import { ChartCard } from '../../client/src/components/analytics/chart-card';
import { BarChart } from '../../client/src/components/analytics/bar-chart';
import { LineChart } from '../../client/src/components/analytics/line-chart';
import { PieChart } from '../../client/src/components/analytics/pie-chart';
import { TimePeriodSelector } from '../../client/src/components/analytics/time-period-selector';
import { StatsGrid } from '../../client/src/components/analytics/stats-grid';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../client/src/components/ui/tabs';
import { format } from 'date-fns';

export default function Analytics() {
  const [timeframe, setTimeframe] = useState('month');
  
  // Fetch judicial decisions analytics
  const { 
    data: judicialStats, 
    isLoading: isLoadingJudicial
  } = useQuery({
    queryKey: ['/api/analytics/judicial-decisions', timeframe],
    queryFn: async () => {
      const response = await fetch(`/api/analytics/judicial-decisions?timeframe=${timeframe}`);
      if (!response.ok) {
        throw new Error('Failed to fetch judicial decisions analytics');
      }
      return response.json();
    }
  });

  // Fetch labor contracts analytics
  const { 
    data: contractStats, 
    isLoading: isLoadingContracts
  } = useQuery({
    queryKey: ['/api/analytics/labor-contracts', timeframe],
    queryFn: async () => {
      const response = await fetch(`/api/analytics/labor-contracts?timeframe=${timeframe}`);
      if (!response.ok) {
        throw new Error('Failed to fetch labor contracts analytics');
      }
      return response.json();
    }
  });

  // Fetch comparative analytics
  const { 
    data: comparativeStats, 
    isLoading: isLoadingComparative
  } = useQuery({
    queryKey: ['/api/analytics/comparative'],
    queryFn: async () => {
      const response = await fetch('/api/analytics/comparative');
      if (!response.ok) {
        throw new Error('Failed to fetch comparative analytics');
      }
      return response.json();
    }
  });

  // Fetch activity metrics
  const { 
    data: activityMetrics, 
    isLoading: isLoadingActivity
  } = useQuery({
    queryKey: ['/api/analytics/activity', timeframe],
    queryFn: async () => {
      const response = await fetch(`/api/analytics/activity?timeperiod=${timeframe}`);
      if (!response.ok) {
        throw new Error('Failed to fetch activity metrics');
      }
      return response.json();
    }
  });

  // Transform data for charts
  const judicialJurisdictionData = judicialStats?.jurisdictionDistribution?.map((item: any) => ({
    name: item.jurisdiction,
    value: item.count,
    color: getRandomColor(item.jurisdiction)
  })) || [];

  const judicialCategoryData = judicialStats?.categoryDistribution?.map((item: any) => ({
    name: item.category,
    value: item.count,
    color: getRandomColor(item.category)
  })) || [];

  const contractTypeData = contractStats?.contractTypeDistribution?.map((item: any) => ({
    name: item.contractType,
    value: item.count,
    color: getRandomColor(item.contractType)
  })) || [];

  const contractIndustryData = contractStats?.industryDistribution?.map((item: any) => ({
    name: item.industry,
    value: item.count,
    color: getRandomColor(item.industry)
  })) || [];

  const judicialTimeSeriesData = judicialStats?.timeSeriesData?.map((item: any) => ({
    month: format(new Date(item.month), 'MMM yyyy'),
    count: item.count
  })) || [];

  const contractTimeSeriesData = contractStats?.timeSeriesData?.map((item: any) => ({
    month: format(new Date(item.month), 'MMM yyyy'),
    count: item.count
  })) || [];

  const comparativeTimeSeriesData = comparativeStats?.timeSeriesData?.map((item: any) => ({
    month: format(new Date(item.month), 'MMM yyyy'),
    decisions: item.decisionCount,
    contracts: item.contractCount
  })) || [];

  // Function to generate random color for charts
  function getRandomColor(key: string) {
    const colors = [
      '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28FD0',
      '#FF6B6B', '#54C571', '#C2B280', '#4D4DFF', '#FFB6C1'
    ];
    
    // Generate a number from the key string
    let sum = 0;
    for (let i = 0; i < key.length; i++) {
      sum += key.charCodeAt(i);
    }
    
    // Use this to select a color
    return colors[sum % colors.length];
  }

  // Prepare stats for grids
  const judicialGridStats = {
    totalDocuments: judicialStats?.totalCount || 0,
    recentDocuments: activityMetrics?.newDecisionsCount || 0,
    categoriesCount: judicialStats?.jurisdictionDistribution?.length || 0
  };

  const contractGridStats = {
    totalDocuments: contractStats?.totalCount || 0,
    recentDocuments: activityMetrics?.newContractsCount || 0,
    categoriesCount: contractStats?.industryDistribution?.length || 0,
    downloadsCount: activityMetrics?.totalDownloads || 0
  };

  return (
    <>
      <Head>
        <title>Analytics Dashboard - JurisLab</title>
      </Head>
      
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Document Analytics</h1>
          <TimePeriodSelector 
            value={timeframe} 
            onChange={setTimeframe} 
            className="ml-auto"
          />
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="judicial">Judicial Decisions</TabsTrigger>
            <TabsTrigger value="contracts">Labor Contracts</TabsTrigger>
            <TabsTrigger value="comparative">Comparative Analysis</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <ChartCard title="Recent Activity" description="Document count by type">
                <StatsGrid stats={judicialGridStats} type="judicial" className="mb-4" />
                <StatsGrid stats={contractGridStats} type="contracts" />
              </ChartCard>
              
              <ChartCard title="Documents Over Time" description="Monthly document additions">
                <LineChart
                  data={comparativeTimeSeriesData}
                  xDataKey="month"
                  lines={[
                    { dataKey: 'decisions', name: 'Judicial Decisions', color: '#0088FE' },
                    { dataKey: 'contracts', name: 'Labor Contracts', color: '#00C49F' }
                  ]}
                  xAxisLabel="Month"
                  yAxisLabel="Document Count"
                />
              </ChartCard>
            </div>
          </TabsContent>

          {/* Judicial Decisions Tab */}
          <TabsContent value="judicial" className="space-y-6">
            <StatsGrid stats={judicialGridStats} type="judicial" className="mb-6" />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <ChartCard title="Jurisdictions Distribution" description="Count by jurisdiction">
                <PieChart
                  data={judicialJurisdictionData}
                  height={350}
                />
              </ChartCard>
              
              <ChartCard title="Categories Distribution" description="Count by category">
                <BarChart
                  data={judicialCategoryData}
                  xDataKey="name"
                  bars={[
                    { dataKey: 'value', name: 'Count', color: '#0088FE' }
                  ]}
                  height={350}
                />
              </ChartCard>
            </div>
            
            <ChartCard title="Judicial Decisions Over Time" description="Monthly document additions">
              <LineChart
                data={judicialTimeSeriesData}
                xDataKey="month"
                lines={[
                  { dataKey: 'count', name: 'Decision Count', color: '#0088FE' }
                ]}
                xAxisLabel="Month"
                yAxisLabel="Count"
                height={300}
              />
            </ChartCard>
          </TabsContent>

          {/* Labor Contracts Tab */}
          <TabsContent value="contracts" className="space-y-6">
            <StatsGrid stats={contractGridStats} type="contracts" className="mb-6" />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <ChartCard title="Contract Types" description="Count by contract type">
                <PieChart
                  data={contractTypeData}
                  height={350}
                />
              </ChartCard>
              
              <ChartCard title="Industry Distribution" description="Count by industry">
                <BarChart
                  data={contractIndustryData}
                  xDataKey="name"
                  bars={[
                    { dataKey: 'value', name: 'Count', color: '#00C49F' }
                  ]}
                  height={350}
                />
              </ChartCard>
            </div>
            
            <ChartCard title="Labor Contracts Over Time" description="Monthly document additions">
              <LineChart
                data={contractTimeSeriesData}
                xDataKey="month"
                lines={[
                  { dataKey: 'count', name: 'Contract Count', color: '#00C49F' }
                ]}
                xAxisLabel="Month"
                yAxisLabel="Count"
                height={300}
              />
            </ChartCard>

            {contractStats?.pageLengthDistribution && (
              <ChartCard title="Contract Length Distribution" description="Count by page range">
                <BarChart
                  data={(contractStats.pageLengthDistribution as any[]).map(item => ({
                    name: item.range,
                    value: item.count,
                    color: getRandomColor(item.range)
                  }))}
                  xDataKey="name"
                  bars={[
                    { dataKey: 'value', name: 'Count', color: '#FF8042' }
                  ]}
                  height={300}
                />
              </ChartCard>
            )}
          </TabsContent>

          {/* Comparative Analysis Tab */}
          <TabsContent value="comparative" className="space-y-6">
            <ChartCard title="Documents By Type Over Time" description="Monthly comparison">
              <LineChart
                data={comparativeTimeSeriesData}
                xDataKey="month"
                lines={[
                  { dataKey: 'decisions', name: 'Judicial Decisions', color: '#0088FE' },
                  { dataKey: 'contracts', name: 'Labor Contracts', color: '#00C49F' }
                ]}
                xAxisLabel="Month"
                yAxisLabel="Document Count"
                height={350}
              />
            </ChartCard>
            
            {comparativeStats?.tagOverlap && (
              <ChartCard title="Common Tags Between Document Types" description="Overlapping tag usage">
                <BarChart
                  data={(comparativeStats.tagOverlap as any[]).map(item => ({
                    tag: item.tag,
                    decisions: item.decisionCount,
                    contracts: item.contractCount
                  }))}
                  xDataKey="tag"
                  bars={[
                    { dataKey: 'decisions', name: 'Judicial Decisions', color: '#0088FE' },
                    { dataKey: 'contracts', name: 'Labor Contracts', color: '#00C49F' }
                  ]}
                  xAxisLabel="Tag"
                  yAxisLabel="Usage Count"
                  height={350}
                />
              </ChartCard>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}