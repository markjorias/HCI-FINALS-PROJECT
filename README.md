# Fullshot — Halfshot Website Redesign

> **CS 3215 – Human Computer Interaction | 25-2 Final Project (UX/UI Design)**

A full-stack web application representing the complete UX/UI redesign of the **Halfshot** coffee shop website. This project was developed as the final deliverable for CS 3215 – Human Computer Interaction, focusing on applying user-centered design principles to create a modern, intuitive, and visually engaging digital ordering experience. The redesign improves upon the original Halfshot website by addressing usability gaps, enhancing visual hierarchy, streamlining the customer journey from menu discovery to order completion, and introducing a responsive layout that works seamlessly across all devices.

Built with **Node.js**, **Express**, and **SQLite3**.

---

## Table of Contents

1. [Live Deployment](#live-deployment)
2. [Project Overview](#project-overview)
3. [Features](#features)
4. [Tech Stack](#tech-stack)
5. [Local Setup and Installation](#local-setup-and-installation)
   - [Prerequisites](#prerequisites)
   - [Installation](#installation)
   - [Running the Application](#running-the-application)
6. [Test Accounts](#test-accounts)
7. [Team Members](#team-members)

---

## Live Deployment

The application is deployed and publicly accessible at:

🔗 [http://fullshot.eastasia.cloudapp.azure.com/](http://fullshot.eastasia.cloudapp.azure.com/)

---

## Project Overview

This project is a **redesign of the Halfshot coffee shop website**, created as part of the CS 3215 – Human Computer Interaction course (Academic Year 25-2). The primary goal was to apply HCI principles and UX/UI best practices to reimagine the digital presence of Halfshot — a local coffee shop brand.

The redesign emphasizes:
- **Usability** — Simplified navigation and intuitive user flows for browsing and ordering.
- **Aesthetics** — A clean, modern visual identity consistent with Halfshot's branding.
- **Accessibility** — Thoughtful layout and contrast choices to improve readability and inclusivity.
- **Responsiveness** — A mobile-friendly design that adapts gracefully across screen sizes.

---

## Features

- User Registration and Login
- Menu Browsing with Category Filtering
- Shopping Cart Functionality
- Order Placement and Order History Tracking
- User Dashboard
- Admin Dashboard with Full Access Controls

---

## Tech Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| Frontend   | HTML, CSS, JavaScript (Vanilla)   |
| Backend    | Node.js, Express                  |
| Database   | SQLite3                           |

---

## Local Setup and Installation

Follow these steps to get the project running on your local machine.

### Prerequisites

This project requires **Node.js (v14 or higher)**. Install it for your operating system:

**Windows:**
1. Download the Windows Installer (`.msi`) from the [official Node.js website](https://nodejs.org/).
2. Run the installer and follow the prompts (LTS version recommended).
3. Restart your terminal or command prompt.

**macOS:**
1. Download the macOS Installer (`.pkg`) from the [official Node.js website](https://nodejs.org/).
2. Run the installer and follow the prompts.
3. Alternatively, with [Homebrew](https://brew.sh/) installed, run:
   ```bash
   brew install node
   ```

**Linux (Ubuntu/Debian):**
1. Update your package index:
   ```bash
   sudo apt update
   ```
2. Install Node.js and npm:
   ```bash
   sudo apt install nodejs npm
   ```

**Verify Installation:**
```bash
node -v
npm -v
```

---

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/markjorias/HCI-FINALS-PROJECT.git
   cd Fullshot\(html\)
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Initialize the database:**
   This project uses SQLite. Run the initialization script to set up the tables and seed initial data:
   ```bash
   node db/init_db.js
   ```

---

### Running the Application

1. **Start the development server:**
   ```bash
   npm start
   ```

2. **Open in your browser:**
   Navigate to `http://localhost:3000`

---

## Test Accounts

Use the following credentials to explore and test the application's features:

### Admin Account
> Full access to the Admin Dashboard and management controls.

| Field    | Value                |
|----------|----------------------|
| Email    | admin@halfshot.com   |
| Password | adminpassword123     |
| Role     | Admin                |

### Standard User Account
> Regular customer access for browsing, cart, and ordering.

| Field    | Value              |
|----------|--------------------|
| Email    | test@example.com   |
| Password | testpassword123    |
| Role     | User               |

---

## Team Members

This project was developed by:

| Name                      |
|---------------------------|
| AGNOTE, Rovilyn A.        |
| ATIENZA, Lawrence         |
| LAVAPIE, Ven John Rey C.  |
| ORIAS, Mark Joseph C.     |

---

*CS 3215 – Human Computer Interaction | Academic Year 25-2 | Halfshot Website Redesign*
