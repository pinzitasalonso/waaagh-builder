# WAAAGH! Builder 🦠⚔️

Warhammer 40k 10th Edition Ork Army List Creator for iOS

Built with React Native + Expo, designed with proper Orky brutality.

## Features

- 📋 Create and manage Ork army lists
- 🎯 3 Detachments: War Horde, Kult of Speed, Green Tide
- 🦠 4 Ork units: Warboss, Boyz, Deff Dread, Nobz
- ⚙️ Full wargear configuration (BSData-accurate)
- 💾 Persistent storage (AsyncStorage)
- ✅ Army composition validation
- 📤 Plain text export
- 🎨 Brutal Orky aesthetic (greens, blacks, industrial)

## Tech Stack

- **Framework**: React Native + Expo (managed workflow)
- **State**: Zustand with AsyncStorage persistence
- **Navigation**: React Navigation (stack + bottom tabs)
- **Data**: Static JSON bundled from BSData
- **Language**: TypeScript

## Getting Started

```bash
# Install dependencies
npm install

# Start Expo dev server
npx expo start

# Scan QR code with Expo Go app on iOS
# Or press 'i' to open iOS simulator
```

## Project Structure

```
src/
├── components/     # Reusable UI components
├── data/           # Ork game data (units, detachments, stratagems)
├── navigation/     # React Navigation setup
├── screens/        # App screens
├── theme/          # Colors, typography, spacing
├── types/          # TypeScript interfaces
└── utils/          # Helper functions

store/
└── armyStore.ts    # Zustand state management
```

## Data Source

Based on [BSData wh40k-10e](https://github.com/BSData/wh40k-10e) and [Wahapedia](https://wahapedia.ru/wh40k10ed/factions/orks/)

## Roadmap

- [ ] Add more Ork units
- [ ] Support other factions
- [ ] BattleScribe-compatible export
- [ ] Cloud sync
- [ ] Share army lists

## License

MIT

---

**WAAAGH!** 🦠
