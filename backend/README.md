# HEXA NEWS (HNN) Backend API

Express.js + MongoDB REST API for the HEXA NEWS portal.

## Setup

```bash
cd backend
npm install
npm run dev      # development (nodemon auto-reload)
npm start        # production
npm run seed     # DROPS the database and loads demo content
```

Runs on **http://localhost:4000** and also serves the HTML site from the project root.

## Admin Credentials

| Field    | Value         |
|----------|---------------|
| Username | `admin`       |
| Password | `Admin@123`   |

The first admin is auto-created on boot when `ADMIN_INITIAL_PASSWORD` is set and the database has no user yet.

## API Endpoints

### Auth
| Method | Path              | Auth | Description            |
|--------|-------------------|------|------------------------|
| POST   | /api/auth/login   | No   | Login, returns JWT     |
| GET    | /api/auth/me      | Yes  | Get current user       |
| POST   | /api/auth/logout  | Yes  | Logout (client drops token) |

### News
| Method | Path            | Auth  | Description        |
|--------|-----------------|-------|--------------------|
| GET    | /api/news       | No    | List news articles |
| GET    | /api/news/:id   | No    | Get single article |
| POST   | /api/news       | Admin | Create article     |
| PUT    | /api/news/:id   | Admin | Update article     |
| DELETE | /api/news/:id   | Admin | Delete article     |

Query params for GET /api/news: `category`, `subcategory`, `featured`, `limit`, `page`

### Other resources
`/api/categories`, `/api/tags`, `/api/authors`, `/api/pages`, `/api/settings`, `/api/ads`, `/api/upload`, `/api/health`

### Auth Header
```
Authorization: Bearer <token>
```

## File Structure

```
backend/
├── server.js           # Entry point, static + API serving
├── package.json
├── .env                # Ports, Mongo URI, JWT secret, brand settings
├── config/db.js        # Mongoose connection
├── middleware/auth.js  # JWT verification
├── models/             # Article, Category, Tag, Author, Page, Setting, Ad, User, Image
├── routes/             # auth, news, categories, tags, pages, authors, settings, ads, upload
├── utils/              # slug, translate, transliterate helpers
├── scripts/            # maintenance/migration scripts
└── uploads/            # uploaded images on disk
```

## Production Notes

- Set `JWT_SECRET` to a strong random string
- Set `PORT`, `MONGO_URI`, `FRONTEND_URL`, `ALLOWED_ORIGIN` in `.env`
- Set `NODE_ENV=production` so CORS is restricted to the allowed origins
