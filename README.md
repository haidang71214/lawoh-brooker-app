Lawyer Broker App

A web-based platform for connecting clients with lawyers, built with Next.js, TypeScript, and MongoDB. It streamlines lawyer hiring, profile management, and secure authentication.

🚀 Features





👨‍⚖️ Lawyer Management – Admins add, edit, and manage lawyer profiles.



🤝 Client Booking – Customers browse and hire lawyers.



📸 Image Upload – Upload lawyer profile images via Cloudinary.



🔐 Authentication – Secure login for Admins (full access) and Customers (browse/book) using asymmetric cryptography.

🛠️ Tech Stack

Frontend: Next.js, TypeScript, TailwindCSS

Backend: Node.js, Nest.js , ts 



Database: MongoDB (Mongoose ODM)



Authentication: JWT with asymmetric keys (RSA/ECDSA)

Image Upload: Cloudinary

Web RTC : Peerjs

Payment : Vnpay(demo)

Tools: Docker, Git, Postman


📂 Project Structure

lawyer-broker/
├── backend/                # Express + MongoDB server
│   ├── src/               
│   │   ├── auth/           # Authentication logic
│   │   ├── booking/        # Booking-related code
│   │   ├── classification/ # Lawyer classification
│   │   ├── cloudinary/     # Cloudinary image handling
│   │   ├── comment/        # Comment system
│   │   ├── config/         # Configuration files
│   │   ├── email/          # Email services
│   │   ├── form/           # Form handling
│   │   ├── key/            # Key management
│   │   ├── lawyer/         # Lawyer-related logic
│   │   ├── message/        # Messaging system
│   │   ├── news/           # News or announcements
│   │   ├── payment/        # Payment processing
│   │   ├── price-range/    # Price range logic
│   │   ├── review/         # Review system
│   │   ├── shared/         # Shared utilities
│   │   ├── storage/        # Storage management
│   │   ├── users/          # User management
│   │   ├── video/          # Video handling
│   │   ├── vip-package/    # VIP package logic
│   │   ├── app.controller.spec.ts  # Test file
│   │   ├── app.controller.ts       # Controller
│   │   ├── app.module.ts           # Module
│   │   ├── app.service.ts          # Service
│   │   └── main.ts                # App entry point
│   ├── docker-compose.yml      # Docker config for MongoDB
│   ├── .env                    # Environment variables
│   ├── .gitignore              # Git ignore file
│   ├── .prettierrc             # Prettier config
│   ├── dockerfile              # Docker file
│   ├── eslint-config.mjs       # ESLint config
│   ├── nest-cli.json           # Nest CLI config
│   ├── package-lock.json       # Package lock
│   ├── package.json            # Package file
│   └── tsconfig.build.json     # TypeScript config
│   └── tsconfig.json           # TypeScript config
├── frontend/                   # Next.js app
│   ├── src/                   
│   │   ├── components/         # Reusable UI components
│   │   ├── pages/              # Pages (Home, Lawyers, etc.)
│   │   ├── services/           # API calls
│   │   └── app.tsx             # App entry point
└── README.md

⚡ Installation & Setup

1️⃣ Clone repository

git clone https://github.com/username/lawyer-broker.git
cd lawyer-broker

2️⃣ Setup backend

cd backend
npm install

Set .env:

MONGODB_URI=mongodb://localhost:27017/lawyer_broker_db
JWT_PRIVATE_KEY=your_private_key
JWT_PUBLIC_KEY=your_public_key
CLOUDINARY_URL=your_cloudinary_url

3️⃣ Setup database (Docker)

Use docker-compose.yml:

version: '3.8'
services:
  db:
    image: mongo:latest
    environment:
      MONGO_INITDB_DATABASE: lawyer_broker_db
    ports:
      - '27017:27017'
    volumes:
      - db-data:/data/db
volumes:
  db-data:

Run:

docker-compose up -d

4️⃣ Setup frontend

cd frontend
npm install

5️⃣ Run application

Backend:

cd backend
npm run start:dev

Frontend:

cd frontend
npm run dev

App runs at:





Frontend: http://localhost:4000



Backend: http://localhost:8080

🧪 Tests

# Backend unit tests
cd backend
npm run test

# Frontend tests
cd frontend
npm run test

🚀 Deployment

Deploy with Docker or follow Next.js deployment docs. Example Docker setup for production:

version: '3.8'
services:
  backend:
    image: node:18
    working_dir: /app
    volumes:
      - ./backend:/app
    command: npm run start:prod
    ports:
      - '4001:4001'
  frontend:
    image: node:18
    working_dir: /app
    volumes:
      - ./frontend:/app
    command: npm run build && npm run start
    ports:
      - '4000:4000'
  db:
    image: mongo:latest
    environment:
      MONGO_INITDB_DATABASE: lawyer_broker_db
    volumes:
      - db-data:/data/db
volumes:
  db-data:

Live deployment:





Backend: http://103.57.223.234:4000/Swagger



Frontend: http://103.57.223.234:4001

🤝 Contributing





Fork repo.



Create branch (git checkout -b feature/your-feature).



Commit (git commit -m 'Add feature').



Push (git push origin feature/your-feature).



Create Pull Request.

📚 Resources





Next.js Docs



MongoDB Docs



Cloudinary Docs



Docker Docs

📜 License

MIT