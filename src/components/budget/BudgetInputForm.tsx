"use client";

import * as React from "react";
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Landmark } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const budgetFormSchema = z.object({
  budgetLimit: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z.number({ invalid_type_error: "Budget must be a number."})
      .positive({ message: "Budget must be a positive number." })
      .min(0.01, { message: "Budget must be at least 0.01." })
  ),
});

type BudgetFormValues = z.infer<typeof budgetFormSchema>;

interface BudgetInputFormProps {
  currentBudget: number | null;
  onSetBudget: (budget: number) => void;
}

export function BudgetInputForm({ currentBudget, onSetBudget }: BudgetInputFormProps) {
  const { toast } = useToast();
  const form = useForm<BudgetFormValues>({
    resolver: zodResolver(budgetFormSchema),
    defaultValues: {
      budgetLimit: currentBudget ?? 0,
    },
  });

  React.useEffect(() => {
    form.reset({ budgetLimit: currentBudget ?? 0 });
  }, [currentBudget, form]);

  function onSubmit(data: BudgetFormValues) {
    onSetBudget(data.budgetLimit);
    toast({
      title: "Budget Updated",
      description: `Your daily budget is now $${data.budgetLimit.toFixed(2)}.`,
    });
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center text-2xl">
          <Landmark className="mr-2 h-6 w-6 text-primary" />
          Set Your Daily Budget
        </CardTitle>
        <CardDescription>Enter your target spending limit for the day.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="budgetLimit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Daily Budget Amount (₹)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 50" {...field} step="0.01" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
              Set Budget
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
