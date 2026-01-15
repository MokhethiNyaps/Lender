"use client"

import * as React from "react"
import { ChevronsUpDown, PlusCircle, User, Users } from "lucide-react"
import { useUser, useFirestore, useCollection, useMemoFirebase } from "@/firebase"
import { collection, query, where } from "firebase/firestore"
import { useActiveContext, soloContext, type ActiveContextType } from "@/app/dashboard/active-context-provider"
import { CreateGroupDialog } from '@/components/create-group-dialog';

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "./ui/skeleton"

export function ContextSwitcher() {
  const [open, setOpen] = React.useState(false);
  const [isCreateGroupOpen, setCreateGroupOpen] = React.useState(false);
  const { user } = useUser();
  const firestore = useFirestore();
  const { activeContext, setActiveContext } = useActiveContext();

  const handleContextSelect = (context: ActiveContextType) => {
    setActiveContext(context);
    setOpen(false);
  };
  
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


  const groupContexts: ActiveContextType[] = groups ? groups.map(group => ({
    id: group.id,
    type: 'group',
    label: group.name,
    icon: Users
  })) : [];
  
  if (isLoading) {
    return <Skeleton className="h-9 w-full max-w-[220px]" />;
  }
  
  return (
    <div className="px-4">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-label="Select a context"
            className="w-full justify-between bg-sidebar hover:bg-sidebar-accent max-w-[220px]"
          >
            {activeContext.icon && <activeContext.icon className="mr-2 h-4 w-4" />}
            <span className="truncate">{activeContext.label}</span>
            <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[220px] p-0">
          <div className="p-1">
             <div>
                <p className="p-2 text-xs font-medium text-muted-foreground">Personal</p>
                 <Button
                    variant="ghost"
                    className="w-full justify-start h-9"
                    onClick={() => handleContextSelect(soloContext)}
                  >
                    <User className="mr-2 h-4 w-4" />
                    {soloContext.label}
                  </Button>
            </div>
            
            {groupContexts.length > 0 && (
                <div>
                    <p className="p-2 text-xs font-medium text-muted-foreground">Groups</p>
                    {groupContexts.map((context) => (
                    <Button
                        key={context.id}
                        variant="ghost"
                        className="w-full justify-start h-9"
                        onClick={() => handleContextSelect(context)}
                    >
                        {context.icon && <context.icon className="mr-2 h-4 w-4" />}
                        {context.label}
                    </Button>
                    ))}
                </div>
            )}
           
            <Separator className="my-1" />
            <Button 
                variant="ghost" 
                className="w-full justify-start h-9"
                onClick={() => {
                  setCreateGroupOpen(true);
                  setOpen(false);
                }}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Group
            </Button>
          </div>
        </PopoverContent>
      </Popover>
      <CreateGroupDialog isOpen={isCreateGroupOpen} onOpenChange={setCreateGroupOpen} />
    </div>
  )
}
