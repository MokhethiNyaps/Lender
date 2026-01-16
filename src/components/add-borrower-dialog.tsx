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
import { useState } from 'react';
import { useUser, useFirestore, setDocumentNonBlocking } from '@/firebase';
import { useActiveContext } from '@/app/dashboard/active-context-provider';
import { doc, collection, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';

interface AddBorrowerDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddBorrowerDialog({ isOpen, onOpenChange }: AddBorrowerDialogProps) {
  const { user } = useUser();
  const firestore = useFirestore();
  const { activeContext } = useActiveContext();
  const { toast } = useToast();
  
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateBorrower = async () => {
    if (!user || !firestore || !activeContext) {
      toast({ variant: 'destructive', title: 'Error', description: 'Invalid context or user not logged in.' });
      return;
    }
    if (!name) {
      toast({ variant: 'destructive', title: 'Error', description: 'Borrower name is required.' });
      return;
    }

    setIsCreating(true);

    try {
      const borrowerId = uuidv4();
      const newBorrower = {
        id: borrowerId,
        name,
        phone,
        idNumber,
        contextId: activeContext.id,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        createdBy: user.uid,
      };

      // Use setDoc with a specific ID to avoid race conditions with addDoc
      const borrowerDocRef = doc(firestore, 'borrowers', borrowerId);
      setDocumentNonBlocking(borrowerDocRef, newBorrower, { merge: false });
      
      toast({
        title: 'Borrower Added!',
        description: `${name} has been added to your context.`,
      });

      // Reset form and close dialog
      setName('');
      setPhone('');
      setIdNumber('');
      onOpenChange(false);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: error.message || 'Could not add borrower.',
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add a New Borrower</DialogTitle>
          <DialogDescription>
            Enter the details for a new borrower in your active context.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">Full Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" placeholder="e.g., Jane Doe" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="phone" className="text-right">Phone</Label>
            <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="col-span-3" placeholder="e.g., 555-123-4567" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="idNumber" className="text-right">ID Number</Label>
            <Input id="idNumber" value={idNumber} onChange={(e) => setIdNumber(e.target.value)} className="col-span-3" placeholder="(Optional)" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isCreating}>Cancel</Button>
          <Button onClick={handleCreateBorrower} disabled={isCreating}>
            {isCreating ? 'Adding...' : 'Add Borrower'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
