# Project Name

## Overview

A modern web application built with Next.js, React, and Tailwind CSS, leveraging various powerful libraries for enhanced functionality. This project is designed to be scalable, performant, and visually appealing, featuring animations, OAuth authentication, and AI-powered capabilities.

## Features

- **AI-Powered Code Generation**: The AI generates complete code for you, eliminating manual coding efforts.
- **Real-Time Code Execution**: Instantly see your generated code running without delays.
- **Built-In Deployment**: Deploy your project with a single click directly from the platform.
- **Code Export & Sharing**: Easily export or share your code with others.
- **Next.js 15** for server-side rendering and static site generation.
- **React 19** with the latest concurrent features.
- **Tailwind CSS** for fast and responsive UI styling.
- **Framer Motion** for smooth animations.
- **Google OAuth authentication** using `@react-oauth/google`.
- **AI capabilities** with `@google/generative-ai`.
- **Three.js** for 3D visualizations.
- **Radix UI components** for accessibility and better UI.
- **Convex** for modern backend development.
- **Axios** for API requests.
- **Markdown support** with `react-markdown`.

## Installation

### Prerequisites

Make sure you have the following installed:

- Node.js (v18+ recommended)
- npm or yarn

### Clone the repository

```sh
git clone https://github.com/Creator-Art-Life/ai-site-generator.git
cd ai-site-generator

```

### Install dependencies

```sh
npm install  # or yarn install
```

## Usage

### Development

To start the development server, run:

```sh
npm run dev  # or yarn dev
```

This will start a local server at `http://localhost:3000/`.

### Build for production

```sh
npm run build  # or yarn build
```

### Start the production server

```sh
npm start  # or yarn start
```

## Configuration

If you decide to use this project locally, set the corresponding environment variables in a `.env.local` file:

```env
NEXT_PUBLIC_GOOGLE_CLIENT_AUTH_ID=

# Deployment used by `npx convex dev`
CONVEX_DEPLOYMENT=

NEXT_PUBLIC_CONVEX_URL=

NEXT_PUBLIC_GEMINI_API_KEY=


# Use this for controlling dialog alerts that appear in production
# If you decide to use the project locally, then set it to false
NEXT_PUBLIC_PRODUCTION_USE=false
```

## Dependencies

This project uses the following dependencies:

<details>
  <summary>Click to expand dependencies</summary>
```json
"dependencies": {
    "@codesandbox/sandpack-react": "^2.19.11",
    "@google/generative-ai": "^0.21.0",
    "@radix-ui/react-alert-dialog": "^1.1.5",
    "@radix-ui/react-dialog": "^1.1.5",
    "@radix-ui/react-dropdown-menu": "^2.1.5",
    "@radix-ui/react-separator": "^1.1.1",
    "@radix-ui/react-slot": "^1.1.1",
    "@radix-ui/react-tooltip": "^1.1.7",
    "@react-oauth/google": "^0.12.1",
    "axios": "^1.7.9",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "convex": "^1.18.2",
    "date-fns": "^4.1.0",
    "dedent": "^1.5.3",
    "framer-motion": "^12.0.6",
    "lodash": "^4.17.21",
    "lucide-react": "^0.474.0",
    "next": "15.1.6",
    "next-themes": "^0.4.4",
    "postprocessing": "^6.36.6",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-hot-toast": "^2.5.1",
    "react-markdown": "^9.0.3",
    "tailwind-merge": "^3.0.1",
    "tailwind-scrollbar-hide": "^2.0.0",
    "tailwindcss-animate": "^1.0.7",
    "three": "^0.173.0",
    "uuid": "^11.0.5"
}
```

## Contribution

Feel free to open an issue or submit a pull request if you'd like to contribute to the project.
