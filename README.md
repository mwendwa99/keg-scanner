# KegTrack Pro - Mobile Driver App

A React Native mobile application built with Expo for keg delivery and collection management. This app enables delivery drivers to efficiently manage keg assignments, track deliveries, and collect empty kegs from various outlets.

## 🚀 Features

### Authentication
- **Driver Login**: Secure phone number and password authentication
- **Country Code Selection**: International phone number support with country picker
- **Session Management**: Automatic redirect to login on app start

### Dashboard
- **Real-time Statistics**: View total kegs, active outlets, daily deliveries, and pending pickups
- **Recent Activity Feed**: Track recent keg assignments, collections, and outlet additions
- **Quick Actions**: Fast access to QR scanning and route viewing
- **Personalized Greeting**: Date-aware welcome messages

### Keg Assignment
- **Outlet Selection**: Choose from available outlets via modal interface
- **QR Code Scanning**: Camera-based keg QR code scanning with real-time validation
- **Assignment Tracking**: Visual confirmation of scanned kegs with timestamps
- **Batch Processing**: Assign multiple kegs to a single outlet in one session

### Keg Collection
- **Collection Management**: Select outlets with kegs ready for pickup
- **Progress Tracking**: Visual progress bar showing collection completion
- **Validation System**: Ensures kegs belong to selected outlet and prevents duplicates
- **Batch Collection**: Collect multiple kegs with final confirmation step

### Driver Profile
- **Personal Information**: View contact details, vehicle assignment, and employee ID
- **Performance Statistics**: Track delivery and collection metrics
- **App Settings**: Access to notifications and preferences
- **Help & Support**: Contact information for technical assistance
- **Secure Logout**: Confirmation-based logout with session cleanup

## Technology Stack

### Core Framework
- **React Native**: 0.79.1
- **Expo**: ^53.0.0
- **TypeScript**: ~5.8.3
- **Expo Router**: ~5.0.2 (File-based routing)

### UI/UX Libraries
- **Lucide React Native**: ^0.475.0 (Modern icons)
- **React Native Country Picker**: ^2.0.0 (International phone support)
- **Expo Google Fonts**: ^0.4.1 (Inter font family)

### Device Features
- **Expo Camera**: ~16.1.5 (QR code scanning)
- **Expo Haptics**: ~14.1.3 (Tactile feedback)
- **React Native Gesture Handler**: ~2.24.0 (Touch interactions)
- **React Native Reanimated**: ~3.17.4 (Smooth animations)

### Development Tools
- **Expo CLI**: Development and build tooling
- **TypeScript**: Type safety and better development experience
- **Prettier**: Code formatting

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator or Android Emulator (for development)
