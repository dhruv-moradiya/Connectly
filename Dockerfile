# ---------- 1. Build Stage ----------
FROM node:20 AS builder
WORKDIR /app

# Copy root files
COPY package.json tsconfig.json ./

# Copy entire monorepo (except node_modules via .dockerignore)
COPY packages ./packages

# Install dependencies (root + all workspaces)
RUN npm install

# Build all packages (client, server, shared)
RUN npm run build

# ---------- 2. Production Stage ----------
FROM node:20 AS production
WORKDIR /app

# Copy only necessary files for production
COPY package.json ./
COPY packages ./packages

# Install only production dependencies
RUN npm install --omit=dev

# Expose server port
EXPOSE 3000

# Start server
CMD ["node", "packages/server/dist/index.js"]

