import { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin, {
  type DateClickArg,
} from "@fullcalendar/interaction";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import EventCreationForm from "@/components/events/event-form/event-time-selector";

type TDialogState = boolean;

const Event = () => {
  const [dialogState, setDialogState] = useState<TDialogState>(false);
  const [date, setDate] = useState<Date>(new Date());

  const handleDateClicked = (info: DateClickArg) => {
    setDialogState(true);
    setDate(info.date);
  };

  console.log("date :>> ", date);

  return (
    <div className="w-full h-[calc(100vh-65px)] p-4 overflow-hidden">
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

      <Dialog open={dialogState} onOpenChange={() => setDialogState(false)}>
        <DialogContent className="max-h-11/12 max-w-4xl">
          <DialogHeader>
            <DialogTitle>Create Event </DialogTitle>
          </DialogHeader>
          <EventCreationForm date={date} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Event;
