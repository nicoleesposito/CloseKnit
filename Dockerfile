# Reference guide: https://dzone.com/articles/how-to-dockerize-a-react-app-with-vite

# Grabbing the official node image from dockerhub for version 24(LTS)
FROM node:24-alpine

# Sets the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 5173

# Command to run the app. "npm run dev" in the command line.
CMD ["npm", "run", "dev"]

