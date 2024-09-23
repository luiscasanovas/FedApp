# FeedMeApp

FeedMeApp is a personalized baby tracker app designed to help parents log and monitor key details of their newborn's feeding and daily activities. Built with love and the desire to solve real-world problems, the app was developed as a personal project by a new father navigating the joys and challenges of parenthood.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Installation](#installation)
- [Usage](#usage)
- [Project Motivation](#project-motivation)
- [Future Enhancements](#future-enhancements)
- [Contributing](#contributing)
- [License](#license)

## Introduction

FeedMeApp is a React-based mobile-friendly application designed to help parents track their newborn's feeding schedules, diaper changes, and general daily activities. It provides a convenient interface for logging data, making parenthood just a little bit easier in the first few months. It also supports multi-device synchronization using Firebase, allowing both parents to stay updated.

## Features

- **Authentication:** Secure login and registration for multiple users (parents).
- **Baby Profile:** Each user can create a profile for their baby, storing relevant information like name and date of birth.
- **Daily Logs:** Parents can track daily activities including:
  - Start and end times for feeding
  - Breastfeeding details (left/right breast)
  - Formula quantities
  - Diaper changes (pee/poop/both)
  - Additional comments
- **Calendar View:** Easily navigate through daily logs using an intuitive calendar view.
- **Data Synchronization:** Real-time updates between devices using Firebase Firestore.

## Technology Stack

- **Frontend:** ReactJS (React Calendar, React Router)
- **Backend:** Firebase Firestore for real-time database and authentication
- **Hosting:** Firebase Hosting
- **CSS:** Custom CSS and React Calendar styles

## Setup and Installation

   ```bash
   git clone https://github.com/yourusername/FeedMeApp.git
   cd FeedMeApp
   npm install
   npm start
   