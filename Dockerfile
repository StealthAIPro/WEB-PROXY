# Use a lightweight Node.js 20 image
FROM node:20-slim

# Set the working directory inside the container
WORKDIR /app

# Copy package files first to cache dependencies
COPY package*.json ./

# Install dependencies (including production only)
RUN npm install --production

# Copy the rest of your application code
COPY . .

# Ultraviolet requires the built files in the public folder
# If you haven't manually copied them yet, this step ensures they exist
# (Assumes you have the copy scripts in your package.json or manually moved them)

# Expose the port your server.js is listening on
EXPOSE 3000

# Set environment variables (Optional: for Firebase or Port)
ENV NODE_ENV=production
ENV PORT=3000

# Start the application
CMD ["node", "server.js"]
