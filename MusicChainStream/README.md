
# BlockBeats - Web3 Music Streaming Platform

A decentralized music streaming platform that combines blockchain technology with music streaming, enabling direct artist payments and transparent revenue tracking.

## System Architecture

```
Client (React) <-> Express Server <-> PostgreSQL Database
       ↕            ↕
Web3/Blockchain  File Storage
```

## Tech Stack
- **Frontend**: React, TypeScript, TailwindCSS
- **Backend**: Express, Node.js
- **Database**: PostgreSQL with Drizzle ORM
- **State Management**: React Query
- **Blockchain**: Web3.js
- **UI Components**: Radix UI, Shadcn
- **Audio**: Howler.js

## Features
- 🎵 Music streaming with blockchain integration
- 💰 Direct artist payments via smart contracts
- 📊 Artist dashboard and earnings tracking
- 📱 Mobile-responsive design
- 🔍 Advanced search functionality
- 📚 Personal library management

## Setup Instructions

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
- Create a `.env` file
- Add DATABASE_URL for PostgreSQL connection
- Add BLOCKCHAIN_RPC_URL for Web3 connection

4. Start development server:
```bash
npm run dev
```

5. Build for production:
```bash
npm run build
```

## Security Considerations
- Smart contract auditing required before mainnet deployment
- Wallet transaction signing verification
- Rate limiting on API endpoints
- Input validation for all user data
- Secure session management

## Development Guidelines
- Follow TypeScript best practices
- Write tests for critical functions
- Use proper error handling
- Document code changes
- Follow commit message conventions

## License
MIT License
