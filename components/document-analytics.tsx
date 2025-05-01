import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { JudicialDecision, LaborContract } from "@shared/schema";
import { Chart } from "@/components/ui/chart";
import { useMobile } from "@/hooks/use-mobile";

interface DocumentAnalyticsProps {
  document: JudicialDecision | LaborContract;
  documentType: "judicial" | "contract";
}

export function DocumentAnalytics({ document, documentType }: DocumentAnalyticsProps) {
  const isMobile = useMobile();
  const [activeTab, setActiveTab] = useState<"citations" | "readability" | "impact">("citations");

  // Simulated analytics data
  const citationData = {
    series: [
      {
        name: 'Citations',
        data: [10, 41, 35, 51, 49, 62, 69, 91, 148],
      },
    ],
    options: {
      chart: {
        type: 'bar',
        height: 350,
        toolbar: {
          show: false,
        },
      },
      plotOptions: {
        bar: {
          borderRadius: 4,
          horizontal: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
      },
      colors: ['#3182ce'],
    },
  };

  const readabilityData = {
    series: [70],
    options: {
      chart: {
        height: 350,
        type: 'radialBar',
      },
      plotOptions: {
        radialBar: {
          hollow: {
            size: '70%',
          },
          dataLabels: {
            name: {
              show: false,
            },
            value: {
              fontSize: '30px',
              show: true,
              formatter: function (val: number) {
                return val + '%';
              },
            },
          },
        },
      },
      labels: ['Readability Score'],
      colors: ['#3182ce'],
    },
  };

  const impactData = {
    series: [
      {
        name: 'Legal Impact',
        data: [31, 40, 28, 51, 42, 109, 100],
      },
      {
        name: 'Social Impact',
        data: [11, 32, 45, 32, 34, 52, 41],
      },
    ],
    options: {
      chart: {
        height: 350,
        type: 'area',
        toolbar: {
          show: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'smooth',
      },
      xaxis: {
        type: 'category',
        categories: ['2019', '2020', '2021', '2022', '2023', '2024', '2025'],
      },
      tooltip: {
        x: {
          format: 'yyyy',
        },
      },
      colors: ['#3182ce', '#e53e3e'],
    },
  };

  const renderChart = () => {
    if (activeTab === "citations") {
      return (
        <Chart
          type="bar"
          height={isMobile ? 200 : 350}
          options={citationData.options}
          series={citationData.series}
        />
      );
    }

    if (activeTab === "readability") {
      return (
        <Chart
          type="radialBar"
          height={isMobile ? 200 : 350}
          options={readabilityData.options}
          series={readabilityData.series}
        />
      );
    }

    if (activeTab === "impact") {
      return (
        <Chart
          type="area"
          height={isMobile ? 200 : 350}
          options={impactData.options}
          series={impactData.series}
        />
      );
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Document Analytics</CardTitle>
        <div className="flex space-x-2 mt-2">
          <button
            onClick={() => setActiveTab("citations")}
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              activeTab === "citations"
                ? "bg-primary text-white"
                : "bg-secondary text-foreground"
            }`}
          >
            Citations
          </button>
          <button
            onClick={() => setActiveTab("readability")}
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              activeTab === "readability"
                ? "bg-primary text-white"
                : "bg-secondary text-foreground"
            }`}
          >
            Readability
          </button>
          <button
            onClick={() => setActiveTab("impact")}
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              activeTab === "impact"
                ? "bg-primary text-white"
                : "bg-secondary text-foreground"
            }`}
          >
            Impact
          </button>
        </div>
      </CardHeader>
      <CardContent>
        {renderChart()}
        <div className="mt-4 text-sm text-muted-foreground">
          {activeTab === "citations" && (
            <p>
              This chart shows the citation frequency of this document over time. 
              {documentType === "judicial" 
                ? "This decision has been cited by 507 other cases." 
                : "This contract template has been referenced in 328 other contracts."}
            </p>
          )}
          {activeTab === "readability" && (
            <p>
              The readability score indicates how easy the document is to understand. 
              {documentType === "judicial" 
                ? "This decision has a good readability score compared to similar cases." 
                : "This contract has a good readability score for its complexity level."}
            </p>
          )}
          {activeTab === "impact" && (
            <p>
              This chart shows the estimated legal and social impact of the document over time.
              {documentType === "judicial" 
                ? "This decision has had a significant impact on subsequent legal interpretations." 
                : "This contract type has influenced industry standards."}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}