import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

const Calendar22 = ({
  withLabel = true,
  value,
  onChange,
  className,
}: {
  withLabel?: boolean;
  value: Date;
  onChange: (date: Date) => void;
  className?: string;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col gap-3">
      {withLabel && <Label htmlFor="date">Date</Label>}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="date"
            className={cn("text-center font-normal", className)}
          >
            {value ? format(value, "PP") : "Select date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={value}
            captionLayout="dropdown"
            onSelect={(date) => {
              onChange(date as Date);
              setOpen(false);
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default Calendar22;
