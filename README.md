# FeedMeApp

FeedMeApp is a personalized baby tracker app designed to help parents log and monitor key details of their newborn's feeding and daily activities. Built with love and the desire to solve real-world problems, the app was developed as a personal project by a new father navigating the joys and challenges of parenthood.

## Table of Contents

- [Introduction](#introduction)
- [Project Motivation](#project-motivation)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Installation](#installation)
- [Usage](#usage)

## Introduction

FeedMeApp is a React-based mobile-friendly application designed to help parents track their newborn's feeding schedules, diaper changes, and general daily activities. It provides a convenient interface for logging data, making parenthood just a little bit easier in the first few months. It also supports multi-device synchronization using Firebase, allowing both parents to stay updated.

## Project Motivation

FeedMeApp was created with a personal motivation in mind. As a new father, I wanted an app that not only helped me track my child's daily feeding schedules and diaper changes but also brought me and my partner on the same page with real-time updates. This project is the result of my journey into parenthood, where simplicity and ease of use became crucial in managing daily routines amidst the whirlwind of life with a newborn.

This app reflects my dedication to both learning web development and ensuring that the solution I built is practical and easy to use for other new parents.

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
```

## Usage
Sign Up: Register as a new user by providing your email and password.
Log Data: After logging in, create a baby profile and start logging daily activities.
Calendar Navigation: Use the calendar view to navigate between dates and see daily logs.
Add Entries: Click "Add Entry" to log feeding times, quantities, and diaper changes for your baby.

