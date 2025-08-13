# ---------- 1. Build Stage ----------
FROM node:20 AS builder
WORKDIR /app

# Copy root package.json
COPY package.json ./

# Copy everything
COPY packages ./packages

# Install all deps
RUN npm install

# Build all
RUN npm run build


# ---------- 2. Production Stage ----------
FROM node:20 AS production
WORKDIR /app

# Copy only necessary files from builder
COPY --from=builder /app/packages/server/dist ./packages/server/dist
COPY --from=builder /app/packages/client/dist ./packages/client/dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/packages/server/package*.json ./packages/server/

# Install only production deps
RUN npm install --omit=dev

EXPOSE 3000

CMD ["node", "packages/server/dist/index.js"]
