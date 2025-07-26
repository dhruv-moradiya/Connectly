import { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin, {
  type DateClickArg,
} from "@fullcalendar/interaction";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { EventTimeSelector } from "@/components/events/event-time-selector";

type TPopoverState = {
  date: string;
  target: HTMLElement;
} | null;

const Event = () => {
  const [popoverState, setPopoverState] = useState<TPopoverState>(null);

  const handleDateClicked = (info: DateClickArg) => {
    setPopoverState({
      date: info.dateStr,
      target: info.dayEl,
    });
  };

  return (
    <div className="p-4">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        editable={true}
        selectable={true}
        headerToolbar={false}
        dateClick={handleDateClicked}
        events={[
          { title: "🏀 Basketball Match", date: "2025-06-01" },
          { title: "🎉 Birthday Party", date: "2025-06-02" },
        ]}
      />

      {popoverState && (
        <Popover open onOpenChange={() => setPopoverState(null)}>
          <PopoverTrigger asChild>
            <button
              style={{
                top:
                  popoverState.target.getBoundingClientRect().top +
                  window.scrollY,
                left:
                  popoverState.target.getBoundingClientRect().left +
                  window.scrollX,
                width: 1,
                height: 1,
                opacity: 0,
              }}
              className={cn("absolute")}
            />
          </PopoverTrigger>

          <PopoverContent className="slide-in-right w-fit flex flex-col gap-4 items-start">
            <Input className="w-full" placeholder="Event Title" />

            <EventTimeSelector selectedDate={new Date(popoverState.date)} />
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
};

export default Event;
