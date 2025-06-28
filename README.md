# Village CMS

A dynamic, multi-tenant content management system designed specifically for villages and small communities. Built with Node.js, Express, and Supabase.

## Features

- **Multi-tenant Architecture**: Each village gets its own isolated space
- **Content Management**: Create and manage articles, news, and dynamic pages
- **Customizable Menus**: Drag-and-drop menu management
- **User Authentication**: Secure login system with role-based permissions
- **Responsive Design**: Works perfectly on all devices
- **Easy Deployment**: Simple setup and deployment process
- **Clone-friendly**: Easy to replicate for multiple villages

## Quick Start

### Prerequisites

- Node.js (v16 or higher)
- Supabase account
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd village-cms
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   - Create a new project in Supabase
   - Copy your project URL and anon key
   - Set up the database schema (see Database Setup below)

4. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your Supabase credentials:
   ```
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   SESSION_SECRET=your_random_session_secret
   ```

5. **Start the server**
   ```bash
   npm start
   ```

   For development:
   ```bash
   npm run dev
   ```

6. **Access the application**
   - Public site: http://localhost:3000
   - Admin panel: http://localhost:3000/admin
   - Registration: http://localhost:3000/auth/register

## Database Setup

Run these SQL commands in your Supabase SQL editor:

```sql
-- Create villages table
CREATE TABLE villages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  theme_color TEXT DEFAULT '#3B82F6',
  contact_email TEXT,
  address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create users table
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT DEFAULT 'editor' CHECK (role IN ('admin', 'editor')),
  village_id UUID REFERENCES villages(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create articles table
CREATE TABLE articles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  village_id UUID REFERENCES villages(id),
  author_id UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create news table
CREATE TABLE news (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  village_id UUID REFERENCES villages(id),
  author_id UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create pages table
CREATE TABLE pages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  slug TEXT NOT NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  village_id UUID REFERENCES villages(id),
  author_id UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(slug, village_id)
);

-- Create menu_items table
CREATE TABLE menu_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  type TEXT DEFAULT 'custom' CHECK (type IN ('custom', 'page', 'article')),
  order_index INTEGER DEFAULT 0,
  village_id UUID REFERENCES villages(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE villages ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (you can adjust these based on your needs)
CREATE POLICY "Public villages are viewable by everyone" ON villages FOR SELECT USING (true);
CREATE POLICY "Users can view their village data" ON villages FOR ALL USING (true);

CREATE POLICY "Users can view their own data" ON users FOR SELECT USING (true);
CREATE POLICY "Users can update their own data" ON users FOR UPDATE USING (true);

CREATE POLICY "Published articles are viewable by everyone" ON articles FOR SELECT USING (status = 'published');
CREATE POLICY "Users can manage their village articles" ON articles FOR ALL USING (true);

CREATE POLICY "Published news are viewable by everyone" ON news FOR SELECT USING (status = 'published');
CREATE POLICY "Users can manage their village news" ON news FOR ALL USING (true);

CREATE POLICY "Published pages are viewable by everyone" ON pages FOR SELECT USING (status = 'published');
CREATE POLICY "Users can manage their village pages" ON pages FOR ALL USING (true);

CREATE POLICY "Menu items are viewable by everyone" ON menu_items FOR SELECT USING (true);
CREATE POLICY "Users can manage their village menu" ON menu_items FOR ALL USING (true);
```

## Deployment

### Nginx Configuration

Create a new Nginx server block:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### PM2 Process Manager

Install PM2:
```bash
npm install -g pm2
```

Create `ecosystem.config.js`:
```javascript
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
```

Start with PM2:
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## Cloning for Multiple Villages

To create a new instance for another village:

1. **Copy the project**
   ```bash
   cp -r village-cms village-cms-newvillage
   cd village-cms-newvillage
   ```

2. **Create new Supabase project** (or use the same one with different village IDs)

3. **Update configuration**
   - Modify `.env` with new credentials
   - Change the port in `package.json` and nginx config
   - Update domain names

4. **Deploy**
   ```bash
   npm install
   pm2 start ecosystem.config.js
   ```

## Features Overview

### Admin Panel
- Dashboard with statistics
- Article management with rich text editing
- News management
- Dynamic page creation
- Menu customization
- Village settings

### Public Site
- Responsive design
- News and article listings
- Dynamic pages
- Search functionality
- Mobile-friendly navigation

### Multi-tenant Support
- Village isolation
- Separate branding per village
- Individual admin accounts
- Customizable themes

## Technology Stack

- **Backend**: Node.js, Express.js
- **Database**: Supabase (PostgreSQL)
- **Frontend**: EJS templating, Tailwind CSS
- **Authentication**: Session-based with bcrypt
- **Deployment**: Nginx, PM2

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For support, please create an issue in the GitHub repository or contact the development team.