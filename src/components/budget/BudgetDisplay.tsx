"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { DollarSign, TrendingDown, TrendingUp } from "lucide-react";
import type { Expense } from "@/types";

interface BudgetDisplayProps {
  budgetLimit: number | null;
  expenses: Expense[];
}

export function BudgetDisplay({ budgetLimit, expenses }: BudgetDisplayProps) {
  const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const remainingBudget = budgetLimit !== null ? budgetLimit - totalSpent : null;
  const progressPercentage = budgetLimit && budgetLimit > 0 ? (totalSpent / budgetLimit) * 100 : 0;

  if (budgetLimit === null || budgetLimit === 0) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center text-2xl">
            <DollarSign className="mr-2 h-6 w-6 text-primary" />
            Daily Budget Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-4">
            Please set your daily budget to see your spending status.
          </p>
        </CardContent>
      </Card>
    );
  }

  const isOverBudget = remainingBudget !== null && remainingBudget < 0;

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center text-2xl">
          <DollarSign className="mr-2 h-6 w-6 text-primary" />
          Budget Overview
        </CardTitle>
        <CardDescription>Your financial summary for the day.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Daily Limit:</span>
          <span className="font-semibold text-lg">₹{budgetLimit.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Total Spent:</span>
          <span className="font-semibold text-lg">₹{totalSpent.toFixed(2)}</span>
        </div>
        <div className={`flex justify-between items-center p-3 rounded-md ${isOverBudget ? 'bg-destructive/10' : 'bg-primary/10'}`}>
          <span className={`font-semibold ${isOverBudget ? 'text-destructive' : 'text-primary'}`}>
            {isOverBudget ? "Over Budget By:" : "Remaining:"}
          </span>
          <span className={`font-bold text-xl ${isOverBudget ? 'text-destructive' : 'text-primary'}`}>
          ₹{remainingBudget !== null ? Math.abs(remainingBudget).toFixed(2) : 'N/A'}
          </span>
        </div>
        
        <div>
          <Progress value={progressPercentage} className="w-full h-3" 
            indicatorClassName={isOverBudget ? "bg-destructive" : "bg-primary"}
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>0%</span>
            <span>{Math.min(Math.max(0, progressPercentage), 100).toFixed(0)}% Spent</span>
            <span>100%</span>
          </div>
        </div>

        {isOverBudget && (
          <div className="flex items-center text-destructive text-sm">
            <TrendingDown className="mr-1 h-4 w-4" />
            You've exceeded your budget!
          </div>
        )}
        {remainingBudget !== null && remainingBudget >=0 && totalSpent > 0 && (
           <div className="flex items-center text-green-600 text-sm">
            <TrendingUp className="mr-1 h-4 w-4" />
            You're on track! Keep it up.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
