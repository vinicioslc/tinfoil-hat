# 📂 Tinfoil-Hat

Your NSP, XCI and other nintendo files served locally

With this thing Tinfoilers can serve all your NSP files in local network from a old computer

# Docker-compose for CasaOS

```yml
version: "3"
services:
  tinfoil-hat:
    labels:
      # same scop used by watchtower to self update image
      - "com.centurylinklabs.watchtower.scope=tinfoilhat"
    container_name: tinfoil-hat
    build: .
    image: vinicioslc/tinfoil-hat:latest
    environment:
      # show all debug information on server logs (http info and more)
      - DEBUG=*
      # only show tinfoil information
      # - DEBUG=tinfoil-hat
    ports:
      # Change to any port of your machine (9009 in that case) (dont change the :80 !!!)
      - 9009:80
      # you can now access on your browser http://localhost:9009 and see your games
    volumes:
      # path to your custom shop_template.jsonc used to show message on success or add authentication
      # - ./shop_template.jsonc:/shop_template.jsonc
      # mount your path to a directory with nsp,xci ...
      - /switch/games/:/games/
  # to enable auto update tinfoil-hat container
  tinfoil-hat-updater:
    image: containrrr/watchtower:latest
    volumes:
      # get docker socket
      - /var/run/docker.sock:/var/run/docker.sock
      # get machine localtime
      - /etc/localtime:/etc/localtime
    command: --debug --http-api-update
    environment:
      # put your timezone here
      - TZ=America/Sao_Paulo
      - WATCHTOWER_POLL_INTERVAL=60
      - WATCHTOWER_ROLLING_RESTART=true
      - WATCHTOWER_SCOPE=tinfoilhat
    labels:
      com.centurylinklabs.watchtower.enable: false
    ports:
      - 9008:8080
```

## Workflow

1. Serve all files statically inside path
2. Serve web interface to navigate like on PHP apache servers
3. Serve dynamically shop.json and shop.tfl as you place new games and files

## TO-DO

- [ ] Add gui to override and customize TITLEID info on server
- [ ] Allow download torrent files from magnet link
