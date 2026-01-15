import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Dashboard() {
  return (
    <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
      <div className="xl:col-span-2 grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Lent</CardDescription>
              <CardTitle className="text-4xl">$132,987</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">
                +25% from last month
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Active Loans</CardDescription>
              <CardTitle className="text-4xl">12</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">
                +10% from last month
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Collected</CardDescription>
              <CardTitle className="text-4xl">$89,123</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">
                +15% from last month
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Overdue Loans</CardDescription>
              <CardTitle className="text-4xl">3</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">
                -2 since last month
              </div>
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader className="px-7">
            <CardTitle>Recent Loans</CardTitle>
            <CardDescription>
              Recent loans from your contexts.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Borrower</TableHead>
                  <TableHead className="hidden sm:table-cell">
                    Context
                  </TableHead>
                  <TableHead className="hidden sm:table-cell">
                    Status
                  </TableHead>
                  <TableHead className="hidden md:table-cell">
                    Date
                  </TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <div className="font-medium">Liam Johnson</div>
                    <div className="hidden text-sm text-muted-foreground md:inline">
                      liam@example.com
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    Solo Lender
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <Badge className="text-xs" variant="outline">
                      Active
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    2023-06-23
                  </TableCell>
                  <TableCell className="text-right">$250.00</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <div className="font-medium">Olivia Smith</div>
                    <div className="hidden text-sm text-muted-foreground md:inline">
                      olivia@example.com
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    Family Stokvel
                  </TableCell>
                   <TableCell className="hidden sm:table-cell">
                    <Badge className="text-xs" variant="secondary">
                      Paid
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    2023-06-24
                  </TableCell>
                  <TableCell className="text-right">$150.00</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Card className="overflow-hidden xl:col-span-1">
        <CardHeader className="flex flex-row items-start bg-muted/50">
          <div className="grid gap-0.5">
            <CardTitle className="group flex items-center gap-2 text-lg">
              Recent Activity
            </CardTitle>
            <CardDescription>An append-only log of all actions.</CardDescription>
          </div>
          <div className="ml-auto flex items-center gap-1">
            <Button asChild size="sm" className="ml-auto gap-1">
              <Link href="/dashboard/activity">
                View All
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6 text-sm">
          <div className="grid gap-3">
            <div className="font-semibold">New Loan Created</div>
            <ul className="grid gap-3">
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">
                  Loan to <strong>Liam Johnson</strong>
                </span>
                <span>$250.00</span>
              </li>
            </ul>
            <p className="text-xs text-muted-foreground">Context: Solo Lender, 2 days ago</p>
          </div>
          <div className="grid gap-3 mt-4 pt-4 border-t">
            <div className="font-semibold">Payment Received</div>
            <ul className="grid gap-3">
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">
                  Payment from <strong>Ava Davis</strong>
                </span>
                <span>$50.00</span>
              </li>
            </ul>
            <p className="text-xs text-muted-foreground">Context: Family Stokvel, 3 days ago</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
