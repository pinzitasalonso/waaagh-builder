import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUnitById } from '../src/utils/dataLoader';
import { calculateUnitPoints } from '../src/utils/points';
import { generateId } from '../src/utils/generateId';
import type { ArmyList, ArmyUnit, SelectedWargear } from '../src/types/army';

interface ArmyStoreState {
  armies: ArmyList[];
  // Actions
  createArmy: (name: string, pointsLimit?: number) => string;
  deleteArmy: (id: string) => void;
  setDetachment: (armyId: string, detachmentId: string | null) => void;
  addUnit: (armyId: string, datasheetId: string) => void;
  removeUnit: (armyId: string, instanceId: string) => void;
  updateUnit: (
    armyId: string,
    instanceId: string,
    updates: Partial<Pick<ArmyUnit, 'modelCount' | 'wargear' | 'customName' | 'notes' | 'attachedToUnitId'>>
  ) => void;
  setUnitEnhancement: (armyId: string, instanceId: string, enhancementId: string | undefined) => void;
  // Selectors
  getArmy: (id: string) => ArmyList | undefined;
}

export const useArmyStore = create<ArmyStoreState>()(
  persist(
    (set, get) => ({
      armies: [],

      createArmy(name, pointsLimit = 2000) {
        const id = generateId();
        const now = Date.now();
        const army: ArmyList = {
          id,
          name,
          detachmentId: null,
          pointsLimit,
          units: [],
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({ armies: [...state.armies, army] }));
        return id;
      },

      deleteArmy(id) {
        set((state) => ({ armies: state.armies.filter((a) => a.id !== id) }));
      },

      setDetachment(armyId, detachmentId) {
        set((state) => ({
          armies: state.armies.map((army) =>
            army.id === armyId
              ? { ...army, detachmentId, updatedAt: Date.now() }
              : army
          ),
        }));
      },

      addUnit(armyId, datasheetId) {
        const datasheet = getUnitById(datasheetId);
        if (!datasheet) return;

        const modelCount = datasheet.unitComposition.minModels;
        const stub: ArmyUnit = {
          instanceId: '',
          datasheetId,
          modelCount,
          wargear: [],
          computedPoints: 0,
        };
        const computedPoints = calculateUnitPoints(stub, datasheet);

        const newUnit: ArmyUnit = {
          instanceId: generateId(),
          datasheetId,
          modelCount,
          wargear: [],
          computedPoints,
        };

        set((state) => ({
          armies: state.armies.map((army) =>
            army.id === armyId
              ? { ...army, units: [...army.units, newUnit], updatedAt: Date.now() }
              : army
          ),
        }));
      },

      removeUnit(armyId, instanceId) {
        set((state) => ({
          armies: state.armies.map((army) =>
            army.id === armyId
              ? {
                  ...army,
                  units: army.units.filter((u) => u.instanceId !== instanceId),
                  updatedAt: Date.now(),
                }
              : army
          ),
        }));
      },

      updateUnit(armyId, instanceId, updates) {
        set((state) => ({
          armies: state.armies.map((army) => {
            if (army.id !== armyId) return army;
            return {
              ...army,
              updatedAt: Date.now(),
              units: army.units.map((unit) => {
                if (unit.instanceId !== instanceId) return unit;
                const updated = { ...unit, ...updates };
                const datasheet = getUnitById(updated.datasheetId);
                if (datasheet) {
                  updated.computedPoints = calculateUnitPoints(updated, datasheet);
                }
                return updated;
              }),
            };
          }),
        }));
      },

      setUnitEnhancement(armyId, instanceId, enhancementId) {
        set((state) => ({
          armies: state.armies.map((army) =>
            army.id === armyId
              ? {
                  ...army,
                  updatedAt: Date.now(),
                  units: army.units.map((unit) =>
                    unit.instanceId === instanceId ? { ...unit, enhancementId } : unit
                  ),
                }
              : army
          ),
        }));
      },

      getArmy(id) {
        return get().armies.find((a) => a.id === id);
      },
    }),
    {
      name: 'waaagh-armies',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
