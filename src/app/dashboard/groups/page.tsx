import { PlusCircle, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';

const groups = [
    { name: "Family Stokvel", members: 12, value: "family-stokvel" },
    { name: "Work Friends", members: 5, value: "work-friends" },
    { name: "Community Support", members: 25, value: "community-support" },
]

export default function GroupsPage() {
  return (
    <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Groups</h1>
                <p className="text-muted-foreground">Manage your lending groups and stokvels.</p>
            </div>
            <Button>
            <PlusCircle className="mr-2 h-4 w-4" /> New Group
            </Button>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {groups.map((group) => (
                <Card key={group.name} className="flex flex-col">
                    <CardHeader className="flex-row items-center justify-between space-y-0">
                        <CardTitle className="text-base font-medium">{group.name}</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent className="flex-grow">
                        <div className="flex items-center space-x-4">
                            <div className="flex -space-x-2 overflow-hidden">
                                <Avatar className="inline-block h-8 w-8 rounded-full ring-2 ring-background">
                                    <AvatarImage src={`https://picsum.photos/seed/${group.value}-1/40/40`} data-ai-hint="person avatar" />
                                    <AvatarFallback>OM</AvatarFallback>
                                </Avatar>
                                <Avatar className="inline-block h-8 w-8 rounded-full ring-2 ring-background">
                                    <AvatarImage src={`https://picsum.photos/seed/${group.value}-2/40/40`} data-ai-hint="person avatar" />
                                    <AvatarFallback>BE</AvatarFallback>
                                </Avatar>
                                <Avatar className="inline-block h-8 w-8 rounded-full ring-2 ring-background">
                                    <AvatarImage src={`https://picsum.photos/seed/${group.value}-3/40/40`} data-ai-hint="person avatar" />
                                    <AvatarFallback>JK</AvatarFallback>
                                </Avatar>
                            </div>
                            <p className="text-sm text-muted-foreground">{group.members} members</p>
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
    </div>
  );
}
