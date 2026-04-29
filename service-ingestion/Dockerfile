# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

COPY . .

RUN mkdir -p public

RUN npx prisma generate

RUN npm run build --if-present

# Production stage
FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache dumb-init

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma
COPY start.sh ./start.sh

RUN chmod +x ./start.sh

USER node

HEALTHCHECK --interval=20s --timeout=3s --start-period=60s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3002/api/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})" || true

EXPOSE 3002

ENTRYPOINT ["dumb-init", "--"]

CMD ["sh", "start.sh"]
