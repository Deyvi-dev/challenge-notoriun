# Base image
FROM node:18 AS base

WORKDIR /usr/src/app

# Copy entire workspace
COPY . .

# Install dependencies
RUN npm install -g pnpm
RUN pnpm install

# Development stage
FROM base AS development
EXPOSE 3001
CMD ["npm", "run", "start:dev"]

# Production stage
FROM base AS production
RUN npm install --omit=dev
EXPOSE 3001
CMD ["node", "apps/api/main.js"]