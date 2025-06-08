"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CreditCard } from "lucide-react";
import { expenseCategories, type ExpenseCategoryValue } from "@/config/categories";
import type { Expense } from "@/types";
import { useToast } from "@/hooks/use-toast";

const expenseFormSchema = z.object({
  description: z.string().min(1, { message: "Description is required." }).max(100, { message: "Description too long." }),
  amount: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z.number({ invalid_type_error: "Amount must be a number."})
      .positive({ message: "Amount must be positive." })
      .min(0.01, { message: "Amount must be at least 0.01." })
  ),
  category: z.string().min(1, { message: "Category is required." }) as z.ZodType<ExpenseCategoryValue>,
});

type ExpenseFormValues = z.infer<typeof expenseFormSchema>;

interface ExpenseFormProps {
  onAddExpense: (expense: Expense) => void;
  budgetLimit: number | null;
}

export function ExpenseForm({ onAddExpense, budgetLimit }: ExpenseFormProps) {
  const { toast } = useToast();
  const form = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseFormSchema),
    defaultValues: {
      description: "",
      amount: 0,
      category: undefined,
    },
  });

  function onSubmit(data: ExpenseFormValues) {
    const newExpense: Expense = {
      id: Date.now().toString(),
      ...data,
      date: new Date().toISOString(),
    };
    onAddExpense(newExpense);
    toast({
      title: "Expense Added",
      description: `${data.description} ($${data.amount.toFixed(2)}) added to ${data.category}.`,
    });
    form.reset();
  }
  
  const isBudgetSet = budgetLimit !== null && budgetLimit > 0;

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center text-2xl">
          <CreditCard className="mr-2 h-6 w-6 text-primary" />
          Add New Expense
        </CardTitle>
        {!isBudgetSet && <CardDescription className="text-destructive">Set a budget first to start tracking expenses.</CardDescription>}
        {isBudgetSet && <CardDescription>Log your daily expenditures here.</CardDescription>}
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g., Lunch with colleagues" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount ($)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 15.50" {...field} step="0.01" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {expenseCategories.map((cat) => (
                          <SelectItem key={cat.value} value={cat.value}>
                            <span className="flex items-center">
                              <cat.icon className="mr-2 h-4 w-4" />
                              {cat.label}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={!isBudgetSet}>
              Add Expense
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
