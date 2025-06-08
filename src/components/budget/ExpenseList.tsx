"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import type { Expense } from "@/types";
import { useRouter } from "next/navigation";
import { expenseCategories, getCategoryConfig } from "@/config/categories";
import { ListChecks, Archive } from "lucide-react";
import { Home, Utensils, ShoppingBag, Car, BookOpen, HeartHandshake, Palette, Briefcase, Gift, Train, MoreHorizontal } from "lucide-react";
import { format } from "date-fns";
import { useState, useMemo } from "react";

interface ExpenseListProps {
  expenses: Expense[];
}

export function ExpenseList({ expenses }: ExpenseListProps) {
  const router = useRouter();

  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Calculate total spending
  const totalSpending = useMemo(() => {
    return expenses.reduce((sum, expense) => sum + expense.amount, 0);
  }, [expenses]);

  // Group expenses by category
  const spendingByCategory = useMemo(() => {
    return expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);
  }, [expenses]);

  const sortedExpenses = useMemo(() => {
    // Sort expenses by date, most recent first
    return [...expenses].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [expenses]);

  // Get category label for display
  const getCategoryLabel = (categoryValue: string) => {
    const categoryConfig = getCategoryConfig(categoryValue);
    return categoryConfig?.label || categoryValue;
  };

  const handleExpenseClick = (expense: Expense) => {
    setSelectedExpense(expense);
    setIsDetailsOpen(true);
 };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center text-2xl">
            <ListChecks className="mr-2 h-6 w-6 text-primary" />
            Recent Expenses
          </CardTitle>
          <button onClick={() => router.push('/expenses')} className="text-sm text-primary hover:underline">View All</button>
        </div>
          <CardDescription>A list of your most recent expenditures.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        {/* Summary Section */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Spending Summary</h3>
          <div className="flex justify-between items-center text-md">
            <span className="text-muted-foreground">Total Spent:</span>
            <span className="font-bold text-primary">₹{totalSpending.toFixed(2)}</span>
          </div>
          <Separator />
          <h4 className="text-md font-medium mt-4">Spending by Category:</h4>
          <ul className="space-y-1 text-sm text-muted-foreground">
            {Object.entries(spendingByCategory).map(([category, amount]) => (
              <li key={category} className="flex justify-between items-center">
                <span>{getCategoryLabel(category)}:</span>
                <span className="font-medium text-primary">₹{amount.toFixed(2)}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Expenses List Section */}
        <ScrollArea className="h-[300px] pr-4">
          <ul className="space-y-4">
            {sortedExpenses.map((expense, index) => {
              return (
                <li key={expense.id}>
                  <div className="flex items-start space-x-4 p-3 rounded-lg hover:bg-secondary/50 transition-colors active:bg-secondary/70 cursor-pointer">
                    <div className="flex-1 cursor-pointer" onClick={() => handleExpenseClick(expense)}>
                      <p className="font-medium">{expense.description}</p>
                      <p className="text-sm text-gray-500">
                        {format(new Date(expense.date), "MMM d, yyyy")}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-red-600">₹{expense.amount.toFixed(2)}</p>
                      <p className="text-sm text-gray-500">{getCategoryLabel(expense.category)}</p>
                    </div>
                  </div>
                  {index < sortedExpenses.length - 1 && <Separator className="my-4" />}
                </li>);
            })}
          </ul>
        </ScrollArea>

        {/* Expense Details Dialog */}
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Expense Details</DialogTitle>
              <DialogDescription>Full details of the selected expense.</DialogDescription>
            </DialogHeader>
            {selectedExpense && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <span className="text-sm font-medium text-muted-foreground">Description:</span>
                  <span className="col-span-3">{selectedExpense.description}</span>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <span className="text-sm font-medium text-muted-foreground">Amount:</span>
                  <span className="col-span-3 font-bold text-primary">₹{selectedExpense.amount.toFixed(2)}</span>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <span className="text-sm font-medium text-muted-foreground">Category:</span>
                  <Badge variant="outline" className="col-span-3 justify-self-start capitalize">
                    {getCategoryLabel(selectedExpense.category)}
                  </Badge>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <span className="text-sm font-medium text-muted-foreground">Date:</span>
                  <span className="col-span-3">{format(new Date(selectedExpense.date), "MMM d, yyyy - h:mm a")}</span>
                </div>
                 {/* Add more details if available in your Expense type */}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
