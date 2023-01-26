# 📂 Tinfoil-Hat Docker Tinfoil Server

Your NSP, XCI and other game files served locally

With this server Tinfoilers can serve all .NSP .XCI files in local network with docker easily without file count limits !

![giphy tinfoilers saying "we dont even understand how to play this game"](https://media.giphy.com/media/3o6Zt4uuhvA0qmUIgg/giphy.gif)

## FAQ

- Q: Why isn't showing all folders ? only showing shop.json and shop.tfl at home index ?

  R: To avoid a TINFOIL strange BUG when lists `shop.tfl` url. Basically when TINFOIL see too many folders on files index, home page (ex.: 100 folders links) TINFOIL can't traverse all html and reach `shop.tfl` file 
![image](https://user-images.githubusercontent.com/10997022/214861654-b24aeab7-0e18-40ab-932b-9293ce4579b0.png)

## What it uses ?

- express |  Serve Dynamically shop(.json|.tfl) with updated content at every refresh
- express-static |  Serve all game files statically making possible download
- serve-index |  To serve a rich listing of files (in case only shop.json shop.tfl for tinfoil)
- json5 | To parse custom shop_template.jsonc (you can define on it custom content like a welcome message)

## How works

1. Serve all games files and path statically 
2. Serve web index to navigate like on PHP apache servers
3. Serve dynamically shop.json and shop.tfl as you place new games and files (fetch files and folders at every request)

# Example from a server runing with docker-compose.yml
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

## We want but we can't

- [ ] Have a gui to override and customize TITLEID info on server-side json db
- [ ] Allow download torrent files from magnet link
