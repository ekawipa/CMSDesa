# 🏡 Village CMS

A powerful, multi-tenant Content Management System built for **villages and small communities**. Easily manage content, users, and branding per village — all from a single, efficient platform.

> 🚀 Built with **Node.js**, **Express**, and **Supabase**  
> 🎨 Styled with **Tailwind CSS** & rendered via **EJS templates**  
> 🔒 Secure, scalable, and clone-ready for multi-village use

---

## ✨ Key Features

- 🏘️ **Multi-tenant Architecture** – Each village has its own space, users, and content
- 📰 **Content Management** – Articles, news, and dynamic pages with rich editing
- 🧭 **Customizable Menus** – Drag & drop-friendly menu system
- 🔐 **User Authentication** – Secure login with role-based access (admin/editor)
- 📱 **Responsive Design** – Optimized for mobile and desktop
- ⚙️ **Easy Deployment** – PM2 + Nginx ready with minimal setup
- 🔁 **Clone-Friendly** – Deploy and replicate instances easily for new villages

---

## ⚡ Quick Start

### ✅ Prerequisites

- [Node.js](https://nodejs.org/) v16+
- [Supabase](https://supabase.com/) account
- Git

### 🚀 Installation
git clone <repository-url>
cd village-cms
npm install
cp .env.example .env

Edit .env and fill in your Supabase credentials:

SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SESSION_SECRET=your_random_session_secret

🛠️ Supabase Setup

    Create a new project on Supabase

    Copy and run the SQL from 📄 Database Setup in the Supabase SQL editor

▶️ Running the App

npm start       # For production
npm run dev     # For development

    Public site → http://localhost:3000

    Admin panel → http://localhost:3000/admin

    Register page → http://localhost:3000/auth/register

🗃️ Database Setup

Run the SQL below in your Supabase project:
<details> <summary>📂 Click to expand SQL</summary>

-- Tables
CREATE TABLE villages (...);
CREATE TABLE users (...);
CREATE TABLE articles (...);
CREATE TABLE news (...);
CREATE TABLE pages (...);
CREATE TABLE menu_items (...);

-- RLS & Policies
ALTER TABLE ... ENABLE ROW LEVEL SECURITY;
CREATE POLICY ...;

</details>

    🔐 Full SQL snippet is available in README

📦 Deployment
🔧 Nginx Config

server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        ...
    }
}

⚙️ PM2 Setup

Install and run:

npm install -g pm2
pm2 start ecosystem.config.js
pm2 save
pm2 startup

Example ecosystem.config.js:

module.exports = {
  apps: [{
    name: 'village-cms',
    script: 'server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
};

🌀 Cloning for Multiple Villages

    Duplicate the project folder:

cp -r village-cms village-cms-village2
cd village-cms-village2

Create new Supabase project or use shared DB with isolated village IDs

Update:

    .env

    Port (e.g., in package.json, PM2 config, Nginx)

Deploy:

    npm install
    pm2 start ecosystem.config.js

    💡 You can host dozens of villages from a single DB with isolated access per tenant!

🧠 Feature Overview
🛠 Admin Panel

    Dashboard with statistics

    Article and news management

    Dynamic page builder

    Menu editor

    Village configuration

    User & permission control

🌐 Public Site

    Mobile-first layout

    Clean article and news pages

    Search functionality

    Custom branding per village

    SEO-ready dynamic pages

🏘 Multi-tenant Support

    Village isolation via village_id

    Custom themes per village

    Unique menu & page setup

    Role-based permissions

🧰 Tech Stack
Layer	Tech
Backend	Node.js, Express
Frontend	EJS, Tailwind CSS
Database	Supabase (PostgreSQL)
Auth	Bcrypt + Session-based
Deployment	PM2 + Nginx
🤝 Contributing

We welcome contributions!

    Fork the repo

    Create a new branch

    Make your changes

    Add tests if necessary

    Submit a PR

📄 License

MIT License – See the LICENSE file for details.
🆘 Support
Create an issue on GitHub
Or contact the development team via your preferred method
Made with ❤️ for villages around the 🌍
