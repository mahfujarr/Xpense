# 🧾 PFT — Personal Finance Tracker

A lightweight, user-friendly expense tracking web app built with PHP and MySQL. PFT helps users manage their daily expenses, categorize spending, and visualize financial habits.

---

## 🚀 Features

- 🔐 User authentication (registration & login)
- 💸 Add, edit, and delete expenses
- 📂 Custom category management
- 📅 Expense history grouped by month
- 📊 Dashboard with summary cards
- 🧠 Responsive design for mobile and desktop
- 🔒 Secure environment configuration using `.env`

---

## 🛠 Tech Stack

| Layer       | Technology    |
| ----------- | ------------- |
| Backend     | PHP (vanilla) |
| Database    | MySQL         |
| Frontend    | HTML, CSS, JS |
| UI Dynamics | AJAX          |
| Config Mgmt | `config.php`  |

---

## File Breakdown

- `DB_conn.php` — Manages your database connection (assuming you're using MySQL or similar).
- `config.php` — Config settings for the app (likely includes DB credentials or site config).
- `index.php` — The default page that serves everything up.
- `initiateDB.sql` — SQL script to create databases/tables to run the app.
- `assets/` — Styles, images, scripts, etc.
- `public/` — Public-facing folder, probably houses CSS, JS, frontend templates.

## Getting Started

1. **Clone this repo**

   ```bash
   git clone https://github.com/mahfujarr/PFT.git

   ```

2. **Set up the database**

   - Use `initiateDB.sql` to create your DB and tables.

   ```bash
   mysql -u <user> -p < database_name < initiateDB.sql
   ```

3. **Configure settings**

   - Open `config.php` and fill in your database credentials and other deets.

4. **Launch the app**

   - Point your local server to the project’s root (where `index.php` lives).
   - Make sure `DB_conn.php` and `config.php` are getting the right DB connection info.

5. **Play around and tweak!**  
   Tweak `index.php`, throw in new assets in `assets/`, and style the frontend in `public/`.
