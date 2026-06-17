FROM oven/bun:1

WORKDIR /app

# Copy dependency definition files
COPY package.json bun.lock ./

# Install dependencies using Bun
RUN bun install

# Copy all source files
COPY . .

# Expose the port Hono API listens on
EXPOSE 3001

# Run the Hono server
CMD ["bun", "run", "server/index.ts"]
