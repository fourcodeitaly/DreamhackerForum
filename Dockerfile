# Use the official Node.js image
FROM node:22-alpine
# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN yarn install

# Copy the rest of the application
COPY . .

# Build the Next.js app
RUN yarn build

# Expose port (though Nginx will handle external traffic)
EXPOSE 3000

# Start the Next.js app
CMD ["yarn", "start"]