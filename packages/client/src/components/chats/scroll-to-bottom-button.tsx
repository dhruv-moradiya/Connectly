import { ArrowDown } from "lucide-react";
import { Button } from "../ui/button";

// ScrollToBottomButton.tsx
const ScrollToBottomButton = () => (
  <Button
    variant="secondary"
    size="sm"
    className="fixed bottom-30 right-40 shadow-2xl z-50"
  >
    New message
    <ArrowDown />
  </Button>
);

export default ScrollToBottomButton;
