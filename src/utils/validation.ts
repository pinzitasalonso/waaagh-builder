import type { ArmyList, ValidationResult } from '../types/army';
import { getUnitById, getDetachmentById } from './dataLoader';
import { calculateArmyPoints } from './points';

export function validateArmy(army: ArmyList): ValidationResult[] {
  const results: ValidationResult[] = [];
  const totalPoints = calculateArmyPoints(army);

  // Error: No detachment selected
  if (!army.detachmentId) {
    results.push({
      severity: 'error',
      message: 'No detachment selected — pick a Detachment before battling!',
    });
  }

  // Error: Total points over limit
  if (totalPoints > army.pointsLimit) {
    results.push({
      severity: 'error',
      message: `Army is ${totalPoints - army.pointsLimit}pts over the ${army.pointsLimit}pt limit.`,
    });
  }

  // Enhancement validation
  const enhancements = army.units.filter((u) => u.enhancementId);
  if (enhancements.length > 3) {
    results.push({
      severity: 'error',
      message: `Too many enhancements (${enhancements.length}). Maximum 3 allowed per army.`,
    });
  }

  // Enhancement on non-CHARACTER
  enhancements.forEach((unit) => {
    const datasheet = getUnitById(unit.datasheetId);
    if (datasheet && !datasheet.keywords.includes('CHARACTER')) {
      results.push({
        severity: 'error',
        message: `${datasheet.name} has an enhancement but is not a CHARACTER.`,
        unitInstanceId: unit.instanceId,
      });
    }
  });

  // Enhancement exists in detachment
  if (army.detachmentId) {
    const detachment = getDetachmentById(army.detachmentId);
    enhancements.forEach((unit) => {
      const validIds = detachment?.enhancements.map((e) => e.id) ?? [];
      if (unit.enhancementId && !validIds.includes(unit.enhancementId)) {
        results.push({
          severity: 'error',
          message: `Enhancement on a unit is not valid for the selected detachment.`,
          unitInstanceId: unit.instanceId,
        });
      }
    });
  }

  // Error: Epic Hero duplicated
  const epicHeroCounts: Record<string, number> = {};
  army.units.forEach((unit) => {
    const datasheet = getUnitById(unit.datasheetId);
    if (datasheet?.isEpicHero) {
      epicHeroCounts[unit.datasheetId] = (epicHeroCounts[unit.datasheetId] ?? 0) + 1;
    }
  });
  Object.entries(epicHeroCounts).forEach(([id, count]) => {
    if (count > 1) {
      const datasheet = getUnitById(id);
      results.push({
        severity: 'error',
        message: `${datasheet?.name ?? id} is an EPIC HERO and can only appear once.`,
      });
    }
  });

  // Error: Unit model count out of range
  army.units.forEach((unit) => {
    const datasheet = getUnitById(unit.datasheetId);
    if (!datasheet) return;
    const comp = datasheet.unitComposition;
    if (unit.modelCount < comp.minModels || unit.modelCount > comp.maxModels) {
      results.push({
        severity: 'error',
        message: `${datasheet.name} has ${unit.modelCount} models — must be ${comp.minModels}–${comp.maxModels}.`,
        unitInstanceId: unit.instanceId,
      });
    }
  });

  // Warning: No Battleline units (if army has 5+ units)
  if (army.units.length >= 3) {
    const hasBattleline = army.units.some((unit) => {
      const datasheet = getUnitById(unit.datasheetId);
      return datasheet?.keywords.includes('BATTLELINE');
    });
    if (!hasBattleline) {
      results.push({
        severity: 'warning',
        message: 'No BATTLELINE units in the army. Consider adding Boyz for objective control.',
      });
    }
  }

  // Info: Points within 5% of limit
  if (totalPoints > 0 && totalPoints <= army.pointsLimit) {
    const pct = totalPoints / army.pointsLimit;
    if (pct >= 0.95) {
      results.push({
        severity: 'info',
        message: `Army is at ${Math.round(pct * 100)}% of the points limit — nicely efficient!`,
      });
    }
  }

  return results;
}
