import * as React from "react";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Utility functions
const formatDate = (date?: Date) => (date ? format(date, "EEEE, d MMMM") : "");

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isValidDate = (date: any): date is Date =>
  date instanceof Date && !isNaN(date.getTime());

interface Calendar28Props {
  value?: Date;
  label?: string;
  narrow?: boolean;
  onChange?: (date: Date | undefined) => void;
}

export function Calendar28({
  value,
  label = "",
  narrow = false,
  onChange,
}: Calendar28Props) {
  const initialDate = value ?? new Date();

  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(initialDate);
  const [month, setMonth] = React.useState<Date>(initialDate);
  const [inputValue, setInputValue] = React.useState(formatDate(initialDate));

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setInputValue(raw);

    const parsed = new Date(raw);
    if (isValidDate(parsed)) {
      setDate(parsed);
      setMonth(parsed);
      onChange?.(parsed);
    }
  };

  const handleSelect = (date?: Date) => {
    if (date) {
      setDate(date);
      setInputValue(formatDate(date));
      setOpen(false);
      onChange?.(date);
    }
  };

  return (
    <div
      className={`flex flex-col gap-3 ${narrow ? "max-w-[150px]" : "w-full"}`}
    >
      {label && (
        <Label htmlFor="calendar-date-input" className="px-1">
          {label}
        </Label>
      )}
      <div className="relative flex gap-2">
        <Input
          id="calendar-date-input"
          value={inputValue}
          placeholder="June 01, 2025"
          className="bg-background pr-10"
          onChange={handleInputChange}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setOpen(true);
            }
          }}
        />

        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
              aria-label="Open calendar"
            >
              <CalendarIcon className="size-3.5" />
              <span className="sr-only">Select date</span>
            </Button>
          </PopoverTrigger>

          <PopoverContent
            className="w-auto overflow-hidden p-0"
            align="end"
            alignOffset={-8}
            sideOffset={10}
          >
            <Calendar
              mode="single"
              selected={date}
              captionLayout="dropdown"
              month={month}
              onMonthChange={setMonth}
              onSelect={handleSelect}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
