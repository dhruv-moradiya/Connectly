import { useState } from "react";
import clsx from "clsx";

type Props = {
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
};

export default function SwitchToggle({
  defaultChecked = false,
  onChange,
}: Props) {
  const [isOn, setIsOn] = useState(defaultChecked);

  const toggleSwitch = () => {
    const newState = !isOn;
    setIsOn(newState);
    onChange?.(newState);
  };

  return (
    <div
      onClick={toggleSwitch}
      className={clsx(
        "w-10 h-6 rounded-full border-2 relative cursor-pointer transition-colors duration-200",
        isOn ? "bg-primary border-primary" : "bg-neutral-200 border-neutral-300"
      )}
    >
      <div
        className={clsx(
          "size-4 rounded-full absolute top-1/2 -translate-y-1/2 bg-white shadow-md transition-transform duration-200",
          isOn ? "translate-x-[20px]" : "translate-x-[2px]"
        )}
      />
    </div>
  );
}
