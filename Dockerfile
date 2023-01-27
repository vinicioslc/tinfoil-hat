FROM node:19-alpine3.16

LABEL com.centurylinklabs.watchtower.enable=true
ENV DEBUG=tinfoil*
ENV ROMS_DIR_FULLPATH=/games
ENV TINFOIL_HAT_PORT=80
ENV BASIC_AUTH=
ENV UNAUTHORIZED_MSG=

# The container will run at root level of container
# to avoid long syntax when mounting /games folder

# Create the games directory
RUN mkdir -p /games

# Copy the package.json and package-lock.json
COPY package*.json /
# Install the app dependencies
WORKDIR /
RUN npm install --production

# Copy the application code
COPY . /

# Expose the app TINFOIL_HAT_PORT
EXPOSE ${TINFOIL_HAT_PORT}

# Start the app
CMD ["npm", "start"]