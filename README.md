# NytLyf

**NytLyf** is a comprehensive, full-stack event management and booking platform. It provides a mobile application for users to explore events, book tickets, and manage their profiles, powered by a robust backend API.

![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Expo](https://img.shields.io/badge/Expo-1B1F23?style=for-the-badge&logo=expo&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white)

## 🏗️ Architecture

The project is divided into two main components:

### Frontend (`my-app/`)
- **Framework**: React Native with Expo (v54)
- **Language**: TypeScript
- **Navigation**: Expo Router (File-based routing)
- **State/API**: Custom fetch wrapper with AsyncStorage for JWT persistence
- **UI**: Custom themed components, `@expo/vector-icons`, and `react-native-reanimated` for smooth animations

### Backend (`backend/`)
- **Framework**: Spring Boot 3.3.3 (Java 21)
- **Database**: MySQL with Spring Data JPA
- **Security**: JWT-based stateless authentication (Spring Security)
- **Utilities**: ZXing for QR code generation (ticket validation), SpringDoc for OpenAPI documentation
- **Build Tool**: Maven

## ✨ Features

- **User Authentication**: Secure registration and login using JWT.
- **Event Discovery**: Browse events by category, search functionality, and view detailed event information.
- **Ticket Booking**: Seamless booking flow with generated QR codes for easy check-in.
- **Review System**: Users can rate and review events they've attended.
- **User Dashboard**: Manage saved events, past bookings, and profile settings.
- **Role-Based Access**: Support for regular users, organizers, and admins (e.g., event creation).

## 📂 Project Structure

```text
NytLyf/
├── backend/            # Spring Boot REST API
│   ├── src/            # Java source code and resources
│   ├── pom.xml         # Maven dependencies
│   ├── schema.sql      # Database schema definitions
│   └── seed_events.sql # Initial database seed data
│
└── my-app/             # Expo React Native App
    ├── app/            # Expo Router screens (Tabs, Auth, Event details)
    ├── src/            # Frontend source (API client, Components, Constants)
    ├── assets/         # Static assets (Images, Fonts)
    └── package.json    # Node dependencies
```

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS recommended)
- [Java Development Kit (JDK)](https://adoptium.net/) 21
- [Maven](https://maven.apache.org/)
- [MySQL Server](https://dev.mysql.com/downloads/mysql/)
- [Expo Go](https://expo.dev/client) app on your mobile device (or iOS Simulator / Android Emulator)

### 1. Backend Setup

1. **Database Configuration**:
   Create a MySQL database named `nytlyf`.
   ```sql
   CREATE DATABASE nytlyf;
   ```

2. **Update Credentials**:
   If necessary, update your database credentials in `backend/src/main/resources/application.properties` (or `.yml`).

3. **Initialize Database** (Optional):
   Run `backend/schema.sql` and `backend/seed_events.sql` against your local MySQL instance to set up tables and sample data.

4. **Run the Server**:
   ```bash
   cd backend
   mvn spring-boot:run
   ```
   The backend will start on `http://localhost:8080`.

### 2. Frontend Setup

1. **Install Dependencies**:
   ```bash
   cd my-app
   npm install
   ```

2. **Start Expo Development Server**:
   ```bash
   npx expo start
   ```

3. **Run the App**:
   - Scan the QR code shown in the terminal with the **Expo Go** app (Android) or the native Camera app (iOS).
   - Press `a` to open in an Android Emulator.
   - Press `i` to open in an iOS Simulator.

## 📖 API Documentation

Once the backend is running, you can access the interactive API documentation and test endpoints directly:

- **Swagger UI**: [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)
- **OpenAPI JSON**: [http://localhost:8080/api-docs](http://localhost:8080/api-docs)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
