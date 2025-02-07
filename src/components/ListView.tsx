import { LoadoutEntry, Unit } from "@/services/interfaces";
import { useAppStore } from "@/services/store";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Card,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { useShallow } from "zustand/shallow";
import RuleList from "./RuleList";
import { orderBy } from "lodash";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Icon from "@mdi/react";
import { mdiShield, mdiWater, mdiSword } from "@mdi/js";
import { transformRuleText } from "@/services/helpers";

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
  const { armyBooks, multiplier } = useAppStore(
    useShallow((state) => ({ armyBooks: state.armyBooks, multiplier: state.multiplier }))
  );
  const armyBook = armyBooks.find((x) => x.uid === unit.armyId);
  const tough = unit.rules.find((x) => x.name === "Tough");
  const upgradeRules = unit.selectedUpgrades
    .flatMap((x) => x.option.gains)
    .filter((x) => x.type === "ArmyBookRule");
  const isCaster = unit.rules
    .concat(upgradeRules)
    .concat(unit.loadout.flatMap((x) => x.content || x).filter((x) => x.type === "ArmyBookRule"))
    .some((x) => x.name === "Caster");

  const spells = isCaster && armyBook?.spells;

  return (
    <Card sx={{ mb: 2 }}>
      <Accordion defaultExpanded disableGutters>
        <AccordionSummary expandIcon={<KeyboardArrowUpIcon />}>
          <Typography fontWeight="bold" flex={1}>
            {unit.name} [{unit.size}]
          </Typography>
          <Typography>{unit.cost}pts</Typography>
        </AccordionSummary>

        <AccordionDetails sx={{ pt: 0 }}>
          <Stack spacing={1}>
            <Stack spacing={1} direction="row">
              <StatTile label="Qua" value={`${unit.quality}+`} icon={mdiSword} />
              <StatTile label="Def" value={`${unit.defense}+`} icon={mdiShield} />
              <StatTile
                label="Tough"
                value={(tough?.rating * multiplier || multiplier).toString()}
                icon={mdiWater}
              />
            </Stack>
            <Stack>
              <Box mb={1}>
                <RuleList unit={unit} specialRules={unit.rules.filter((x) => x.name !== "Tough")} />
              </Box>
              {orderBy(unit.loadout, "type", "desc").map((x, i) => (
                <LoadoutItemDisplay key={i} entry={x} />
              ))}
              {upgradeRules.map((x, i) => (
                <LoadoutItemDisplay key={i} entry={x} />
              ))}
            </Stack>
          </Stack>
          {spells && (
            <Box mt={2}>
              {spells.map((x, i) => (
                <Typography key={i} variant="body2">
                  <span style={{ fontWeight: "bold" }}>
                    {x.name} ({x.threshold}):{" "}
                  </span>{" "}
                  {transformRuleText(x.effect, multiplier)}
                </Typography>
              ))}
            </Box>
          )}
        </AccordionDetails>
      </Accordion>
    </Card>
  );
}

function LoadoutItemDisplay({ entry }: { entry: LoadoutEntry }) {
  if (entry.type === "ArmyBookWeapon") {
    return <WeaponDisplay entry={entry} />;
  }

  if (entry.type === "ArmyBookRule") {
    return <RuleList specialRules={[entry]} />;
  }

  if (entry.type === "ArmyBookItem") {
    return (
      <>
        <Typography variant="body2">{entry.name}:</Typography>
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
  const multiplier = useAppStore(useShallow((state) => state.multiplier));
  const hasRules = entry.specialRules?.length > 0;
  return (
    <Typography>
      <Typography variant="caption">{entry.count || 1}x</Typography> {entry.name} (
      {entry.range > 0 && `${entry.range}", `}A{entry.attacks * multiplier}
      {hasRules && ", "}
      <RuleList specialRules={entry.specialRules} />)
    </Typography>
  );
}

function StatTile({ label, value, icon }: { label: string; value: string; icon: any }) {
  return (
    <div
      style={{
        padding: "0 8px",
        textAlign: "center",
        border: "1px solid grey",
        borderRadius: "4px",
        flex: 1,
      }}
    >
      <Stack direction="row" alignItems="center">
        <Icon path={icon} size={0.8} color="grey" />
        <Typography textAlign="left" sx={{ flex: 1 }}>
          {label}
        </Typography>
        <Typography fontSize={24} fontWeight="bold">
          {value}
        </Typography>
      </Stack>
      {/* <div style={{ textAlign: "center" }}>
        <p>{label}</p>
      </div>
      <div style={{ fontSize: "24px", fontWeight: "bold" }}>
        <p>{value}</p>
      </div> */}
    </div>
  );
}
