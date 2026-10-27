# Balaji Restaurant

A React restaurant website with an Express API and MongoDB database.

## Requirements

- Node.js 20 or newer
- MongoDB Community Server running locally (MongoDB Compass is used to inspect the database)

## Run locally

1. Start your local MongoDB server. The default connection is `mongodb://127.0.0.1:27017/balaji_restaurant`.
2. In the project folder, run `npm run install:all` and then `npm install`.
3. Run `npm run dev`.
4. Open the Vite URL shown in the terminal (usually `http://localhost:5173`). The API runs on `http://localhost:5000`.

Copy `server/.env.example` to `server/.env` to customize the MongoDB URL or server port. On first startup the server creates the collections and seeds the signature dishes if the menu is empty. View the `balaji_restaurant` database and its `menuitems` and `reservations` collections in Compass.

## API

- `GET /api/health` — API and database status
- `GET /api/menu` — available menu items
- `POST /api/reservations` — create a reservation

Reservation fields: `name`, `email`, `phone`, `date`, `time`, `guests`, and optional `message`.

## MongoDB collections

Mongoose creates these collections automatically in the `balaji_restaurant` database:

- `menuitems`: `name`, `description`, `price` (INR), `category`, `imageUrl`, `imageAlt`, `isVegetarian`, `isAvailable`, and timestamps. Three example signature dishes are inserted the first time the collection is empty.
- `reservations`: `name`, `email`, `phone`, `date`, `time`, `guests` (1–20), optional `message`, `status` (`pending`, `confirmed`, or `cancelled`), and timestamps. New requests start as `pending`.

The schema definitions are in `server/src/models/`. The app intentionally has no credentials or cloud connection string; it connects to the local MongoDB service so the database can be opened in Compass.
