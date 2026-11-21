# 🍽️ FlavorGen — AI-Powered Recipe Generator

**FlavorGen** is an intelligent recipe application designed to help users discover personalized recipes based on the ingredients they already have. By combining ingredient-based search and AI-powered features, the platform makes meal planning easier and helps users find inspiration for their next meal.

## ✨ Features

- **User Authentication:** Secure registration and login system.
- **Ingredient-Based Recipe Generation:** Discover recipes based on available ingredients.
- **AI-Powered Assistance:** Integration with external AI services to enhance the recipe discovery experience.
- **Recipe Details:** Explore recipes with their ingredients and preparation instructions.
- **Personalized Experience:** Access a recipe experience tailored to the user's needs.
- **Modern Interface:** Responsive and user-friendly interface built with React.

## 🛠️ Technologies

| Category | Technologies |
|---|---|
| Backend | Laravel 11, PHP |
| Frontend | React, JavaScript |
| Database | MySQL |
| Authentication | Laravel Sanctum |
| Build Tool | Vite |
| External APIs | Spoonacular API, Clarifai API |

## 🏗️ Project Architecture

FlavorGen follows a client-server architecture:

- **Frontend:** React application responsible for the user interface and interactions.
- **Backend:** Laravel REST API responsible for business logic, authentication, and communication with external services.
- **Database:** MySQL for storing application data.
- **External Services:** Recipe and AI-related APIs to provide additional functionality.

## ⚙️ Installation and Setup

### Prerequisites

Make sure you have installed:

- PHP 8.2 or higher
- Composer
- Node.js and npm
- MySQL
- Git

### 1. Clone the repository

```bash
git clone https://github.com/siham-alt/FlavorGen.git
cd FlavorGen
```

### 2. Configure the Laravel backend

Install PHP dependencies:

```bash
composer install
```

Create the environment file:

```bash
cp .env.example .env
```

Generate the application key:

```bash
php artisan key:generate
```

Configure your database credentials and external API keys in the `.env` file.

Run database migrations:

```bash
php artisan migrate
```

Start the Laravel development server:

```bash
php artisan serve
```

### 3. Configure the React frontend

Navigate to the frontend directory:

```bash
cd pfefr
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

## 🔐 Environment Variables

Before running the application, configure the required environment variables in the backend `.env` file.

These include:

- Database connection settings.
- Spoonacular API credentials.
- Clarifai API credentials, if enabled.

**Important:** Never commit your `.env` file or expose private API keys in the repository.

## 🎯 Project Objectives

- Develop an intelligent recipe discovery platform.
- Integrate external APIs into a full-stack application.
- Build a responsive and intuitive user interface.
- Implement secure user authentication.
- Practice REST API development and frontend-backend integration.

## 👩‍💻 Developer

**Siham El Mouden**

Software Engineering Student — FST Mohammedia

- **GitHub:** [siham-alt](https://github.com/siham-alt)
- **LinkedIn:** [Siham El Mouden](https://www.linkedin.com/in/siham-el-mouden-793874337)

---

*FlavorGen — Turn your ingredients into inspiration!* 🍅
