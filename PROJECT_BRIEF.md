# WAAAGH! Builder - Ork Army List Creator

## Project Overview
Build an iOS app for creating Warhammer 40k 10th Edition Ork army lists using React Native and Expo.

## Core Requirements

### 1. Data Sources
- **Primary Reference**: https://github.com/BSData/wh40k-10e (BSData format)
- **Rules Reference**: Wahapedia for Orks (https://wahapedia.ru/wh40k10ed/factions/orks/)
- **Initial Scope**: Orks army only, but architecture should support future factions

### 2. Army Building Rules (10th Edition)
- **Detachments**: Support all Ork detachments (War Horde, Da Big Hunt, Kult of Speed, Dread Mob, Green Tide, Bully Boyz, etc.)
- **Waaagh! Ability**: Display faction-wide ability
- **Points System**: Track points from Munitorum Field Manual
- **Unit Composition**: Enforce min/max unit sizes, wargear options
- **Enhancements**: Support detachment-specific enhancements (max 3 per army, 1 per CHARACTER)
- **Stratagems**: Display detachment stratagems

### 3. Key Features
- Create/edit/delete army lists
- Select detachment and view its rules
- Add units with proper validation
- Configure wargear and options per unit
- Real-time points calculation
- Army composition validation (e.g., 1 Warboss per army, Character limits)
- Export army list (text/PDF format)
- Save lists locally (AsyncStorage or similar)

### 4. UI/UX Requirements
- **Theme**: Orky aesthetic - greens, blacks, industrial/ramshackle look
- **Typography**: Bold, rough fonts (think Ork glyphs if possible)
- **Icons**: Custom Ork-themed icons (gears, bolts, teef)
- **Colors**: 
  - Primary: Ork green (#6B8E23, #4A7023)
  - Secondary: Red (speed), Yellow (danger stripes)
  - Metal/rust accents
- **Feel**: Brutal, loud, chaotic but functional

### 5. Technical Stack
- **Framework**: React Native + Expo (managed workflow)
- **State Management**: Context API or Zustand (lightweight)
- **Storage**: AsyncStorage for local data persistence
- **Data Format**: Parse BSData XML or JSON (converted from BSData repo)
- **Navigation**: React Navigation (stack + tabs)

### 6. Architecture
```
/src
  /components
    - UnitCard.tsx
    - DetachmentSelector.tsx
    - PointsTracker.tsx
    - WargearPicker.tsx
  /screens
    - HomeScreen.tsx (list of armies)
    - ArmyBuilderScreen.tsx (main builder)
    - DetachmentScreen.tsx (detachment selection)
    - UnitPickerScreen.tsx (add units)
  /data
    - orks.json (parsed from BSData)
    - detachments.json
    - stratagems.json
  /utils
    - validation.ts (army composition rules)
    - points.ts (calculate points)
  /types
    - army.ts (TypeScript interfaces)
  /theme
    - colors.ts
    - typography.ts
```

### 7. Data Structure Example
```typescript
interface Army {
  id: string;
  name: string;
  faction: 'orks';
  detachment: DetachmentType;
  points: number;
  units: Unit[];
  enhancements: Enhancement[];
}

interface Unit {
  id: string;
  datasheetId: string;
  name: string;
  modelCount: number;
  wargear: WargearOption[];
  points: number;
}
```

### 8. Priorities
1. **Phase 1**: Basic app structure, detachment selection, unit browsing
2. **Phase 2**: Unit selection, wargear configuration, points calculation
3. **Phase 3**: Army validation, save/load functionality
4. **Phase 4**: Export lists, polish UI

### 9. Questions to Resolve
- Should we fetch BSData dynamically or bundle it with the app?
- How detailed should wargear options be (every weapon variant)?
- Do we need offline-first support?
- Export format preferences (plain text, Battle Scribe format, PDF)?

## Getting Started
1. Initialize Expo app: `npx create-expo-app waaagh-builder --template blank-typescript`
2. Install dependencies: React Navigation, AsyncStorage, etc.
3. Parse BSData Ork roster from GitHub
4. Build UI mockups based on Orky theme
5. Implement core army building logic

## Notes
- Focus on usability - army building should be quick and intuitive
- Ork flavor throughout (e.g., "Add More Boyz!", "Moar Dakka!" buttons)
- Consider future expansion to other factions (abstract faction-specific logic)
