FROM node:22-alpine AS builder

WORKDIR /app

RUN npm install -g pnpm@11.18.0

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml nx.json tsconfig.base.json tsconfig.json ./
COPY libs ./libs
COPY apps ./apps
COPY scripts ./scripts

RUN pnpm install --frozen-lockfile
RUN pnpm nx sync

ARG APP_NAME=artsgoz-backoffice
ARG VITE_API_BASE_URL=http://localhost:8080/api
ARG VITE_AKSORNSARA_FRONTEND_URL=http://localhost:4201

ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_AKSORNSARA_FRONTEND_URL=$VITE_AKSORNSARA_FRONTEND_URL

RUN pnpm nx build @artsgoz/${APP_NAME}

FROM nginx:alpine

ARG APP_NAME=artsgoz-backoffice

COPY --from=builder /app/apps/${APP_NAME}/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

