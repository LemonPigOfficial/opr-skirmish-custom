import { load } from "@/services/LoadService";
import { useAppStore } from "@/services/store";
import { Stack, TextField, Typography, CircularProgress, Button, Box } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useShallow } from "zustand/shallow";

//const tempUrl = "https://army-forge.onepagerules.com/share?id=tl69Ujmdz4LR&name=Heralds_of%20the%20Apocalypse";

// VU With caster
// https://army-forge.onepagerules.com/share?id=t9ZC3D3A-wwH&name=Vampiric_Undead

const tempUrl = "https://army-forge.onepagerules.com/share?id=wwcohMRXcpNS&name=Eternal_Dynasty";

export default function ShareListLoader() {
  const router = useRouter();
  const [shareUrl, setShareUrl] = useState(""); //tempUrl);

  const store = useAppStore(useShallow((state) => state));

  useEffect(() => {}, [shareUrl]);

  const start = () => {
    const url = new URL(shareUrl);
    const listId = url.searchParams.get("id");
    router.push("/list?id=" + listId);
  };

  return (
    <>
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
        {store.loading && <CircularProgress sx={{ ml: 2 }} />}
      </Stack>
      <Box textAlign="center">
        <Button variant="contained" onClick={start}>
          Start!
        </Button>
      </Box>
    </>
  );
}
