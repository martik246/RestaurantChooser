# RestaurantChooser

RestaurantChooser is a React Native mobile application built with Expo. The app helps a group choose a restaurant by selecting participants, applying optional filters, randomly choosing a restaurant, and allowing each participant one veto.

## Repository

GitHub repository:

`https://github.com/martik246/RestaurantChooser`

## Tech Stack

- Expo
- React Native
- React Navigation
- AsyncStorage
- Expo Checkbox

## How to Run the Project Locally

1. Install dependencies:

```bash
npm install
```

2. Start the Expo development server:

```bash
npx expo start
```

3. Open the app in one of the following ways:

- press `a` for Android emulator
- press `i` for iOS simulator on macOS
- press `w` for web
- scan the QR code with Expo Go

## Main Features

- Add and delete people
- Add and delete restaurants
- Validate form input before saving
- Select participants for the decision process
- Apply pre-filters by cuisine, price, rating, and delivery
- Randomly choose a restaurant
- Accept the result or veto it
- Show the final restaurant details screen

## EAS Build / Expo Publishing

This project includes `eas.json` and is prepared for EAS Build.

Official Expo references used for setup:

- https://docs.expo.dev/build/setup/
- https://docs.expo.dev/build/eas-json/

### Required commands

1. Log in to Expo:

```bash
npx eas-cli@latest login
```

2. Configure the project for EAS Build:

```bash
npx eas-cli@latest build:configure
```

3. Create a preview Android build:

```bash
npx eas-cli@latest build --platform android --profile preview
```

4. Create a production Android build:

```bash
npx eas-cli@latest build --platform android --profile production
```

5. Optional: list builds and copy the finished build link:

```bash
npx eas-cli@latest build:list
```

## Build Artifact

Finished Expo build link:

`https://expo.dev/accounts/martik/projects/RestaurantChooser/builds/80f3c74c-5b4d-4c9a-9ab3-5a420e4b842f`

