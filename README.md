# DoodleVerse

DoodleVerse is a real-time collaborative whiteboarding platform built with modern web technologies. It allows multiple users to draw, sketch, and collaborate in shared workspaces simultaneously.

## 🎥 Preview

<video src="output.mp4" width="640" height="360" controls>
  Your browser does not support the video tag.
</video>

## 🚀 Tech Stack

- **Frontend**: Next.js 15, React, TailwindCSS
- **HTTP Backend**: Express.js
- **WebSocket Backend**: WebSocket (ws)
- **Database**: PostgreSQL
- **Package Manager**: pnpm
- **Monorepo Management**: Turborepo

## 📁 Project Structure

```
DoodleVerse/
├── apps/
│   ├── doodle-fe/        # Next.js 15 frontend application
│   ├── http-backend/     # Express.js HTTP API service
│   └── ws-backend/       # WebSocket service
├── packages/
│   ├── shared/           # Shared types and utilities
│   └── db/              # Database client and schema
└── package.json
```

## 🛠️ Setup & Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/DoodleVerse.git
cd DoodleVerse
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
# In apps/doodle-fe/.env
NEXT_PUBLIC_HTTP_API_URL=http://localhost:3001
NEXT_PUBLIC_WS_URL=ws://localhost:3002

# In apps/http-backend/.env
DATABASE_URL=postgresql://user:password@localhost:5432/doodleverse
JWT_SECRET=your_jwt_secret

# In apps/ws-backend/.env
DATABASE_URL=postgresql://user:password@localhost:5432/doodleverse
JWT_SECRET=your_jwt_secret
```

4. Start the development servers:
```bash
pnpm dev
```

## 🎨 Features

- Real-time collaborative drawing
- Multiple drawing tools (Rectangle, Circle, Text, Arrow)
- Eraser tool
- Room-based collaboration
- User authentication
- Responsive design

## 🔧 Development

### Frontend (apps/doodle-fe)
- Port: 3000
- Built with Next.js 15 App Router
- Uses WebSocket for real-time updates
- TailwindCSS for styling

### HTTP Backend (apps/http-backend)
- Port: 3001
- RESTful API endpoints
- User authentication
- Room management

### WebSocket Backend (apps/ws-backend)
- Port: 8080
- Real-time communication
- Drawing synchronization
- Chat functionality

### Database
- PostgreSQL for persistent storage
- Prisma as ORM
- Shared database schema

## 🌟 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Contact

For any queries or suggestions, please open an issue in the repository.
