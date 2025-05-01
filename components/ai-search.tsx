import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Search, FileText, Gavel } from 'lucide-react';

interface SearchResult {
  id: number;
  title: string;
  relevanceScore: number;
  documentType: "judicial" | "contract";
}

export function AiSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [, setLocation] = useLocation();
  
  const { data, isLoading, error } = useQuery({
    queryKey: [debouncedQuery ? `/api/ai/search?q=${encodeURIComponent(debouncedQuery)}` : null],
    queryFn: ({ queryKey }) => queryKey[0] ? apiRequest<{ results: SearchResult[] }>(queryKey[0]) : Promise.resolve({ results: [] }),
    enabled: !!debouncedQuery
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setDebouncedQuery(searchQuery);
  };

  const handleResultClick = (result: SearchResult) => {
    if (result.documentType === 'judicial') {
      setLocation(`/judicial-decisions/${result.id}`);
    } else {
      setLocation(`/labor-contracts/${result.id}`);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <form onSubmit={handleSearch} className="relative">
        <Input
          type="text"
          placeholder="Search judicial decisions and contracts with AI..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pr-32"
        />
        <Button 
          type="submit" 
          className="absolute right-0 top-0 rounded-l-none"
          disabled={isLoading || !searchQuery.trim()}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Search className="h-4 w-4 mr-2" />
          )}
          Search
        </Button>
      </form>

      {error && (
        <div className="mt-4 text-sm text-destructive">
          Error performing search. Please try again.
        </div>
      )}

      {debouncedQuery && data?.results && (
        <div className="mt-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">
              {data.results.length === 0 
                ? 'No results found' 
                : `AI search results for "${debouncedQuery}"`
              }
            </h3>
            <Badge variant="outline" className="text-xs">
              AI-powered
            </Badge>
          </div>

          {data.results.length > 0 && (
            <div className="space-y-2">
              {data.results.map((result) => (
                <Card 
                  key={`${result.documentType}-${result.id}`} 
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => handleResultClick(result)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      {result.documentType === 'judicial' ? (
                        <Gavel className="h-5 w-5 text-primary" />
                      ) : (
                        <FileText className="h-5 w-5 text-primary" />
                      )}
                      <div className="flex-grow">
                        <div className="font-medium">{result.title}</div>
                        <div className="flex items-center text-xs text-muted-foreground mt-1">
                          <Badge variant="outline" className="mr-2 text-xs">
                            {result.documentType === 'judicial' ? 'Judicial Decision' : 'Labor Contract'}
                          </Badge>
                          <span>Relevance: {Math.round(result.relevanceScore * 100)}%</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}