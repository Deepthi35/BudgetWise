"use client";

import React, { useState, useMemo } from "react";
import type { Expense } from "@/types";
import { format } from "date-fns";
import { Eye } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { getCategoryConfig } from "@/config/categories";

interface ExpenseTableProps {
  expenses: Expense[];
}

export function ExpenseTable({ expenses }: ExpenseTableProps) {
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const tableRef = React.useRef<HTMLTableElement>(null);

  const handleViewDetails = (expense: Expense) => {
    setSelectedExpense(expense);
    setIsDetailsOpen(true);
  };

  // Get category label for display
  const getCategoryLabel = (categoryValue: string) => {
    const categoryConfig = getCategoryConfig(categoryValue);
    return categoryConfig?.label || categoryValue;
  };

  return (
    <>
    <div className="overflow-x-auto">
      <Table ref={tableRef} className="w-full caption-bottom text-sm bg-white">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">S.No.</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="text-center">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {expenses.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                No expenses found.
              </TableCell>
            </TableRow>
          ) : (
            expenses.map((expense, index) => (
              <TableRow key={expense.id}>
                <TableCell className="font-medium text-center">{index + 1}</TableCell>
                <TableCell>₹{expense.amount.toFixed(2)}</TableCell>
                <TableCell>{getCategoryLabel(expense.category)}</TableCell>
                <TableCell className="text-center align-middle">
                  <Button variant="ghost" size="sm" onClick={() => handleViewDetails(expense)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>

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
    </>
  );
}