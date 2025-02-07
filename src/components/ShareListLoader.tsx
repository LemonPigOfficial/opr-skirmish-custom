import { GameSystems } from "@/services/GameSystems";
import { ArmyBook, ListApiResponse, SpecialRuleDefinition } from "@/services/interfaces";
import { useAppStore } from "@/services/store";
import { Stack, TextField, Typography, CircularProgress } from "@mui/material";
import axios from "axios";
import { uniq } from "lodash";
import { useEffect, useState } from "react";
import { useShallow } from "zustand/shallow";

//const tempUrl = "https://army-forge.onepagerules.com/share?id=tl69Ujmdz4LR&name=Heralds_of%20the%20Apocalypse";

// VU With caster
// https://army-forge.onepagerules.com/share?id=t9ZC3D3A-wwH&name=Vampiric_Undead

const tempUrl = "https://army-forge.onepagerules.com/share?id=wwcohMRXcpNS&name=Eternal_Dynasty";

export default function ShareListLoader() {
  const [shareUrl, setShareUrl] = useState(tempUrl);
  const [loading, setLoading] = useState(false);

  const store = useAppStore(useShallow((state) => state));

  useEffect(() => {
    setLoading(true);
    store.setArmyBooks([]);
    axios
      .get<ListApiResponse>(shareUrl.replace("/share", "/api/tts"))
      .then((res) => {
        console.log("List", res.data);

        const list = res.data;
        const armies = uniq(list.units.map((x) => x.armyId));
        const gsId = GameSystems[list.gameSystem as any];

        // Load army book data
        for (const army of armies) {
          axios
            .get<ArmyBook>(
              `https://army-forge.onepagerules.com/api/army-books/${army}?gameSystem=${gsId}`
            )
            .then((armyRes) => {
              console.log("Army", armyRes.data);
              store.setArmyBooks([...store.armyBooks, armyRes.data]);
            });
        }

        axios
          .get<{ rules: SpecialRuleDefinition[] }>(
            `https://army-forge.onepagerules.com/api/rules/common/${gsId}`
          )
          .then((rulesRes) => {
            console.log("Rules", rulesRes.data);
            store.setRules(rulesRes.data.rules);
          });

        store.setListResponse(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [shareUrl]);

  return (
    <Stack direction="row" alignItems="center" mb={2}>
      <Stack sx={{ flex: 1 }}>
        <TextField
          value={shareUrl}
          label="Share URL"
          onChange={(evt) => setShareUrl(evt.target.value)}
          fullWidth
        />
        <Typography variant="caption">Enter the Share URL from Army Forge</Typography>
      </Stack>
      {loading && <CircularProgress sx={{ ml: 2 }} />}
    </Stack>
  );
}
