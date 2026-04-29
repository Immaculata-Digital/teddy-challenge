# =====================================================
# multi-stage build — back-end (NestJS)
# contexto de build: raiz do monorepo (../)
# =====================================================
FROM node:22-alpine AS base
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps

FROM base AS builder
COPY . .
RUN npx nx build api --prod

FROM node:22-alpine AS production
WORKDIR /app

# Apenas dependências de produção
COPY package.json package-lock.json ./
RUN npm ci --omit=dev --legacy-peer-deps && npm cache clean --force

# Copiar build do NestJS (conforme definido no project.json como dist-api)
COPY --from=builder /app/dist-api ./dist

EXPOSE 3000
ENV NODE_ENV=production

CMD ["node", "dist/main.js"]
