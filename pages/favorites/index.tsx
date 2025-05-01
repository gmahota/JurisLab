import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { apiRequest } from '../../client/src/lib/queryClient';
import { DocumentCard } from '../../client/src/components/document-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../client/src/components/ui/tabs';

export default function Favorites() {
  const [activeTab, setActiveTab] = useState<"judicial" | "contract">("judicial");
  
  // Fetch user favorites
  const { data: favorites, isLoading } = useQuery({
    queryKey: ['/api/user/favorites'],
    queryFn: () => apiRequest('/api/user/favorites')
  });

  const handleDocumentClick = (document: any, type: "judicial" | "contract") => {
    // Navigate to document detail page
    const path = type === "judicial" ? `/judicial-decisions/${document.id}` : `/labor-contracts/${document.id}`;
    window.location.href = path;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Favorites</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Your saved judicial decisions and labor contracts
        </p>
      </div>

      <Tabs defaultValue={activeTab} onValueChange={(value) => setActiveTab(value as "judicial" | "contract")}>
        <TabsList className="mb-6">
          <TabsTrigger value="judicial">Judicial Decisions</TabsTrigger>
          <TabsTrigger value="contract">Labor Contracts</TabsTrigger>
        </TabsList>
        
        <TabsContent value="judicial">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
          ) : !favorites?.judicialDecisions?.length ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-8 text-center">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No favorites yet</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                You haven't saved any judicial decisions to your favorites.
              </p>
              <Link href="/judicial-decisions">
                <span className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer">
                  Browse Judicial Decisions
                </span>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {favorites.judicialDecisions.map((decision: any) => (
                <DocumentCard
                  key={decision.id}
                  document={decision}
                  documentType="judicial"
                  onClick={() => handleDocumentClick(decision, "judicial")}
                />
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="contract">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
          ) : !favorites?.laborContracts?.length ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-8 text-center">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No favorites yet</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                You haven't saved any labor contracts to your favorites.
              </p>
              <Link href="/labor-contracts">
                <span className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer">
                  Browse Labor Contracts
                </span>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {favorites.laborContracts.map((contract: any) => (
                <DocumentCard
                  key={contract.id}
                  document={contract}
                  documentType="contract"
                  onClick={() => handleDocumentClick(contract, "contract")}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}