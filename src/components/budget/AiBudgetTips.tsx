"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { analyzeSpendingPatterns, type AnalyzeSpendingPatternsInput, type AnalyzeSpendingPatternsOutput } from "@/ai/flows/analyze-spending-patterns";
import type { Expense } from "@/types";
import { Sparkles, Terminal, Lightbulb } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AiBudgetTipsProps {
  expenses: Expense[];
  budgetLimit: number | null;
}

export function AiBudgetTips({ expenses, budgetLimit }: AiBudgetTipsProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [analysisResult, setAnalysisResult] = React.useState<AnalyzeSpendingPatternsOutput | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const { toast } = useToast();

  const handleGetTips = async () => {
    if (budgetLimit === null || budgetLimit <= 0) {
      toast({
        title: "Set Budget First",
        description: "Please set your daily budget before requesting AI tips.",
        variant: "destructive",
      });
      return;
    }
    if (expenses.length === 0) {
       toast({
        title: "No Expenses Logged",
        description: "Please log some expenses before requesting AI tips.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const input: AnalyzeSpendingPatternsInput = {
        expenses: expenses.map(e => ({ category: e.category, amount: e.amount, description: e.description })),
        budgetLimit: budgetLimit,
      };
      const result = await analyzeSpendingPatterns(input);
      setAnalysisResult(result);
      toast({
        title: "AI Tips Generated!",
        description: "Check out your personalized spending advice.",
      });
    } catch (err) {
      console.error("Error fetching AI tips:", err);
      setError("Failed to generate AI tips. Please try again.");
       toast({
        title: "Error",
        description: "Failed to generate AI tips. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const canGenerateTips = budgetLimit !== null && budgetLimit > 0 && expenses.length > 0;

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center text-2xl">
          <Sparkles className="mr-2 h-6 w-6 text-accent" />
          AI Budget Coach
        </CardTitle>
        <CardDescription>Get personalized tips to manage your finances better.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={handleGetTips} disabled={isLoading || !canGenerateTips} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
          {isLoading ? "Analyzing..." : "Get Smart Tips"}
        </Button>

        {!canGenerateTips && !isLoading && (
          <Alert variant="default" className="bg-secondary/50">
            <Lightbulb className="h-4 w-4" />
            <AlertTitle>Ready for Insights?</AlertTitle>
            <AlertDescription>
              {budgetLimit === null || budgetLimit <= 0 ? "Set your budget and " : ""}
              {expenses.length === 0 ? "add some expenses " : ""}
              to unlock personalized AI tips.
            </AlertDescription>
          </Alert>
        )}

        {isLoading && (
          <div className="space-y-3 mt-4">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        )}

        {error && !isLoading && (
          <Alert variant="destructive" className="mt-4">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {analysisResult && !isLoading && (
          <div className="mt-6 space-y-4 p-4 border rounded-md bg-background">
            <div>
              <h3 className="font-semibold text-lg mb-2 text-primary">Spending Analysis:</h3>
              <p className="text-sm text-foreground/90 whitespace-pre-wrap">{analysisResult.spendingAnalysis}</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2 text-primary">Personalized Tips:</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-foreground/90">
                {analysisResult.tips.map((tip, index) => (
                  <li key={index}>{tip}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
