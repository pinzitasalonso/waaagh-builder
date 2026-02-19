import { NavigatorScreenParams } from '@react-navigation/native';

export type TabParamList = {
  Armies: undefined;
  Rules: undefined;
};

export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<TabParamList>;
  ArmyBuilder: { armyId: string };
  DetachmentPicker: { armyId: string };
  DetachmentInfo: { detachmentId: string };
  UnitPicker: { armyId: string };
  UnitDetail: { armyId: string; instanceId: string };
  WargearPicker: { armyId: string; instanceId: string; optionId: string };
  ArmyExport: { armyId: string };
};
