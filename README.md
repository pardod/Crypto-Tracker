# Cryptocurrency Tracker

A cryptocurrency tracker application that enables users to log in, manage a portfolio, post crypto news, and view the top movers and losers for the day. This application is built using Node.js and uses Supabase as the database. CoinCap API is used to fetch real-time cryptocurrency data, and passwords are automatically encrypted for secure storage.

## Features

- **User Authentication**: Secure login with encrypted passwords.
- **Portfolio Management**: Add, view, and manage your cryptocurrency portfolio.
- **Crypto News Posting**: Post and view news related to cryptocurrencies.
- **Market Data**: Check the top movers and losers of the day, sourced from the CoinCap API.

## Project Structure

```plaintext
CRYPTO-TRACKER/
├── dist/                     # Compiled files
├── node_modules/             # Dependencies
├── src/                      # Application source code
├── supabase/                 # Supabase configuration and SQL setup
├── bun.lockb                 # Bun lock file
├── components.json           # Components configuration
├── eslint.config.js          # ESLint configuration
├── index.html                # Main HTML file
├── package-lock.json         # npm lock file
├── package.json              # Project metadata and scripts
├── postcss.config.js         # PostCSS configuration
├── README.md                 # Project documentation
├── tailwind.config.ts        # Tailwind CSS configuration
├── tsconfig.app.json         # TypeScript configuration for the app
├── tsconfig.json             # Global TypeScript configuration
├── tsconfig.node.json        # TypeScript configuration for Node
└── vite.config.ts            # Vite configuration
```

## Requirements

- **Node.js**: Ensure Node.js is installed (version 12 or higher recommended). [Download Node.js here](https://nodejs.org/)
- **npm**: npm is included with Node.js. Verify installation by running `npm -v` in your terminal.
- **Supabase Account**: Set up a Supabase project for the database.
- **CoinCap API**: Register for access to the CoinCap API for real-time cryptocurrency data.

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/pardod/Crypto-Tracker.git
cd Crypto-Tracker
```

### 2. Install Dependencies

Install all required packages using npm:

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root directory and add the following environment variables:

```plaintext
# .env file
PORT=3000
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
COINCAP_API_URL=https://api.coincap.io/v2
```

- **PORT**: Port where the server will run (default is 3000).
- **SUPABASE_URL**: URL for your Supabase project.
- **SUPABASE_KEY**: API key for your Supabase project.
- **COINCAP_API_URL**: Base URL for CoinCap API requests.

### 4. Run the Application

To start the development server, use the following command:

```bash
npm run dev
```

This will start the server in development mode. By default, the application will be accessible at `http://localhost:3000`.

### 5. Accessing the Application

Open your browser and navigate to `http://localhost:3000` to access the cryptocurrency tracker.

## Scripts

- **`npm run dev`**: Runs the application in development mode with automatic restarts on file changes.
- **`npm start`**: Runs the application in production mode.

## Dependencies

Key dependencies include:
- **TypeScript**: For static typing and enhanced code quality.
- **Express**: Web application framework for Node.js.
- **Supabase**: Used as the backend database for storing user and portfolio data.
- **dotenv**: For managing environment variables.
- **Vite**: A fast build tool that serves as the frontend bundler and development server.
- **Tailwind CSS**: For styling the application.

## Contributing

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Make your changes and commit (`git commit -m 'Add your feature'`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a pull request.



## Contact

If you have any questions or feedback, please reach out at [Email@DylanPardo.com].

