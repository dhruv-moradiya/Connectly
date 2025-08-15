import { type UseFormReturn } from "react-hook-form";
import { Calendar22 } from "@/components/common/calendar-22";
import type { EventFormData } from "./event-time-selector";
import { Minus } from "lucide-react";

interface Props {
  form: UseFormReturn<EventFormData>;
}

const AllDayDateInputs = ({ form }: Props) => {
  return (
    <div className="flex items-center gap-2">
      <Calendar22
        withLabel={false}
        value={form.watch("startDate")}
        onChange={(date) => form.setValue("startDate", date)}
        className="w-30 p-0"
      />
      <Minus size={16} className="text-neutral-600" />
      <Calendar22
        withLabel={false}
        value={form.watch("endDate")!}
        onChange={(date) => form.setValue("endDate", date)}
        className="w-30 p-0"
      />
    </div>
  );
};

export default AllDayDateInputs;
