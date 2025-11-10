# backend/Dockerfile → VERSION ULTRA-RAPIDE
FROM node:18-alpine

WORKDIR /app

# Copie uniquement package.json
COPY package*.json ./

# Installe en cache (rapide si pas changé)
RUN npm install

# Copie le reste
COPY . .

# Vérifie server.js
RUN test -f server.js || (echo "ERREUR: server.js manquant!" && exit 1)

# Port
EXPOSE 5001

# Variables
ENV NODE_ENV=development \
    PORT=5001 \
    MONGO_URL=mongodb://localhost:27017

# Démarre
CMD ["node", "server.js"]