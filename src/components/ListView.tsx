import { LoadoutEntry, Unit } from "@/services/interfaces";
import { useAppStore } from "@/services/store";
import { Box, Card, CardContent, Divider, Grid, Stack, Typography } from "@mui/material";
import { useShallow } from "zustand/shallow";
import RuleList from "./RuleList";
import { orderBy } from "lodash";

export default function ListView() {
  const { listResponse: list } = useAppStore(useShallow((state) => state));

  return (
    <Grid container spacing={1}>
      {list?.units.map((unit) => (
        <Grid key={unit.selectionId} item xs={12} sm={6} md={4}>
          <UnitView unit={unit} />
        </Grid>
      ))}
    </Grid>
  );
}

function UnitView({ unit }: { unit: Unit }) {
  const tough = unit.rules.find((x) => x.name === "Tough");

  return (
    <Card sx={{ mb: 2 }}>
      <Box sx={{ p: 2 }}>
        <Typography fontWeight="bold">
          {unit.name} [{unit.size}]
        </Typography>
        <Divider sx={{ mb: 1, mt: 0.5 }} />

        <Stack spacing={1} sx={{ mt: 1 }}>
          <Stack spacing={1} direction="row">
            <StatTile label="Quality" value={`${unit.quality}+`} />
            <StatTile label="Defense" value={`${unit.defense}+`} />
            <StatTile label="Tough" value={(tough?.rating * 3 || 3).toString()} />
          </Stack>
          <Stack>
            <Box mb={1}>
              <RuleList unit={unit} specialRules={unit.rules.filter((x) => x.name !== "Tough")} />
            </Box>
            {orderBy(unit.loadout, "type", "desc").map((x, i) => (
              <LoadoutItemDisplay key={i} entry={x} />
            ))}
          </Stack>
        </Stack>
      </Box>
    </Card>
  );
}

function LoadoutItemDisplay({ entry }: { entry: LoadoutEntry }) {
  if (entry.type === "ArmyBookWeapon") {
    return <WeaponDisplay entry={entry} />;
  }

  if (entry.type === "ArmyBookItem") {
    return (
      <>
        <Typography>{entry.name}</Typography>
        {entry.content.map((x, i) => (
          <Box key={i} sx={{ pl: 2 }}>
            <LoadoutItemDisplay entry={x} />
          </Box>
        ))}
      </>
    );
  }
}

function WeaponDisplay({ entry }: { entry: LoadoutEntry }) {
  const hasRules = entry.specialRules?.length > 0;
  return (
    <Typography>
      {entry.count || 1}x {entry.name} ({entry.range > 0 && `${entry.range}", `}A{entry.attacks * 3}
      {hasRules && ", "}
      <RuleList specialRules={entry.specialRules} />)
    </Typography>
  );
}

function StatTile({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        padding: "2px 8px",
        textAlign: "center",
        border: "1px solid grey",
        borderRadius: "4px",
        flex: 1,
      }}
    >
      <div style={{ textAlign: "center" }}>
        <p>{label}</p>
      </div>
      <div style={{ fontSize: "24px", fontWeight: "bold" }}>
        <p>{value}</p>
      </div>
    </div>
  );
}
