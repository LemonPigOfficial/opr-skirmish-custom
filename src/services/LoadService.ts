import axios from "axios";
import { uniq } from "lodash";
import { GameSystems } from "./GameSystems";
import { ListApiResponse, ArmyBook, SpecialRuleDefinition } from "./interfaces";
import { Store } from "./store";

export function load(store: Store, listId: string) {
  store.setArmyBooks([]);
  store.setLoading(true);
  axios
    .get<ListApiResponse>(`https://army-forge.onepagerules.com/api/tts?id=${listId}`)
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
      store.setLoading(false);
    })
    .catch((err) => {
      console.error(err);
    });
}