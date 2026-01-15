import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function LoansPage() {
  return (
    <Tabs defaultValue="all">
      <div className="flex items-center">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="overdue">Overdue</TabsTrigger>
          <TabsTrigger value="paid">Paid</TabsTrigger>
        </TabsList>
        <div className="ml-auto flex items-center gap-2">
          <Button>
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
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Borrower</TableHead>
                  <TableHead className="hidden md:table-cell">Context</TableHead>
                  <TableHead className="hidden md:table-cell">Amount</TableHead>
                  <TableHead className="hidden sm:table-cell">Amount Due</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden sm:table-cell">Due Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <div className="font-medium">Liam Johnson</div>
                    <div className="text-sm text-muted-foreground hidden sm:block">liam@example.com</div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">Solo Lender</TableCell>
                  <TableCell className="hidden md:table-cell">$250.00</TableCell>
                  <TableCell className="hidden sm:table-cell">$50.00</TableCell>
                  <TableCell>
                    <Badge variant="outline">Active</Badge>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">2024-08-15</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <div className="font-medium">Olivia Smith</div>
                    <div className="text-sm text-muted-foreground hidden sm:block">olivia@example.com</div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">Family Stokvel</TableCell>
                  <TableCell className="hidden md:table-cell">$150.00</TableCell>
                  <TableCell className="hidden sm:table-cell">$0.00</TableCell>
                  <TableCell>
                    <Badge variant="secondary">Paid</Badge>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">2024-07-30</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <div className="font-medium">Noah Brown</div>
                    <div className="text-sm text-muted-foreground hidden sm:block">noah@example.com</div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">Work Friends</TableCell>
                  <TableCell className="hidden md:table-cell">$350.00</TableCell>
                  <TableCell className="hidden sm:table-cell">$400.00</TableCell>
                  <TableCell>
                    <Badge variant="destructive">Overdue</Badge>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">2024-06-01</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
