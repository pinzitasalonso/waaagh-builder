import type { ArmyUnit, ArmyList } from '../types/army';
import type { UnitDatasheet } from '../types/data';

export function calculateUnitPoints(unit: ArmyUnit, datasheet: UnitDatasheet): number {
  const comp = datasheet.unitComposition;
  let points = comp.pointsPerUnit;

  if (
    comp.pointsPerAdditionalModel !== undefined &&
    comp.additionalModelMin !== undefined
  ) {
    const extraModels = Math.max(0, unit.modelCount - comp.additionalModelMin);
    points += extraModels * comp.pointsPerAdditionalModel;
  }

  return points;
}

export function calculateArmyPoints(army: ArmyList): number {
  return army.units.reduce((total, unit) => total + unit.computedPoints, 0);
}
