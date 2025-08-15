"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Clock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import AllDayDateInputs from "./all-day-date-inputs";
import SignleDayDateInput from "./single-day-date-inputs";
import { format } from "date-fns";

// ------------------
// Zod Schema
// ------------------
const eventSchema = z.object({
  eventName: z.string().min(1, "Event name is required"),
  allDay: z.boolean(),
  startDate: z.date(),
  endDate: z.date().optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  repeat: z.string().optional(),
});

export type EventFormData = z.infer<typeof eventSchema>;

const EventTimeSelector = ({ date }: { date: Date }) => {
  const [showDateSelector, setShowDateSelector] = useState(false);

  const form = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      eventName: "",
      allDay: true,
      startDate: date,
      endDate: date,
      startTime: Date.now().toLocaleString(),
      endTime: Date.now().toLocaleString(),
      repeat: "",
    },
  });

  const watchAllDay = form.watch("allDay");

  const onSubmit = (data: EventFormData) => {
    console.log("Form Data:", data);
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="max-w-2xl space-y-4 rounded-lg"
    >
      {/* Event Name */}
      <div className="space-y-1">
        <Label htmlFor="eventName">Event name</Label>
        <Input
          id="eventName"
          placeholder="Add title and time"
          {...form.register("eventName")}
        />
        {form.formState.errors.eventName && (
          <p className="text-red-500 text-sm">
            {form.formState.errors.eventName.message}
          </p>
        )}
      </div>

      {/* Date Section */}
      <div className="flex items-start gap-2">
        <Clock size={18} className="mt-1 shrink-0 text-neutral-600" />

        {showDateSelector && (
          <div className="flex flex-col gap-3 flex-1">
            {watchAllDay ? (
              <AllDayDateInputs form={form} />
            ) : (
              <SignleDayDateInput form={form} />
            )}

            {/* All Day Checkbox */}
            <div className="flex items-center gap-2">
              <Checkbox
                id="allDay"
                checked={watchAllDay}
                onCheckedChange={(checked) =>
                  form.setValue("allDay", Boolean(checked))
                }
              />
              <Label htmlFor="allDay">All day</Label>
            </div>

            {/* Repeat Selector */}
            <Select
              onValueChange={(value) => form.setValue("repeat", value)}
              value={form.watch("repeat")}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Does not repeat" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="none">Does not repeat</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        )}

        {!showDateSelector && (
          <div className="flex-1 flex items-center justify-between gap-2">
            <div
              className="flex-1 flex flex-col gap-0.5 py-1 px-2 rounded-md hover:bg-primary/5 cursor-pointer"
              onClick={() => setShowDateSelector(true)}
            >
              <div className="flex items-center gap-1 text-sm">
                <p className="hover:underline">{format(date, "PP")}</p>
                <p>-</p>
                <p className="hover:underline">format(date, "PP")</p>
              </div>
              <p className="text-xs">Does not repeat</p>
            </div>
            <Button
              type="button"
              variant={"outline"}
              size={"sm"}
              className="rounded-full"
              onClick={() => setShowDateSelector(true)}
            >
              Add time
            </Button>
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <Button type="submit">Save Event</Button>
      </div>
    </form>
  );
};

export default EventTimeSelector;
