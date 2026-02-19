import React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { Colors } from '../theme';
import { HomeScreen } from '../screens/HomeScreen';
import { RulesScreen } from '../screens/RulesScreen';
import { ArmyBuilderScreen } from '../screens/ArmyBuilderScreen';
import { DetachmentPickerScreen } from '../screens/DetachmentPickerScreen';
import { DetachmentInfoScreen } from '../screens/DetachmentInfoScreen';
import { UnitPickerScreen } from '../screens/UnitPickerScreen';
import { UnitDetailScreen } from '../screens/UnitDetailScreen';
import { WargearPickerScreen } from '../screens/WargearPickerScreen';
import { ArmyExportScreen } from '../screens/ArmyExportScreen';
import { useArmyStore } from '../../store/armyStore';

import type { RootStackParamList, TabParamList } from '../types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

const HEADER_STYLE = {
  headerStyle: { backgroundColor: Colors.background },
  headerTintColor: Colors.orkGreen,
  headerTitleStyle: {
    color: Colors.textPrimary,
    fontWeight: '800' as const,
    letterSpacing: 1,
    textTransform: 'uppercase' as const,
  },
};

function ArmiesTabIcon({ focused }: { focused: boolean }) {
  return (
    <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.5 }}>⚔️</Text>
  );
}

function RulesTabIcon({ focused }: { focused: boolean }) {
  return (
    <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.5 }}>📖</Text>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: Colors.surface,
          borderTopColor: Colors.border,
          borderTopWidth: 1,
        },
        tabBarActiveTintColor: Colors.orkGreen,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarLabelStyle: {
          fontWeight: '700',
          fontSize: 10,
          letterSpacing: 0.5,
          textTransform: 'uppercase',
        },
        ...HEADER_STYLE,
      }}
    >
      <Tab.Screen
        name="Armies"
        component={HomeScreen}
        options={{
          title: 'WAAAGH!',
          tabBarLabel: 'ARMIES',
          tabBarIcon: ({ focused }) => <ArmiesTabIcon focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Rules"
        component={RulesScreen}
        options={{
          title: 'RULES',
          tabBarLabel: 'RULES',
          tabBarIcon: ({ focused }) => <RulesTabIcon focused={focused} />,
        }}
      />
    </Tab.Navigator>
  );
}

export function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          ...HEADER_STYLE,
          contentStyle: { backgroundColor: Colors.background },
        }}
      >
        <Stack.Screen
          name="MainTabs"
          component={MainTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ArmyBuilder"
          component={ArmyBuilderWithTitle}
          options={{ title: 'ARMY BUILDER' }}
        />
        <Stack.Screen
          name="DetachmentPicker"
          component={DetachmentPickerScreen}
          options={{
            title: 'PICK DETACHMENT',
            presentation: 'modal',
          }}
        />
        <Stack.Screen
          name="DetachmentInfo"
          component={DetachmentInfoScreen}
          options={{ title: 'DETACHMENT' }}
        />
        <Stack.Screen
          name="UnitPicker"
          component={UnitPickerScreen}
          options={{ title: 'ADD MORE BOYZ!' }}
        />
        <Stack.Screen
          name="UnitDetail"
          component={UnitDetailWithTitle}
          options={{ title: 'UNIT' }}
        />
        <Stack.Screen
          name="WargearPicker"
          component={WargearPickerScreen}
          options={{
            title: 'PICK WARGEAR',
            presentation: 'modal',
          }}
        />
        <Stack.Screen
          name="ArmyExport"
          component={ArmyExportScreen}
          options={{ title: 'EXPORT LIST' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Wrappers that set dynamic titles
import { useRoute, RouteProp } from '@react-navigation/native';

function ArmyBuilderWithTitle() {
  const route = useRoute<RouteProp<RootStackParamList, 'ArmyBuilder'>>();
  const army = useArmyStore((s) => s.armies.find((a) => a.id === route.params.armyId));

  React.useEffect(() => {}, [army?.name]);

  return <ArmyBuilderScreen />;
}

function UnitDetailWithTitle() {
  const route = useRoute<RouteProp<RootStackParamList, 'UnitDetail'>>();
  const army = useArmyStore((s) =>
    s.armies.find((a) => a.id === route.params.armyId)
  );
  const unit = army?.units.find((u) => u.instanceId === route.params.instanceId);

  return <UnitDetailScreen />;
}
