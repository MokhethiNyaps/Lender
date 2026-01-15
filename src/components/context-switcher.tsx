"use client"

import * as React from "react"
import { ChevronsUpDown, PlusCircle, User, Users } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"

const groups = [
  {
    label: "Personal",
    contexts: [
      {
        label: "Solo Lender",
        value: "solo",
        icon: User,
      },
    ],
  },
  {
    label: "Groups",
    contexts: [
      {
        label: "Family Stokvel",
        value: "family-stokvel",
        icon: Users,
      },
      {
        label: "Work Friends",
        value: "work-friends",
        icon: Users,
      },
    ],
  },
]

type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>

interface ContextSwitcherProps extends PopoverTriggerProps {}

export function ContextSwitcher({ className }: ContextSwitcherProps) {
  const [open, setOpen] = React.useState(false)
  const [selectedContext, setSelectedContext] = React.useState(groups[0].contexts[0])

  return (
    <div className="px-4">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-label="Select a context"
            className={cn("w-full justify-between bg-sidebar hover:bg-sidebar-accent", className)}
          >
            {selectedContext.icon && <selectedContext.icon className="mr-2 h-4 w-4" />}
            <span className="truncate">{selectedContext.label}</span>
            <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[220px] p-0">
          <div className="p-1">
            {groups.map((group) => (
              <div key={group.label}>
                <p className="p-2 text-xs font-medium text-muted-foreground">{group.label}</p>
                {group.contexts.map((context) => (
                  <Button
                    key={context.value}
                    variant="ghost"
                    className="w-full justify-start h-9"
                    onClick={() => {
                      setSelectedContext(context)
                      setOpen(false)
                    }}
                  >
                    {context.icon && <context.icon className="mr-2 h-4 w-4" />}
                    {context.label}
                  </Button>
                ))}
              </div>
            ))}
            <Separator className="my-1" />
            <Button variant="ghost" className="w-full justify-start h-9">
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Group
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
