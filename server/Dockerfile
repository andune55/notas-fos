# Etapa de build
FROM node:20-bookworm AS build
WORKDIR /app

# Herramientas necesarias para compilar dependencias nativas (better-sqlite3)
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 make g++ \
  && rm -rf /var/lib/apt/lists/*

# Copia sólo los archivos de dependencias (npm)
COPY package*.json ./
RUN npm ci

# Compila TypeScript
COPY tsconfig.json ./tsconfig.json
COPY src ./src
RUN npm run build

# Etapa de runtime
FROM node:20-bookworm
WORKDIR /app
ENV NODE_ENV=production

# Volumen para SQLite
RUN mkdir -p /data
ENV DB_PATH=/data/notes.db

# Copia artefactos de build
COPY --from=build /app/package.json /app/package.json
COPY --from=build /app/node_modules /app/node_modules
COPY --from=build /app/dist /app/dist

EXPOSE 8080
CMD ["node", "dist/index.js"]