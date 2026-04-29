# =====================================================
# multi-stage build — front-end
# contexto de build: raiz do monorepo (../)
# =====================================================
FROM node:22-alpine AS base
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps

FROM base AS builder
COPY . .
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
RUN npx nx build front-end --prod

FROM nginx:alpine AS production
COPY --from=builder /app/dist/front-end /usr/share/nginx/html
COPY front-end/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
