import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { JudicialDecision, LaborContract } from '@shared/schema';
import { Chart } from '../ui/chart';
import { format } from 'date-fns';
import { Eye, Users, Clock, FileText, Download } from 'lucide-react';

interface DocumentAnalyticsProps {
  document: JudicialDecision | LaborContract;
  documentType: 'judicial' | 'contract';
  className?: string;
}

export function DocumentAnalytics({ document, documentType, className }: DocumentAnalyticsProps) {
  const isJudicialDecision = documentType === 'judicial';
  
  // Get document creation and update dates
  const createdDate = document.createdAt ? new Date(document.createdAt) : null;
  const updatedDate = document.updatedAt ? new Date(document.updatedAt) : null;
  
  // Calculate document age in days
  const documentAge = createdDate 
    ? Math.floor((new Date().getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24)) 
    : 0;
  
  // Create fake view data for demo purposes (to be replaced with real metrics)
  const viewsByDay = [
    { day: '1', views: 5 },
    { day: '2', views: 8 },
    { day: '3', views: 3 },
    { day: '4', views: 7 },
    { day: '5', views: 10 },
    { day: '6', views: 6 },
    { day: '7', views: 9 },
  ];
  
  // Determine document-type specific stats
  const laborContract = documentType === 'contract' ? (document as LaborContract) : null;
  const judicialDecision = documentType === 'judicial' ? (document as JudicialDecision) : null;
  
  return (
    <div className={`space-y-6 ${className}`}>
      <h3 className="text-xl font-semibold">Document Analytics</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Eye className="mr-2 h-5 w-5 text-blue-600" />
              Views
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">48</div>
            <p className="text-sm text-muted-foreground">Last 7 days</p>
          </CardContent>
        </Card>
        
        {documentType === 'contract' && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Download className="mr-2 h-5 w-5 text-green-600" />
                Downloads
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{laborContract?.downloads || 0}</div>
              <p className="text-sm text-muted-foreground">Total downloads</p>
            </CardContent>
          </Card>
        )}
        
        {documentType === 'judicial' && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Users className="mr-2 h-5 w-5 text-indigo-600" />
                Parties
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2</div>
              <p className="text-sm text-muted-foreground">{judicialDecision?.parties || 'N/A'}</p>
            </CardContent>
          </Card>
        )}
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Clock className="mr-2 h-5 w-5 text-amber-600" />
              Age
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{documentAge}</div>
            <p className="text-sm text-muted-foreground">Days since creation</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <FileText className="mr-2 h-5 w-5 text-purple-600" />
              Content
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {documentType === 'contract' && (laborContract?.pages || 0)}
              {documentType === 'judicial' && document.content.length > 0 
                ? Math.ceil(document.content.length / 1000) 
                : 0}
            </div>
            <p className="text-sm text-muted-foreground">
              {documentType === 'contract' ? 'Pages' : 'KB of content'}
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Recent Views</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px]">
            <Chart
              options={{
                chart: {
                  type: 'area',
                  toolbar: {
                    show: false,
                  },
                  zoom: {
                    enabled: false,
                  },
                },
                dataLabels: {
                  enabled: false,
                },
                stroke: {
                  curve: 'smooth',
                  width: 2,
                },
                colors: ['#3b82f6'],
                fill: {
                  type: 'gradient',
                  gradient: {
                    shadeIntensity: 1,
                    opacityFrom: 0.7,
                    opacityTo: 0.3,
                  },
                },
                xaxis: {
                  categories: viewsByDay.map(d => `Day ${d.day}`),
                },
                yaxis: {
                  min: 0,
                },
                tooltip: {
                  y: {
                    formatter: (val: number) => `${val} views`,
                  },
                },
              }}
              series={[
                {
                  name: 'Views',
                  data: viewsByDay.map(d => d.views),
                },
              ]}
              type="area"
              height={200}
            />
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Document Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Created On:</span>
              <span>{createdDate ? format(createdDate, 'PPP') : 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Last Updated:</span>
              <span>{updatedDate ? format(updatedDate, 'PPP') : 'N/A'}</span>
            </div>
            {documentType === 'judicial' && (
              <>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Case Number:</span>
                  <span>{judicialDecision?.caseNumber || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Jurisdiction:</span>
                  <span>{judicialDecision?.jurisdiction || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Judge:</span>
                  <span>{judicialDecision?.judge || 'N/A'}</span>
                </div>
              </>
            )}
            {documentType === 'contract' && (
              <>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Contract Type:</span>
                  <span>{laborContract?.contractType || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Industry:</span>
                  <span>{laborContract?.industry || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Downloads:</span>
                  <span>{laborContract?.downloads || 0}</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Related Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm mb-4">Documents with similar tags or content</p>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center space-x-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  <div className="flex-1">
                    <div className="font-medium">Related Document {i}</div>
                    <div className="text-sm text-muted-foreground">
                      {documentType === 'judicial' ? 'Judicial Decision' : 'Labor Contract'} 
                      {' - '} 
                      {Math.floor(Math.random() * 80 + 20)}% similarity
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}