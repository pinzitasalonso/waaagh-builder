export interface SelectedWargear {
  optionId: string;
  selectedChoiceId: string;
}

export interface ArmyUnit {
  instanceId: string;
  datasheetId: string;
  customName?: string;
  modelCount: number;
  wargear: SelectedWargear[];
  enhancementId?: string;
  computedPoints: number;
  attachedToUnitId?: string;
  notes?: string;
}

export interface ArmyList {
  id: string;
  name: string;
  detachmentId: string | null;
  pointsLimit: number;
  units: ArmyUnit[];
  createdAt: number;
  updatedAt: number;
}

export type ValidationSeverity = 'error' | 'warning' | 'info';

export interface ValidationResult {
  severity: ValidationSeverity;
  message: string;
  unitInstanceId?: string;
}
