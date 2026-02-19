import orksDataJson from '../data/orks-data.json';
import type { OrksData, UnitDatasheet, Detachment } from '../types/data';

const data = orksDataJson as unknown as OrksData;

export function getAllUnits(): UnitDatasheet[] {
  return data.units;
}

export function getUnitById(id: string): UnitDatasheet | undefined {
  return data.units.find((u) => u.id === id);
}

export function getAllDetachments(): Detachment[] {
  return data.detachments;
}

export function getDetachmentById(id: string): Detachment | undefined {
  return data.detachments.find((d) => d.id === id);
}
