import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/components/ui/select";

interface RepeatSelectProps {
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

const options = [
  { label: "Does not repeat", value: "does not repeat" },
  { label: "Daily", value: "daily" },
  { label: "Weekly", value: "weekly" },
  { label: "Monthly", value: "monthly" },
  { label: "Yearly", value: "yearly" },
];

export const RepeatSelect = ({
  value = "does not repeat",
  onChange,
  className,
}: RepeatSelectProps) => {
  return (
    <Select defaultValue={value} onValueChange={onChange}>
      <SelectTrigger className={className ?? "w-[180px]"}>
        <SelectValue placeholder="Select repeat option" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
