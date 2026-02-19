export interface WeaponProfile {
  id: string;
  name: string;
  type: 'Melee' | 'Ranged';
  range?: string;
  attacks: string;
  skill: string;
  strength: number;
  ap: number;
  damage: string;
  abilities?: string[];
}

export interface WargearOption {
  id: string;
  name: string;
  isGroup: boolean;
  replacementText: string;
  replacesWeaponIds: string[];
  choices: WeaponProfile[];
  modelScope: 'all' | 'one' | number;
}

export interface CompositionRule {
  minModels: number;
  maxModels: number;
  pointsPerUnit: number;
  pointsPerAdditionalModel?: number;
  additionalModelMin?: number;
}

export interface UnitStats {
  M: string;
  T: number;
  Sv: string;
  W: number;
  Ld: string;
  OC: number;
  invulSave?: string;
}

export interface UnitAbility {
  id: string;
  name: string;
  type: 'Core' | 'Faction' | 'Unit' | 'Leader';
  description: string;
}

export interface UnitDatasheet {
  id: string;
  name: string;
  faction: string;
  keywords: string[];
  unitComposition: CompositionRule;
  stats: UnitStats;
  baseWeapons: WeaponProfile[];
  wargearOptions: WargearOption[];
  abilities: UnitAbility[];
  isEpicHero: boolean;
  isLeader: boolean;
  leaderOf?: string[];
  fluff?: string;
}

export interface Enhancement {
  id: string;
  name: string;
  cost: number;
  description: string;
  keywords?: string[];
  exclusiveWith?: string[];
}

export interface Stratagem {
  id: string;
  name: string;
  cost: number;
  phase: string;
  type: 'Battle Tactic' | 'Strategic Ploy' | 'Wargear' | 'Epic Deed';
  when: string;
  target: string;
  effect: string;
  restrictions?: string;
}

export interface Detachment {
  id: string;
  name: string;
  description: string;
  detachmentRule: {
    name: string;
    description: string;
  };
  enhancements: Enhancement[];
  stratagems: Stratagem[];
}

export interface OrksData {
  faction: string;
  units: UnitDatasheet[];
  detachments: Detachment[];
}
