# Use Node.js as the build stage
FROM node:20-alpine AS build

# Set the working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Angular application for production
RUN npm run build -- --configuration=production

# Use Nginx to serve the application
FROM nginx:alpine

# Copy the build output to Nginx's HTML directory
# The 'www' directory is the default outputPath in angular.json for Ionic projects
COPY --from=build /app/www /usr/share/nginx/html

# Copy a custom Nginx configuration if needed
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
