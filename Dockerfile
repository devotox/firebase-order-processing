# Base Image to use
FROM node:6

# File Author / Maintainer
MAINTAINER Devonte Emokpae

# Environment production
ENV NODE_ENV "production"
ENV EDITOR "nano"
ENV TERM "xterm"

# APT installs
RUN DEBIAN_FRONTEND=noninteractive \
	apt-get update  -y --no-install-recommends --no-install-suggests --fix-missing && \
	apt-get upgrade -y --no-install-recommends --no-install-suggests --fix-missing && \
	apt-get install -y --no-install-recommends --no-install-suggests --fix-missing apt-utils nano && \
	apt-get clean && rm -rf /var/lib/apt/lists/*

# Provides cached layer for node_modules
COPY package.json /tmp/package.json
RUN cd /tmp && npm install --unsafe-perm --no-optional --no-progress --dev

RUN mkdir -p /app && \
	ln -s /tmp/package.json /app/package.json && \
	ln -s /tmp/node_modules /app/node_modules

# Define working directory
COPY . /app
WORKDIR /app

# Define working directory as a volume
VOLUME ["/app", "/tmp", "/var/log/app"]

# Expose port
EXPOSE 3000 9999

# Run app
CMD ["npm", "start"]
