# Deployment Guide

## Environment Configuration

### Local Development

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Update `.env` with your local settings:
```env
VITE_API_URL=http://localhost:3000
```

3. Start the development server:
```bash
npm run dev
```

4. In another terminal, start the backend:
```bash
npm run server
```

### Production Deployment

#### Frontend (Vite Build)

1. Build the frontend:
```bash
npm run build
```

2. Set production environment variables:
```env
VITE_API_URL=https://your-api-domain.com
```

3. Deploy `dist/` folder to your hosting (GitHub Pages, Vercel, Netlify, etc.)

#### Backend (Node.js Server)

1. Install dependencies:
```bash
npm install
```

2. Set environment variables on your server:
```bash
export NODE_ENV=production
export PORT=3000
```

3. Start the server:
```bash
npm run server
```

Or use a process manager like PM2:
```bash
pm2 start server/server.js --name "gorbhouse-api"
```

## API Configuration

### CORS Settings

The backend is configured with CORS enabled for all origins. For production, update `server/server.js`:

```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
```

### API Endpoints

- `GET /api/memes` - Fetch all memes with ratings
- `POST /api/vote` - Record a vote and update ratings

## Database Persistence

### Local Development
- Database file: `memes.db` (auto-created in project root)

### Production
- Ensure `memes.db` is persisted in a volume or persistent storage
- For cloud deployments (Heroku, Railway, etc.), use their database solutions or persistent file storage

### Docker Deployment Example

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Create volume mount point for database
VOLUME ["/app/data"]

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["node", "server/server.js"]
```

Run with:
```bash
docker run -p 3000:3000 -v gorbhouse-data:/app/data gorbhouse-api
```

## GitHub Pages Deployment

For frontend-only deployment to GitHub Pages:

1. Update `vite.config.ts` base path if needed
2. Build: `npm run build`
3. Push `dist/` to `gh-pages` branch
4. Configure custom domain in GitHub Pages settings

Note: Backend must be deployed separately to a server that supports Node.js.

## Monitoring & Logging

### Server Logs
```bash
# View real-time logs
tail -f server.log

# Archive logs
gzip server.log
```

### Database Health Check
```bash
# Check database integrity
sqlite3 memes.db "PRAGMA integrity_check;"

# View database stats
sqlite3 memes.db "SELECT COUNT(*) as total_memes, AVG(rating) as avg_rating FROM memes;"
```

## Troubleshooting

### API Connection Issues
- Verify `VITE_API_URL` matches your backend URL
- Check CORS headers in browser console
- Ensure backend is running and accessible

### Database Issues
- See `DATABASE_SETUP.md` for troubleshooting
- Verify file permissions: `ls -la memes.db`

### Performance Issues
- Monitor database size: `ls -lh memes.db`
- Check server memory usage
- Consider caching for frequently accessed data
