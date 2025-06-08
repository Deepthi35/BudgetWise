import type { LucideIcon } from "lucide-react";
import { Utensils, Car, Lightbulb, Film, ShoppingBag, HeartPulse, MoreHorizontal, VenetianMask } from "lucide-react";

export interface ExpenseCategoryConfig {
  value: string;
  label: string;
  icon: LucideIcon;
}

export const expenseCategories: ExpenseCategoryConfig[] = [
  { value: "food", label: "Food", icon: Utensils },
  { value: "transport", label: "Transport", icon: Car },
  { value: "utilities", label: "Utilities", icon: Lightbulb },
  { value: "entertainment", label: "Entertainment", icon: VenetianMask }, // Changed from Film for more unique icon
  { value: "shopping", label: "Shopping", icon: ShoppingBag },
  { value: "health", label: "Health", icon: HeartPulse },
  { value: "other", label: "Other", icon: MoreHorizontal },
];

export type ExpenseCategoryValue = typeof expenseCategories[number]['value'];

const getCategoryConfig = (value: string) => {
  return expenseCategories.find(category => category.value === value);
};
export { getCategoryConfig };
