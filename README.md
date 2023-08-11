<h1 align='center'> PS Back-end Mega 2023 </h1>

<p align='center'>
<img alt="Top language" src="https://img.shields.io/github/languages/top/falcao-g/processo-mega">
<img alt="Version express" src="https://img.shields.io/badge/express-^4.18.2-red.svg?logo=express">
<img alt="Version postgres" src="https://img.shields.io/badge/postgres-v15-blue.svg?logo=postgresql">
<img alt="All contributors" src="https://img.shields.io/badge/all contributors-3-green.svg">
</p>

## 📚 Introduction

This repository contains the back-end project for the Mega Jr. Selective Process of 2023.

This project consists of a HTTP API that provides the following functionalities:

- Register a new user
- Login
- Ability to change password, name and upload profile picture
- Get all player items
- See details of one specific item
- Sell an item
- Get all available lootboxes
- Buy and open a lootbox
- Propose a trade with another player
- Accept or decline a trade
- Get all trades
- Cancel a trade

## 🔧 What was used

<details>
<summary>Authentication</summary>

- Bcrypt
- JWT
- httpOnly cookies

</details>

<details>
<summary>Database</summary>

- PostgreSQL
- Knex

</details>

<details>
<summary>Tecnologies</summary>

- Node.js
- Express

</details>

<details>
<summary>Development</summary>

- ESLint
- Prettier
- Husky
- Lint Staged
- Nodemon
- Jest

</details>

<details>
<summary>Image handling</summary>

- Multer

</details>

## 📝 How to use

### 📦 Prerequisites

- [Node.js](https://nodejs.org/en/download/)
- [PostgreSQL](https://www.postgresql.org/download/)

### 🚀 Running the project

1. Clone this repository
2. Install the dependencies with `npm install`
3. Create a `uploads` folder inside the `src` folder
4. Create a new database in PostgreSQL
5. Remove the `.example` extension from the `.env.example` file
6. Fill the `.env` file with the database information
7. In the `secret` field, you can generate one with `require('crypto').randomBytes(64).toString('hex');"` or use any other string
8. Run the migrations with `knex migrate:latest`
9. Run the project with `npm run dev:start`
10. The server will be running on `http://localhost:8080`! 🎉
