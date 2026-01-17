'use client';

import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useActiveContext } from '@/app/dashboard/active-context-provider';
import { useCollection } from '@/firebase';
import { useState } from 'react';
import { NewLoanDialog } from '@/components/new-loan-dialog';
import { format } from 'date-fns';

function LoadingScreen() {
    return (
        <div className="flex items-center justify-center rounded-lg border bg-card text-card-foreground shadow-sm h-64">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-dashed border-primary"></div>
        </div>
    );
}

export default function LoansPage() {
  const [isNewLoanOpen, setNewLoanOpen] = useState(false);
  const { loansQuery } = useActiveContext();

  // The "Dead-Bolt" Guard: Do not attempt to fetch data until the query is valid.
  if (!loansQuery) {
    return <LoadingScreen />;
  }
  
  const { data: loans, isLoading } = useCollection(loansQuery);

  return (
    <>
      <Tabs defaultValue="all">
        <div className="flex items-center">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="overdue">Overdue</TabsTrigger>
            <TabsTrigger value="paid">Paid</TabsTrigger>
          </TabsList>
          <div className="ml-auto flex items-center gap-2">
            <Button onClick={() => setNewLoanOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" /> New Loan
            </Button>
          </div>
        </div>
        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>Loans</CardTitle>
              <CardDescription>Manage your active and past loans.</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading && <LoadingScreen />}
              {!isLoading && (!loans || loans.length === 0) && (
                 <div className="text-center py-10">
                    <h3 className="text-xl font-semibold">No Loans Found</h3>
                    <p className="text-muted-foreground mt-2">
                        Click "New Loan" to create your first loan.
                    </p>
                </div>
              )}
               {!isLoading && loans && loans.length > 0 && (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Borrower</TableHead>
                      <TableHead className="hidden md:table-cell">Principal</TableHead>
                      <TableHead className="hidden sm:table-cell">Total Repayment</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="hidden sm:table-cell">Due Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                   {loans.map(loan => (
                      <TableRow key={loan.id}>
                        <TableCell>
                          <div className="font-medium">{loan.borrowerName}</div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          ${loan.principal.toFixed(2)}
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                           ${loan.totalRepaymentAmount.toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={
                                loan.status === 'PAID' ? 'secondary' : 
                                loan.status === 'OVERDUE' ? 'destructive' : 'outline'
                            }
                           >
                            {loan.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          {loan.dueDate ? format(new Date(loan.dueDate.toDate()), 'PPP') : 'N/A'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <NewLoanDialog isOpen={isNewLoanOpen} onOpenChange={setNewLoanOpen} />
    </>
  );
}

    