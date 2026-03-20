import React, { useState } from "react";
import { useRouter } from "next/router";
import { Search, Loader2, BookText, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { aiService } from "@/lib/ai-service";

interface SearchResult {
  id: number;
  title: string;
  relevanceScore: number;
  documentType: "judicial" | "contract";
}

export function AiSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) return;
    
    setIsSearching(true);
    setHasSearched(true);
    
    try {
      const data = await aiService.searchDocuments(query);
      setResults(data.results);
    } catch (error) {
      console.error("Error searching documents:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleResultClick = (result: SearchResult) => {
    // Navigate to the document details page
    if (result.documentType === "judicial") {
      router.push(`/judicial-decisions/${result.id}`);
    } else {
      router.push(`/labor-contracts/${result.id}`);
    }
  };

  return (
    <div className="w-full space-y-4">
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-10"
            placeholder="Search using AI to find relevant documents..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <Button type="submit" disabled={isSearching || !query.trim()}>
          {isSearching ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Searching...
            </>
          ) : (
            "Search"
          )}
        </Button>
      </form>

      {isSearching && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="ml-2 text-muted-foreground">
            AI is searching through documents...
          </p>
        </div>
      )}

      {hasSearched && !isSearching && results.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No results found for "{query}"</p>
          <p className="text-sm text-muted-foreground mt-1">
            Try using different keywords or more specific terms
          </p>
        </div>
      ) : null}

      {!isSearching && results.length > 0 && (
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            Found {results.length} results for "{query}"
          </div>
          
          <div className="space-y-3">
            {results.map((result) => (
              <Card
                key={`${result.documentType}-${result.id}`}
                className="cursor-pointer hover:shadow-md transition-all"
                onClick={() => handleResultClick(result)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 bg-secondary/30 p-2 rounded-full">
                      {result.documentType === "judicial" ? (
                        <BookText className="h-4 w-4 text-primary" />
                      ) : (
                        <FileText className="h-4 w-4 text-primary" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium truncate">{result.title}</h3>
                        <Badge variant="outline" className="ml-2 whitespace-nowrap">
                          {Math.round(result.relevanceScore * 100)}% match
                        </Badge>
                      </div>
                      <div className="mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {result.documentType === "judicial" ? "Judicial Decision" : "Labor Contract"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}