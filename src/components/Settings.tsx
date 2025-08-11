import { useAppStore } from "@/services/store";
import { Button, ButtonGroup, Stack, Typography } from "@mui/material";
import { useShallow } from "zustand/shallow";

export default function Settings() {
  const store = useAppStore(useShallow((state) => state));
  return (
    <Stack direction="row" spacing={2} mb={1}>
      <Stack>
        <Typography variant="body2" fontWeight="bold">
          Tough Multiplier
        </Typography>
        <ButtonGroup>
          <Button
            variant={store.toughMultiplier === 3 ? "contained" : "outlined"}
            onClick={() => store.setToughMultiplier(3)}
          >
            x3
          </Button>
        </ButtonGroup>
      </Stack>

      <Stack>
        <Typography variant="body2" fontWeight="bold">
          Table
        </Typography>
        <ButtonGroup>
          <Button
            variant={!store.halfRange ? "contained" : "outlined"}
            onClick={() => store.setHalfRange(false)}
          >
            Full Size
          </Button>
          <Button
            variant={store.halfRange ? "contained" : "outlined"}
            onClick={() => store.setHalfRange(true)}
          >
            KT Size
          </Button>
        </ButtonGroup>
      </Stack>
    </Stack>
  );
}
