"use client"
import { format, addDays, isBefore } from "date-fns"
import { de } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface DatePickerProps {
  selected?: Date
  onSelect: (date: Date | undefined) => void
  mode?: "pickup" | "return"
  minDate?: Date
  placeholder?: string
}

export function DatePicker({
  selected,
  onSelect,
  mode = "pickup",
  minDate,
  placeholder = "Datum wählen",
}: DatePickerProps) {
  // Set default minimum date based on mode
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const tomorrow = addDays(today, 1)

  // For pickup, min date is tomorrow
  // For return, min date is either the selected pickup date or tomorrow, whichever is later
  const defaultMinDate = mode === "pickup" ? tomorrow : minDate && isBefore(tomorrow, minDate) ? minDate : tomorrow

  const actualMinDate = minDate || defaultMinDate

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn("w-full justify-start text-left font-normal", !selected && "text-muted-foreground")}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {selected ? format(selected, "PPP", { locale: de }) : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={selected}
          onSelect={onSelect}
          initialFocus
          locale={de}
          fromDate={actualMinDate}
          modifiers={{
            today: [today],
          }}
          modifiersStyles={{
            today: {
              fontWeight: "bold",
              border: "2px solid currentColor",
              color: "var(--primary)",
            },
          }}
        />
      </PopoverContent>
    </Popover>
  )
}

