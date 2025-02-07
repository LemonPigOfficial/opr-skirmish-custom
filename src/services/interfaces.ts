export interface ListApiResponse {
  gameSystem: string;
  units: Unit[];
  specialRules: SpecialRuleDefinition[];
}

export type Unit = {
  armyId: string;
  name: string;
  customName: string;
  id: string;
  selectionId: string;
  joinToUnit: string | null;
  combined: boolean;
  defense: number;
  quality: number;
  size: number;
  loadout: LoadoutEntry[];
  rules: SpecialRule[];
};

export type LoadoutEntry = {
  type: "ArmyBookWeapon" | "ArmyBookItem" | "ArmyBookRule";
  count: number;
  label: string;
  name: string;
  specialRules: SpecialRule[];
  range: number;
  attacks: number;
  content: LoadoutEntry[];
}

export type ArmyBook = {

};

export type SpecialRule = {
  name: string;
  rating?: any;
}

export type SpecialRuleDefinition = {
  id: string;
  name: string;
  description: string;
};

export type ArmyList = {
  units: Unit[];
};