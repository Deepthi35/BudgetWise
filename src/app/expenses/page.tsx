'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { ExpenseTable } from '@/components/budget/ExpenseTable';
import type { Expense } from '@/types';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { getFromLocalStorage } from '@/lib/localStorage';

const EXPENSES_KEY = 'budgetwise_expenses';

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  useEffect(() => {
    let isMounted = true;

    const getExpenses = async () => {
      try {
        const localExpenses = getFromLocalStorage<Expense[]>(EXPENSES_KEY, []);
        if (isMounted) {
          setExpenses(localExpenses);
        }
      } catch (error) {
        console.error('Error fetching expenses:', error);
      }
    };

    getExpenses();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredExpenses = useMemo(() => {
    if (!selectedDate) return expenses;

    const selectedDateString = format(selectedDate, 'yyyy-MM-dd');

    return expenses.filter((expense) => {
      const expenseDateString = format(new Date(expense.date), 'yyyy-MM-dd');
      return expenseDateString === selectedDateString;
    });
  }, [expenses, selectedDate]);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">All Expenditures</h1>

      <div className="mb-6 flex items-center space-x-4">
        <span className="font-medium">Filter by Date:</span>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                'w-[240px] justify-start text-left font-normal',
                !selectedDate && 'text-muted-foreground'
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {selectedDate ? format(selectedDate, 'PPP') : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <ExpenseTable expenses={filteredExpenses} />
    </div>
  );
}
