# 🍽️ FlavorGen — Générateur Intelligent de Recettes

## Présentation du projet

**FlavorGen** est une application intelligente de découverte et de génération de recettes, conçue pour aider les utilisateurs à trouver des idées de repas personnalisées à partir des ingrédients dont ils disposent.

En combinant la recherche basée sur les ingrédients et des fonctionnalités faisant appel à l'intelligence artificielle, la plateforme facilite la préparation des repas et permet aux utilisateurs de découvrir de nouvelles recettes adaptées à leurs préférences.

FlavorGen propose également des fonctionnalités de gestion des recettes favorites, de suivi nutritionnel et de planification des repas grâce à un calendrier interactif.

## ✨ Fonctionnalités principales

- **Authentification des utilisateurs :** système sécurisé d'inscription et de connexion.
- **Génération de recettes à partir des ingrédients :** découverte de recettes selon les ingrédients disponibles.
- **Assistance basée sur l'intelligence artificielle :** intégration de services externes d'IA pour enrichir l'expérience de découverte des recettes.
- **Reconnaissance des ingrédients :** identification des ingrédients à partir d'images.
- **Détails des recettes :** consultation des ingrédients nécessaires et des étapes de préparation.
- **Personnalisation :** découverte de recettes adaptées aux préférences des utilisateurs.
- **Gestion des favoris :** possibilité d'enregistrer et de retrouver ses recettes préférées.
- **Suivi nutritionnel :** consultation des informations nutritionnelles des recettes.
- **Planification des repas :** organisation des repas à travers un calendrier interactif.
- **Interface moderne et responsive :** expérience utilisateur intuitive et adaptée aux différents appareils.

## 🛠️ Technologies utilisées

| Catégorie | Technologies |
|---|---|
| Backend | Laravel 11, PHP |
| Frontend | React, JavaScript |
| Base de données | MySQL |
| Authentification | Laravel Sanctum |
| Outil de build | Vite |
| API externes | Spoonacular API, Clarifai API |

## 🏗️ Architecture du projet

FlavorGen repose sur une architecture client-serveur composée de plusieurs éléments :

- **Frontend :** application React responsable de l'interface utilisateur et des interactions.
- **Backend :** API REST développée avec Laravel, chargée de la logique métier, de l'authentification et de la communication avec les services externes.
- **Base de données :** MySQL pour le stockage des données de l'application.
- **Services externes :** API dédiées aux recettes et à l'intelligence artificielle afin d'enrichir les fonctionnalités de la plateforme.

## ⚙️ Installation et configuration

### Prérequis

Avant de commencer, assurez-vous d'avoir installé :

- PHP 8.2 ou supérieur
- Composer
- Node.js et npm
- MySQL
- Git

### 1. Cloner le repository

```bash
git clone https://github.com/siham-alt/FlavorGen.git
cd FlavorGen
```

### 2. Configurer le backend Laravel

Installer les dépendances PHP :

```bash
composer install
```

Créer le fichier d'environnement :

```bash
cp .env.example .env
```

Sous Windows PowerShell, vous pouvez utiliser :

```powershell
Copy-Item .env.example .env
```

Générer la clé de l'application :

```bash
php artisan key:generate
```

Configurer les informations de connexion à la base de données ainsi que les clés des API externes dans le fichier `.env`.

Exécuter les migrations :

```bash
php artisan migrate
```

Démarrer le serveur Laravel :

```bash
php artisan serve
```

### 3. Configurer le frontend React

Accéder au dossier du frontend :

```bash
cd pfefr
```

Installer les dépendances :

```bash
npm install
```

Démarrer le serveur de développement :

```bash
npm run dev
```

## 🔐 Variables d'environnement

Avant de lancer l'application, configurez les variables d'environnement nécessaires dans le fichier `.env` du backend.

Elles comprennent notamment :

- Les paramètres de connexion à la base de données.
- La clé API Spoonacular.
- Les identifiants API Clarifai, si cette intégration est activée.

**Important :** ne publiez jamais votre fichier `.env` ni vos clés API privées sur GitHub.

## 🎯 Objectifs du projet

- Développer une plateforme intelligente de découverte et de génération de recettes.
- Exploiter les ingrédients disponibles pour proposer des idées de repas.
- Intégrer des API externes et des services d'intelligence artificielle.
- Développer une application Full Stack avec Laravel et React.
- Concevoir une interface moderne, intuitive et responsive.
- Mettre en place un système d'authentification sécurisé.
- Faciliter la gestion des recettes favorites et la planification des repas.

## 👩‍💻 Développeuse

**Siham El Mouden**

Étudiante en ingénierie logicielle et intégration des systèmes d'information — FST Mohammedia.

- **GitHub :** [siham-alt](https://github.com/siham-alt)
- **LinkedIn :** [Siham El Mouden](https://www.linkedin.com/in/siham-el-mouden-793874337)

---

*FlavorGen — Transformez vos ingrédients en inspiration !* 🍅
