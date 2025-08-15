import type { UseFormReturn } from "react-hook-form";
import type { EventFormData } from "./event-time-selector";
import { Input } from "@/components/ui/input";
import Calendar22 from "@/components/common/calendar-22";

interface Props {
  form: UseFormReturn<EventFormData>;
}

const SignleDayDateInput = ({ form }: Props) => {
  return (
    <div className="flex items-center gap-2">
      <Calendar22
        withLabel={false}
        value={form.watch("startDate")}
        onChange={(date) => {
          console.log("date :>> ", date);
        }}
      />
      <div className="flex gap-2">
        <div className="flex flex-col gap-3">
          <Input
            type="time"
            id="startTime"
            step="1"
            defaultValue="10:30:00"
            {...form.register("startTime")}
            className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
          />
        </div>
        <div className="flex flex-col gap-3">
          <Input
            type="time"
            id="endTime"
            step="1"
            defaultValue="10:30:00"
            {...form.register("endTime")}
            className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
          />
        </div>
      </div>
    </div>
  );
};

export default SignleDayDateInput;
