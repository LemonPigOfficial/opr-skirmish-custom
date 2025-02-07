import { useAppStore } from "@/services/store";
import { Button, ButtonGroup } from "@mui/material";
import { useShallow } from "zustand/shallow";

export default function MultiplierSelector() {
  const store = useAppStore(useShallow((state) => state));
  return (
    <ButtonGroup>
      <Button
        variant={store.multiplier === 2 ? "contained" : "outlined"}
        onClick={() => store.setMultiplier(2)}
      >
        x2
      </Button>
      <Button
        variant={store.multiplier === 3 ? "contained" : "outlined"}
        onClick={() => store.setMultiplier(3)}
      >
        x3
      </Button>
    </ButtonGroup>
  );
}
