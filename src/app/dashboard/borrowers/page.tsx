'use client';

import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useActiveContext } from '@/app/dashboard/active-context-provider';
import { useCollection } from '@/firebase';
import { useState } from 'react';
import { AddBorrowerDialog } from '@/components/add-borrower-dialog';

function LoadingScreen() {
    return (
        <div className="flex items-center justify-center rounded-lg border bg-card text-card-foreground shadow-sm h-64">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-dashed border-primary"></div>
        </div>
    );
}

export default function BorrowersPage() {
  const { borrowersQuery, activeContext } = useActiveContext();
  const [isAddBorrowerOpen, setAddBorrowerOpen] = useState(false);

  // The "Dead-Bolt" Guard: Do not even attempt to call useCollection until the query is valid.
  if (!borrowersQuery) {
    // This state occurs when the context is not ready yet. 
    // The main layout shield shows a full-page loader. This is a secondary, local guard.
    return <LoadingScreen />;
  }

  const { data: borrowers, isLoading } = useCollection(borrowersQuery);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Borrowers</h1>
          <p className="text-muted-foreground">
            Manage borrowers in your {activeContext?.label} context.
          </p>
        </div>
        <Button onClick={() => setAddBorrowerOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Borrower
        </Button>
      </div>

      {isLoading && <LoadingScreen />}

      {!isLoading && borrowers && borrowers.length > 0 && (
         <Card>
            <CardContent className="pt-6">
                <ul className="divide-y divide-border">
                {borrowers.map(borrower => (
                    <li key={borrower.id} className="py-4 flex items-center justify-between">
                        <div>
                            <p className="font-medium">{borrower.name}</p>
                            <p className="text-sm text-muted-foreground">{borrower.phone || 'No phone number'}</p>
                        </div>
                        <Button variant="outline" size="sm">View</Button>
                    </li>
                ))}
                </ul>
            </CardContent>
        </Card>
      )}

      {!isLoading && (!borrowers || borrowers.length === 0) && (
        <Card>
            <CardHeader>
                <CardTitle>No Borrowers Found</CardTitle>
                <CardDescription>You have not added any borrowers to this context yet.</CardDescription>
            </CardHeader>
             <CardContent>
                <Button onClick={() => setAddBorrowerOpen(true)}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Your First Borrower
                </Button>
            </CardContent>
        </Card>
      )}

      <AddBorrowerDialog isOpen={isAddBorrowerOpen} onOpenChange={setAddBorrowerOpen} />
    </div>
  );
}
