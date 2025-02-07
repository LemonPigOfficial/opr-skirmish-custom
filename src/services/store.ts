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
  attackMultiplier: number;
  setAttackMultiplier: (value: number) => void;
  toughMultiplier: number;
  setToughMultiplier: (value: number) => void;
  loading: boolean;
  setLoading: (value: boolean) => void;
}

export function createStore() {
  return create(devtools<Store>((set) => ({
    listResponse: null,
    setListResponse: (res: ListApiResponse) => set(() => ({ listResponse: res }), undefined, "setListResponse"),
    armyBooks: [],
    setArmyBooks: (armyBooks: ArmyBook[]) => set(() => ({ armyBooks }), undefined, "setArmyBooks"),
    rules: [],
    setRules: (rules: SpecialRuleDefinition[]) => set(() => ({ rules }), undefined, "setRules"),
    attackMultiplier: 3,
    setAttackMultiplier: (value: number) => set(() => ({ attackMultiplier: value }), undefined, "setMultiplier"),
    toughMultiplier: 3,
    setToughMultiplier: (value: number) => set(() => ({ toughMultiplier: value }), undefined, "setToughMultiplier"),
    loading: false,
    setLoading: (value: boolean) => set(() => ({ loading: value }), undefined, "setLoading"),
  })));
}

export const useAppStore = createStore();
