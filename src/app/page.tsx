"use client";

import * as React from "react";
import { BudgetInputForm } from "@/components/budget/BudgetInputForm";
import { ExpenseForm } from "@/components/budget/ExpenseForm";
import { BudgetDisplay } from "@/components/budget/BudgetDisplay";
import { ExpenseList } from "@/components/budget/ExpenseList";
import { AiBudgetTips } from "@/components/budget/AiBudgetTips";
import type { Expense } from "@/types";
import { getFromLocalStorage, saveToLocalStorage } from "@/lib/localStorage";
import { Wallet } from "lucide-react"; // Using Wallet for main app icon

const BUDGET_LIMIT_KEY = "budgetwise_budget_limit";
const EXPENSES_KEY = "budgetwise_expenses";

export default function BudgetWisePage() {
  const [budgetLimit, setBudgetLimit] = React.useState<number | null>(null);
  const [expenses, setExpenses] = React.useState<Expense[]>([]);
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setBudgetLimit(getFromLocalStorage<number | null>(BUDGET_LIMIT_KEY, null));
    setExpenses(getFromLocalStorage<Expense[]>(EXPENSES_KEY, []));
    setIsMounted(true);
  }, []);

  React.useEffect(() => {
    if (isMounted) {
      saveToLocalStorage<number | null>(BUDGET_LIMIT_KEY, budgetLimit);
    }
  }, [budgetLimit, isMounted]);

  React.useEffect(() => {
    if (isMounted) {
      saveToLocalStorage<Expense[]>(EXPENSES_KEY, expenses);
    }
  }, [expenses, isMounted]);

  const handleSetBudget = (newBudget: number) => {
    setBudgetLimit(newBudget);
  };

  const handleAddExpense = (newExpense: Expense) => {
    setExpenses((prevExpenses) => [...prevExpenses, newExpense]);
  };

  if (!isMounted) {
    // Render minimal skeleton or loading state to avoid hydration mismatch
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Wallet className="h-16 w-16 animate-pulse text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <div className="container mx-auto p-4 md:p-6 lg:p-8">
        <header className="mb-8 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start mb-2">
            <Wallet className="h-10 w-10 text-primary mr-3" />
            <h1 className="text-5xl font-extrabold tracking-tight text-primary">
              BudgetWise
            </h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Track your spending, gain smart insights, and achieve financial serenity.
          </p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column / First Section on Mobile */}
          <section className="lg:col-span-1 space-y-6">
            <BudgetInputForm currentBudget={budgetLimit} onSetBudget={handleSetBudget} />
            <BudgetDisplay budgetLimit={budgetLimit} expenses={expenses} />
          </section>

          {/* Middle Column / Second Section on Mobile */}
          <section className="lg:col-span-1 space-y-6">
             <ExpenseForm onAddExpense={handleAddExpense} budgetLimit={budgetLimit} />
          </section>
          
          {/* Right Column / Third Section on Mobile */}
          <section className="lg:col-span-1 space-y-6">
            <ExpenseList expenses={expenses} />
          </section>
        </main>
        
        <footer className="mt-12 text-center text-sm text-muted-foreground py-6 border-t">
          <p>&copy; {new Date().getFullYear()} BudgetWise. Your partner in financial wellness.</p>
          <p>Built with Next.js and Firebase Studio.</p>
        </footer>
      </div>
    </div>
  );
}
