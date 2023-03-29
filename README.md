# 📂 Tinfoil-Hat Server
> A Docker based Tinfoil Server - you could download code and `npm run dev` as well...
Your NSP, XCI and other game files served locally

With this server Tinfoilers can serve all .NSP .XCI files in local network with docker easily without file count limits !
 
### Key Features
  - Instant index refresh (no need waiting refresh interval, just put games into folder and reload window)
  - Multi user Authentication through user:pass string provided on ENVs
  - Customize Hello message and not logged in message throught ENVs 
  - 96% less RAM consumption, compared to the NUT solution !!! (in our use cases)
<div align="center">
 <br>

[![RAM Cansumption report from reddit users](https://user-images.githubusercontent.com/10997022/218286171-fbd4e5b3-94e3-438f-badb-788c1f55af76.png)](https://www.reddit.com/r/SwitchPirates/comments/10ltfxe/tinfoilhat_a_open_source_nodejs_docker_app_to/)

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/K3K424BR8)

![giphy tinfoilers saying "we dont even understand how to play this game"](https://media.giphy.com/media/3o6Zt4uuhvA0qmUIgg/giphy.gif)

</div>

## FAQ

- Q: Has Authentication ?

> R: Yes, you can thought AUTH_USERS env explained more at [`docker-compose.yml`](#docker-compose-sample-using-password) sample, (this block access to `/shop.json` on browser too)

```bash
  # before starts the server it shows which users has login credentials
  tinfoil-hat Auth Users Loaded: 'admin,other' +0ms
  tinfoil-hat ------------------ TinfoilHat Started v1.1.0 ------------------ +5ms
```

- Q: Why isn't showing all folders ? only showing `shop.json` and `shop.tfl` at home index ?

> R: To avoid a TINFOIL strange BUG when lists `shop.tfl` url. Basically when TINFOIL see too many folders on files index, home page (ex.: 100 folders links) TINFOIL can't traverse all html and reach `shop.tfl` file

## How works

- Serve shop.json(for user check) and shop.tfl(for tinfoil) dynamically as you place new games and files on foilder (search files and folders at every refresh) this ensures a realtime Tinfoil listing files (you need reopen tinfoil to fully refresh index) 

# Docker-Compose Sample Using Password

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
      # only show tinfoil-hat information on logs
      # - DEBUG=tinfoil-hat
      # users list authorized to access tinfoil-hat user and password separated by ":" and users separated by "," <your-user>:<your-pass>
      - AUTH_USERS=tinfoiler:password,othertinfoiler:otherpassword
      - UNAUTHORIZED_MSG='No tricks and treats for you!!'
      - WELCOME_MSG='The Server Just Works!!'
    ports:
      # Change to any port of your machine (99 in that case) (dont change the :80 !!!)
      - 99:80
      # you can now access on your browser http://localhost:99/shop.json and see your games
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

## We want
- [ ] Organize and rename app listing by GAMEID
- [ ] Have a gui to override and customize TITLEID info on server-side json db
- [ ] Allow download torrent files from magnet link

## Images with Tinfoil

#### setup connection

![image](https://user-images.githubusercontent.com/10997022/214877049-8d369eb5-7440-4b22-9763-96da1c277f41.png)

#### when find server (save and restart tinfoil app)

![image](https://user-images.githubusercontent.com/10997022/214877143-e5a67dd8-939c-4a37-8763-619c1fa0b0d5.png)

## Which Tech Stack ?

- `express` | Serve Dynamically shop(.json|.tfl) with updated content at every refresh and serve files statically
- `serve-index` | To serve a rich listing of files (in case only shop.json shop.tfl for tinfoil)
- `json5` | To parse custom shop_template.jsonc (you can define on it custom content like a welcome message !!!)
