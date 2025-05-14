# Use the official Node.js image
FROM node:22-alpine

ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY

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