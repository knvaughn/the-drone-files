# Use official Node.js image
FROM node:22-alpine

# Set the working directory
WORKDIR /source

# Copy package.json and install dependencies
COPY source/package.json source/package-lock.json ./
RUN npm install

# Copy the rest of the app
COPY source/ .

# Build the Remix app
RUN npm run build

# Expose port and define entry point
EXPOSE 3000
CMD ["npm", "start"]
