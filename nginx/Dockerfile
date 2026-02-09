# NGINX Reverse Proxy Dockerfile
FROM nginx:alpine

# Remove default nginx configuration to avoid conflicts
RUN rm /etc/nginx/conf.d/default.conf

# Expose port 80 to be accessible
EXPOSE 80
EXPOSE 443

# Start NGINX (will keep running as reverse proxy)
CMD ["nginx", "-g", "daemon off;"]
