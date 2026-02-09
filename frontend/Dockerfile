# Stage 1: Build the Astro frontend
FROM node:23-alpine AS frontend-build

WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm install -g npm@latest && npm install

# Copy project files
COPY . .

# Build the Astro project
RUN npm run build

# Stage 2: Serve with nginx
FROM nginx:alpine

# Remove default NGINX config
RUN rm -f /etc/nginx/conf.d/default.conf

# Copy your custom static-site nginx config
COPY ./default.conf /etc/nginx/conf.d/default.conf

# Copy build output from Astro
COPY --from=frontend-build /usr/src/app/dist /usr/share/nginx/html

# Expose port 80 to be accessible
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]