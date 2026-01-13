# ---------- Base ----------
FROM node:20-alpine AS base
WORKDIR /app
RUN apk add --no-cache openssl

# ---------- Dependencies ----------
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

# ---------- Builder ----------
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Prisma client generation (NO DB CONNECTION)
RUN npx prisma generate

# Build Next.js
RUN npm run build

# ---------- Runner ----------
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Needed for Prisma
RUN apk add --no-cache openssl

# Copy only necessary files
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma

# Expose Next.js port
EXPOSE 3000

# Run migrations at runtime (DB IS READY HERE)
CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]
