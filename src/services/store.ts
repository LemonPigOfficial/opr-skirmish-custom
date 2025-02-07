import { create } from "zustand";
import { ListApiResponse, ArmyBook, SpecialRuleDefinition, ArmyList } from "./interfaces";
import { devtools } from 'zustand/middleware'

export interface Store {
  listResponse: ListApiResponse | null;
  setListResponse: (res: ListApiResponse) => void;
  armyBooks: ArmyBook[];
  setArmyBooks: (armyBooks: ArmyBook[]) => void;
  rules: SpecialRuleDefinition[];
  setRules: (rules: SpecialRuleDefinition[]) => void;
  multiplier: number;
  setMultiplier: (value: number) => void;
}

export function createStore() {
  return create(devtools<Store>((set) => ({
    listResponse: null,
    setListResponse: (res: ListApiResponse) => set(() => ({ listResponse: res }), undefined, "setListResponse"),
    armyBooks: [],
    setArmyBooks: (armyBooks: ArmyBook[]) => set(() => ({ armyBooks }), undefined, "setArmyBooks"),
    rules: [],
    setRules: (rules: SpecialRuleDefinition[]) => set(() => ({ rules }), undefined, "setRules"),
    multiplier: 3,
    setMultiplier: (value: number) => set(() => ({ multiplier: value }), undefined, "setMultiplier"),
  })));
}

export const useAppStore = createStore();
