"use client"

import { format, addDays, isBefore, setHours, setMinutes } from "date-fns"
import { de } from "date-fns/locale"
import { useState, useRef, useEffect } from "react"
import { CalendarIcon, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface DateTimePickerProps {
  selected?: Date
  onSelect: (date: Date | undefined) => void
  mode?: "pickup" | "return"
  minDate?: Date
  placeholder?: string
  onComplete?: () => void
}

export function DateTimePicker({
  selected,
  onSelect,
  mode = "pickup",
  minDate,
  placeholder = "Datum & Uhrzeit wählen",
  onComplete,
}: DateTimePickerProps) {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(selected)
  const [selectedHour, setSelectedHour] = useState<string>(selected ? format(selected, "HH") : "12")
  const [selectedMinute, setSelectedMinute] = useState<string>(selected ? format(selected, "mm") : "00")
  const hourSelectRef = useRef<HTMLButtonElement>(null)

  // Set default minimum date based on mode
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const tomorrow = addDays(today, 1)

  // For pickup, min date is tomorrow
  // For return, min date is either the selected pickup date or tomorrow, whichever is later
  const defaultMinDate = mode === "pickup" ? tomorrow : minDate && isBefore(tomorrow, minDate) ? minDate : tomorrow

  const actualMinDate = minDate || defaultMinDate

  // Generate hours and minutes for select options
  const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, "0"))
  const minutes = ["00", "15", "30", "45"]

  // Update the final selected date and time
  useEffect(() => {
    if (selectedDate) {
      const newDateWithTime = setMinutes(
        setHours(selectedDate, Number.parseInt(selectedHour)),
        Number.parseInt(selectedMinute),
      )

      // Only call onSelect if the date has actually changed
      // This prevents the infinite update loop
      if (!selected || newDateWithTime.getTime() !== selected.getTime()) {
        onSelect(newDateWithTime)
      }
    }
  }, [selectedDate, selectedHour, selectedMinute, onSelect, selected])

  // Handle date selection
  const handleDateSelect = (date: Date | undefined) => {
    if (date?.getTime() !== selectedDate?.getTime()) {
      setSelectedDate(date)
      if (date) {
        // Focus on hour select after date selection
        setTimeout(() => {
          hourSelectRef.current?.focus()
        }, 100)
      }
    }
  }

  // Handle hour selection
  const handleHourSelect = (hour: string) => {
    setSelectedHour(hour)
  }

  // Handle minute selection
  const handleMinuteSelect = (minute: string) => {
    setSelectedMinute(minute)
    // Call onComplete after selecting the minute (last step)
    if (onComplete) {
      setTimeout(() => {
        setIsCalendarOpen(false)
        onComplete()
      }, 300)
    }
  }

  return (
    <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn("w-full justify-start text-left font-normal", !selected && "text-muted-foreground")}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {selected ? format(selected, "PPP HH:mm", { locale: de }) : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleDateSelect}
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
        <div className="p-3 border-t flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">Uhrzeit:</span>
          <Select value={selectedHour} onValueChange={handleHourSelect}>
            <SelectTrigger ref={hourSelectRef} className="w-[70px]">
              <SelectValue placeholder="HH" />
            </SelectTrigger>
            <SelectContent>
              {hours.map((hour) => (
                <SelectItem key={hour} value={hour}>
                  {hour}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span>:</span>
          <Select value={selectedMinute} onValueChange={handleMinuteSelect}>
            <SelectTrigger className="w-[70px]">
              <SelectValue placeholder="MM" />
            </SelectTrigger>
            <SelectContent>
              {minutes.map((minute) => (
                <SelectItem key={minute} value={minute}>
                  {minute}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </PopoverContent>
    </Popover>
  )
}

