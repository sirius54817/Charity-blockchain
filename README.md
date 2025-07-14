# Cyberpunkz Project

This project is a full-stack application with a backend and frontend, designed for managing donations, charities, and user authentication. It includes smart contract integration for blockchain-based donations.

## Project Structure

- `backend/` - Node.js/Express backend with authentication, routes for charities, donations, and transactions.
- `frontend/` - React frontend with Tailwind CSS, user authentication, dashboard, donation forms, and category pages.
- `auth_functions.sql`, `users_table.sql`, `test_connection.sql` - SQL scripts for database setup and testing.

## Getting Started

### Prerequisites
- Node.js (v16+ recommended)
- npm or yarn
- Truffle (for smart contract development)
- A running database (e.g., PostgreSQL)

### Backend Setup
1. Navigate to the backend folder:
   ```sh
   cd backend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Configure environment variables (e.g., `.env` file).
4. Start the backend server:
   ```sh
   npm start
   ```

### Frontend Setup
1. Navigate to the frontend folder:
   ```sh
   cd frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the frontend development server:
   ```sh
   npm start
   ```

### Smart Contracts
1. Navigate to `frontend/src/contracts`.
2. Use Truffle to compile, migrate, and test contracts:
   ```sh
   truffle compile
   truffle migrate
   truffle test
   ```

## Features
- User authentication (login, register, forgot password)
- Charity and donation management
- Transaction history
- Blockchain integration for donations
- Responsive UI with Tailwind CSS

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
[MIT](LICENSE)
