'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from 'react';
import { useUser, useFirestore, addDocumentNonBlocking, useCollection } from '@/firebase';
import { useActiveContext } from '@/app/dashboard/active-context-provider';
import { collection, serverTimestamp, doc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface NewLoanDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewLoanDialog({ isOpen, onOpenChange }: NewLoanDialogProps) {
  const { user } = useUser();
  const firestore = useFirestore();
  const { activeContext, borrowersQuery } = useActiveContext();
  const { data: borrowers, isLoading: isLoadingBorrowers } = useCollection(borrowersQuery);
  const { toast } = useToast();
  
  const [borrowerId, setBorrowerId] = useState('');
  const [principal, setPrincipal] = useState(0);
  const [interestType, setInterestType] = useState<'FLAT_FEE' | 'PERCENTAGE_MONTHLY'>('FLAT_FEE');
  const [interestValue, setInterestValue] = useState(0);
  const [repaymentModel, setRepaymentModel] = useState<'INTEREST_ONLY' | 'FIXED_TOTAL'>('FIXED_TOTAL');
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [totalRepayment, setTotalRepayment] = useState(0);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    const principalAmount = Number(principal);
    const interestVal = Number(interestValue);
    if (isNaN(principalAmount) || isNaN(interestVal)) {
        setTotalRepayment(0);
        return;
    };

    let interest = 0;
    if (interestType === 'FLAT_FEE') {
        interest = interestVal;
    } else if (interestType === 'PERCENTAGE_MONTHLY') {
        interest = principalAmount * (interestVal / 100);
    }
    
    setTotalRepayment(principalAmount + interest);
  }, [principal, interestType, interestValue]);


  const handleCreateLoan = async () => {
    if (!user || !firestore || !activeContext) {
      toast({ variant: 'destructive', title: 'Error', description: 'Invalid context or user not logged in.' });
      return;
    }
    if (!borrowerId || principal <= 0 || !dueDate) {
      toast({ variant: 'destructive', title: 'Error', description: 'Please fill out all required fields.' });
      return;
    }

    setIsCreating(true);

    try {
      const loanId = uuidv4();
      const selectedBorrower = borrowers?.find(b => b.id === borrowerId);

      const newLoan = {
        id: loanId,
        borrowerId,
        borrowerName: selectedBorrower?.name || 'Unknown Borrower',
        contextId: user.uid, // Hard-anchor to user's UID
        principal: Number(principal),
        interestType,
        interestValue: Number(interestValue),
        repaymentModel,
        totalRepaymentAmount: totalRepayment,
        amountPaid: 0,
        status: 'ACTIVE',
        disbursedAt: serverTimestamp(),
        dueDate,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        createdBy: user.uid,
      };

      const newLedgerEntry = {
          id: uuidv4(),
          loanId,
          contextId: user.uid, // Hard-anchor to user's UID
          type: 'DISBURSEMENT',
          amount: Number(principal),
          transactionDate: serverTimestamp(),
          createdAt: serverTimestamp(),
          createdBy: user.uid,
      };

      // Atomic double-write using non-blocking functions
      addDocumentNonBlocking(collection(firestore, 'loans'), newLoan);
      addDocumentNonBlocking(collection(firestore, 'ledger'), newLedgerEntry);
      
      toast({
        title: 'Loan Created!',
        description: `Loan for ${newLoan.borrowerName} has been created.`,
      });

      // Reset form and close dialog
      setBorrowerId('');
      setPrincipal(0);
      setInterestValue(0);
      setDueDate(undefined);
      onOpenChange(false);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: error.message || 'Could not create loan.',
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create a New Loan</DialogTitle>
          <DialogDescription>
            Disburse a new loan to a borrower in your solo context.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="borrower">Borrower</Label>
            <Select onValueChange={setBorrowerId} value={borrowerId} disabled={isLoadingBorrowers}>
              <SelectTrigger id="borrower">
                <SelectValue placeholder="Select a borrower..." />
              </SelectTrigger>
              <SelectContent>
                {borrowers && borrowers.map(b => (
                    <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                ))}
                 {(!borrowers || borrowers.length === 0) && (
                    <div className="p-4 text-sm text-muted-foreground">No borrowers in this context.</div>
                )}
              </SelectContent>
            </Select>
          </div>
           <div className="space-y-2">
                <Label htmlFor="principal">Principal Amount</Label>
                <Input id="principal" type="number" value={principal} onChange={(e) => setPrincipal(parseFloat(e.target.value))} placeholder="e.g., 500" />
           </div>
           <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="interestType">Interest Model</Label>
                     <Select onValueChange={(v: 'FLAT_FEE' | 'PERCENTAGE_MONTHLY') => setInterestType(v)} defaultValue={interestType}>
                        <SelectTrigger id="interestType">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="FLAT_FEE">Flat Fee</SelectItem>
                            <SelectItem value="PERCENTAGE_MONTHLY">Monthly %</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="interestValue">{interestType === 'FLAT_FEE' ? 'Fee Amount ($)' : 'Interest Rate (%)'}</Label>
                    <Input id="interestValue" type="number" value={interestValue} onChange={(e) => setInterestValue(parseFloat(e.target.value))} />
                </div>
           </div>
           <div className="space-y-2">
                <Label htmlFor="repaymentModel">Repayment Model</Label>
                <Select onValueChange={(v: 'INTEREST_ONLY' | 'FIXED_TOTAL') => setRepaymentModel(v)} defaultValue={repaymentModel}>
                    <SelectTrigger id="repaymentModel">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="FIXED_TOTAL">Fixed Total</SelectItem>
                        <SelectItem value="INTEREST_ONLY">Interest Only</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                 <Label htmlFor="dueDate">Due Date</Label>
                 <Popover>
                    <PopoverTrigger asChild>
                    <Button
                        id="dueDate"
                        variant={"outline"}
                        className={cn(
                        "w-full justify-start text-left font-normal",
                        !dueDate && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dueDate ? format(dueDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                    <Calendar
                        mode="single"
                        selected={dueDate}
                        onSelect={setDueDate}
                        initialFocus
                    />
                    </PopoverContent>
                </Popover>
            </div>
            <div className="p-4 bg-secondary/50 rounded-md space-y-1">
                <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Principal</span>
                    <span>${Number(principal || 0).toFixed(2)}</span>
                </div>
                 <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Interest</span>
                    <span>${(totalRepayment - (Number(principal) || 0)).toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-semibold text-foreground">
                    <span>Total Repayment</span>
                    <span>${totalRepayment.toFixed(2)}</span>
                </div>
            </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isCreating}>Cancel</Button>
          <Button onClick={handleCreateLoan} disabled={isCreating || isLoadingBorrowers || !borrowerId}>
            {isCreating ? 'Creating...' : 'Create Loan'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

    