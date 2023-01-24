FROM node:19-alpine3.16

ENV APP_DIR=/
ENV DEBUG=tinfoil*
ENV ROMS_DIR_FULLPATH=/games
ENV TINFOIL_HAT_PORT=80

# Create the app directory
RUN mkdir -p ${APP_DIR}

# Copy the package.json and package-lock.json
COPY package*.json ${APP_DIR}/
# Install the app dependencies
WORKDIR ${APP_DIR}
RUN npm install --production

# Copy the application code
COPY . ${APP_DIR}

# Expose the app TINFOIL_HAT_PORT
EXPOSE ${TINFOIL_HAT_PORT}

# Start the app
CMD ["npm", "start"]