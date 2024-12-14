FROM node:18-alpine

WORKDIR /app

# Copy only necessary files first
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app, including index.html
COPY . .

# Build the app
RUN npm run build

# Expose the app port
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
