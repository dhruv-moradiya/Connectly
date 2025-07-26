import { useState } from "react";
import { Bell, Clock, LineChart, User } from "lucide-react";
import { format } from "date-fns";

import { Calendar28 } from "@/components/ui/calendar-28";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RepeatSelect } from "../repeat-select";

import { cn } from "@/lib/utils";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Separator } from "../ui/separator";

interface TNewEventTimeSelectorProps {
  selectedDate: Date;
}

const formatDisplayDate = (date: Date) => format(date, "EEEE, d MMMM");

export const EventTimeSelector = ({
  selectedDate,
}: TNewEventTimeSelectorProps) => {
  const [view, setView] = useState<"summary" | "date-picker" | "time-picker">(
    "summary"
  );

  const handleDateChange = (date: Date | undefined) => {
    console.log("Selected date:", date);
  };

  return (
    <div className="flex flex-col gap-3">
      <div
        className={cn(
          "flex flex-row space-x-3",
          view !== "summary" ? "items-start" : "items-center"
        )}
      >
        <Clock
          className={cn(
            "size-4 text-muted-foreground",
            view !== "summary" && "translate-y-1"
          )}
        />

        {view === "date-picker" && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-1.5">
              <Calendar28
                value={selectedDate}
                narrow
                onChange={handleDateChange}
              />
              <Calendar28
                value={selectedDate}
                narrow
                onChange={handleDateChange}
              />
            </div>

            <div className="flex items-center gap-3">
              <Checkbox id="all_day" />
              <Label htmlFor="all_day" className="text-sm font-normal">
                All Day
              </Label>
            </div>

            <RepeatSelect
              value="does not repeat"
              onChange={(val) => console.log("Repeat option:", val)}
            />
          </div>
        )}

        {view === "time-picker" && (
          <div className="flex flex-col gap-3">
            <Calendar28
              value={selectedDate}
              narrow
              onChange={handleDateChange}
            />
            <div className="flex items-center gap-3">
              <Input
                type="time"
                id="time-picker"
                step="1"
                defaultValue="10:30:00"
                className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
              />
              <span>-</span>
              <Input
                type="time"
                id="time-picker"
                step="1"
                defaultValue="10:30:00"
                className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
              />
            </div>
            <RepeatSelect
              value="does not repeat"
              onChange={(val) => console.log("Repeat option:", val)}
            />
          </div>
        )}

        {view === "summary" && (
          <>
            <div
              className="text-sm hover:cursor-pointer hover:bg-gray-100 transition-colors duration-300 px-4 py-1 rounded-xl"
              onClick={() => setView("date-picker")}
            >
              <p className="flex space-x-1.5">
                <span>{formatDisplayDate(selectedDate)}</span>
                <span>-</span>
                <span>{formatDisplayDate(selectedDate)}</span>
              </p>
              <p className="text-[12px] text-muted-foreground">
                Does not repeat
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="rounded-full font-medium text-[12px]"
              onClick={() => setView("time-picker")}
            >
              Add Time
            </Button>
          </>
        )}
      </div>

      <div className="flex items-center gap-4">
        <User className="size-4 text-muted-foreground" />
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Guests" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="user1">
              <div className="flex items-center space-x-3">
                <div className="flex flex-col">
                  <span className="font-medium text-sm">Jane Doe</span>
                  <span className="text-muted-foreground text-xs">
                    jane@example.com
                  </span>
                </div>
              </div>
            </SelectItem>

            <SelectItem value="user2">
              <div className="flex items-center space-x-3">
                <div className="flex flex-col">
                  <span className="font-medium text-sm">John Smith</span>
                  <span className="text-muted-foreground text-xs">
                    john@example.com
                  </span>
                </div>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-start gap-4">
        <LineChart className="size-4 text-muted-foreground" />
        <Textarea />
      </div>

      <Separator />

      <div className="flex items-center gap-4">
        <Bell className="size-4 text-muted-foreground" />

        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Theme" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="light">Light</SelectItem>
            <SelectItem value="dark">Dark</SelectItem>
            <SelectItem value="system">System</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button className="w-fit ml-auto cursor-pointer">Save</Button>
    </div>
  );
};
