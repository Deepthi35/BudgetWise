// src/ai/flows/analyze-spending-patterns.ts
'use server';

/**
 * @fileOverview Analyzes spending patterns and provides personalized tips to reduce expenses.
 *
 * - analyzeSpendingPatterns - A function that analyzes spending patterns and returns personalized tips.
 * - AnalyzeSpendingPatternsInput - The input type for the analyzeSpendingPatterns function.
 * - AnalyzeSpendingPatternsOutput - The return type for the analyzeSpendingPatterns function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeSpendingPatternsInputSchema = z.object({
  expenses: z
    .array(
      z.object({
        category: z.string().describe('The category of the expense (e.g., food, transport).'),
        amount: z.number().describe('The amount spent on the expense.'),
        description: z.string().describe('A description of the expense.'),
      })
    )
    .describe('An array of expenses with category, amount, and description.'),
  budgetLimit: z.number().describe('The daily budget limit.'),
});

export type AnalyzeSpendingPatternsInput = z.infer<typeof AnalyzeSpendingPatternsInputSchema>;

const AnalyzeSpendingPatternsOutputSchema = z.object({
  spendingAnalysis: z.string().describe('An analysis of the spending patterns.'),
  tips: z.array(z.string()).describe('Personalized tips on how to reduce expenses.'),
});

export type AnalyzeSpendingPatternsOutput = z.infer<typeof AnalyzeSpendingPatternsOutputSchema>;

export async function analyzeSpendingPatterns(
  input: AnalyzeSpendingPatternsInput
): Promise<AnalyzeSpendingPatternsOutput> {
  return analyzeSpendingPatternsFlow(input);
}

const analyzeSpendingPatternsPrompt = ai.definePrompt({
  name: 'analyzeSpendingPatternsPrompt',
  input: {schema: AnalyzeSpendingPatternsInputSchema},
  output: {schema: AnalyzeSpendingPatternsOutputSchema},
  prompt: `You are a personal finance advisor. Analyze the user's spending patterns and provide personalized tips on how to reduce expenses, so the user can better manage their budget and achieve their financial goals.

  Daily Budget Limit: {{{budgetLimit}}}

  Expenses:
  {{#each expenses}}
  - Category: {{category}}, Amount: {{amount}}, Description: {{description}}
  {{/each}}

  Analyze these spending patterns and provide specific, actionable tips to reduce expenses. Be mindful of the budget limit, and try to suggest ways to cut down on spending in the most impactful categories.
  Format your response as a spending analysis followed by a bulleted list of tips.
  `,
});

const analyzeSpendingPatternsFlow = ai.defineFlow(
  {
    name: 'analyzeSpendingPatternsFlow',
    inputSchema: AnalyzeSpendingPatternsInputSchema,
    outputSchema: AnalyzeSpendingPatternsOutputSchema,
  },
  async input => {
    const {output} = await analyzeSpendingPatternsPrompt(input);
    return output!;
  }
);
