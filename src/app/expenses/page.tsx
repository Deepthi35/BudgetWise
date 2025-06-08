'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { ExpenseTable } from '@/components/budget/ExpenseTable';
import type { Expense } from '@/types'; // Define your Expense type here
import { Calendar } from '@/components/ui/calendar'; // Ensure your Calendar component is available
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

// Dummy data - Replace this with API logic as needed
const fetchExpenses = async (): Promise<Expense[]> => {
  return [
    {
      id: '1',
      description: 'Groceries',
      amount: 50.25,
      category: 'food',
      date: new Date('2023-10-26T10:00:00Z').toISOString(),
    },
    {
      id: '2',
      description: 'Gas',
      amount: 30.0,
      category: 'transport',
      date: new Date('2023-10-26T12:00:00Z').toISOString(),
    },
    {
      id: '3',
      description: 'Dinner',
      amount: 45.7,
      category: 'food',
      date: new Date('2023-10-25T19:00:00Z').toISOString(),
    },
    {
      id: '4',
      description: 'Movie Tickets',
      amount: 25.0,
      category: 'entertainment',
      date: new Date('2023-10-24T20:30:00Z').toISOString(),
    },
    {
      id: '5',
      description: 'Coffee',
      amount: 4.5,
      category: 'food',
      date: new Date('2023-10-26T08:00:00Z').toISOString(),
    },
  ];
};

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  useEffect(() => {
    let isMounted = true;

    const getExpenses = async () => {
      try {
        const data = await fetchExpenses();
        if (isMounted) {
          setExpenses(data);
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
