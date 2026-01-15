'use client';

import { PlusCircle, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { CreateGroupDialog } from '@/components/create-group-dialog';
import { useState } from 'react';
import { useActiveContext } from '@/app/dashboard/active-context-provider';

export default function GroupsPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const [isCreateGroupOpen, setCreateGroupOpen] = useState(false);
  const { activeContext } = useActiveContext();

  // Find the user's role contexts to identify their groups
  const userRoleContextsQuery = useMemoFirebase(() => {
    if (!user) return null;
    return query(collection(firestore, 'user_role_contexts'), where('userId', '==', user.uid));
  }, [firestore, user]);

  const { data: userRoleContexts, isLoading: isLoadingContexts } = useCollection(userRoleContextsQuery);

  const groupIds = useMemoFirebase(() => {
    if (!userRoleContexts) return [];
    return userRoleContexts.filter(rc => rc.groupId).map(rc => rc.groupId);
  }, [userRoleContexts]);
  
  // Query for the groups using the retrieved IDs
   const groupsQuery = useMemoFirebase(() => {
    if (!firestore || !groupIds || groupIds.length === 0) return null;
    return query(collection(firestore, 'groups'), where('id', 'in', groupIds));
  }, [firestore, groupIds]);

  const { data: groups, isLoading: isLoadingGroups } = useCollection(groupsQuery);
  const isLoading = isLoadingContexts || isLoadingGroups;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Groups</h1>
          <p className="text-muted-foreground">
            {activeContext.type === 'solo'
              ? 'Manage your lending groups and stokvels.'
              : `Viewing: ${activeContext.label}`}
          </p>
        </div>
        <Button onClick={() => setCreateGroupOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" /> New Group
        </Button>
      </div>

      {isLoading && (
         <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
                <Card key={i} className="flex flex-col">
                    <CardHeader className="flex-row items-center justify-between space-y-0">
                         <div className="h-6 w-3/4 rounded-md bg-muted animate-pulse" />
                    </CardHeader>
                     <CardContent className="flex-grow">
                        <div className="h-8 w-1/2 rounded-md bg-muted animate-pulse" />
                     </CardContent>
                     <CardFooter>
                         <div className="h-10 w-full rounded-md bg-muted animate-pulse" />
                    </CardFooter>
                </Card>
            ))}
        </div>
      )}

      {!isLoading && groups && groups.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {groups.map((group) => (
            <Card key={group.id} className="flex flex-col">
              <CardHeader className="flex-row items-center justify-between space-y-0">
                <CardTitle className="text-base font-medium">{group.name}</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="flex items-center space-x-4">
                    <p className="text-sm text-muted-foreground">{group.description}</p>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="#">View Group</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

       {!isLoading && (!groups || groups.length === 0) && (
        <Card>
            <CardHeader>
                <CardTitle>No Groups Yet</CardTitle>
                <CardDescription>You are not a member of any groups. Create one to get started!</CardDescription>
            </CardHeader>
        </Card>
      )}

      <CreateGroupDialog isOpen={isCreateGroupOpen} onOpenChange={setCreateGroupOpen} />
    </div>
  );
}
