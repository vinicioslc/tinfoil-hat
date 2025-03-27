# 📂 Tinfoil-Hat Server

[![Playwright Tests](https://github.com/vinicioslc/tinfoil-hat/actions/workflows/playwright.yml/badge.svg)](https://github.com/vinicioslc/tinfoil-hat/actions/workflows/playwright.yml)
[![Docker Publish](https://github.com/vinicioslc/tinfoil-hat/actions/workflows/docker.yml/badge.svg)](https://github.com/vinicioslc/tinfoil-hat/actions/workflows/docker.yml)

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/K3K424BR8)

> A Docker based Tinfoil Server - you could download code and `npm run dev` as well...

## - Your NSP, XCI and other game files served locally

With this server Tinfoil users can serve all .NSP .XCI files in local network with docker easily without file count limits !

### Key Features

- Instant index refresh (no need waiting refresh interval, just put games into folder and reload window)
- Multi user Authentication through user:pass,user2:pass2 ENV supplied as docker env
- Customize Hello message and not logged in message throught ENVs
- 96.29% less RAM consumption (1.5gb to 57mb), compared to common NUT solution !!! (in real cases see below!)

<div align="center">
 <br>

[![RAM Cansumption report from reddit users](https://user-images.githubusercontent.com/10997022/218286171-fbd4e5b3-94e3-438f-badb-788c1f55af76.png)](https://www.reddit.com/r/SwitchPirates/comments/10ltfxe/tinfoilhat_a_open_source_nodejs_docker_app_to/)

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
      - NX_PORTS=5000 # ftp port used to sync saves
      # - UNAUTHORIZED_MSG= # message shown when credentials are incorrect
      # - NX_IPS= # devices ips that will be saves sync separated by ";"
      # - SAVE_SYNC_INTERVAL= # interval in millisseconds that will try sync saves < 5000 will stop sync
      # - NX_USER= # ftpd user
      # - NX_PASSWORD= # ftpd password

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

## Automatic Saves Backup using FTP

> How it works :

1. First you need backup your saves using Tinfoil or JKSV the folders path supported are `/JKSV` and `/switch/tinfoil/saves`

   > Both folders will be downloaded to `/<games_folder>/Saves/JKSV` and `/<games_folder>/Saves/Tinfoil` this will ensure these folders will be found by tinfoil app.

2. You need to serve your Switch files at network using ftpd

   ##### Setup sys-ftpd on the Switch

   - Install sys-ftpd - available as sys ftpd light in the Homebrew Menu
   - Install ovl-sysmodule from Homebrew Menu - optional but recommended

   Follow the sys-ftpd configuration to set up the user, password and port used for the FTP connection. Note these for Ownfoil configuration, as well as the IP of your Switch. If you installed ovl-sysmodule you can toggle on/off the FTP server using the Tesla overlay.

   It is recommended to test the FTP connection at least once with a regular FTP Client to make sure everything is working as expected on the switch.

3. To start sync saves inside Tinfoil app on switch connect and list the server homebrews to the server recongnize the switch IP and start sync

   - This will allow the server "capture" the switch device IP and start to syncing it

4. After first sync the server will fetch periodically using sync interval.

![Save Sync Diagram](/.diagrams/save%20sync.drawio.png)

## We want

- [ ] Organize and rename app listing by GAMEID
- [ ] Have a gui to override and customize TITLEID info on server-side json db
- [ ] Allow download torrent files from magnet link

## Images with Tinfoil

#### Setup Connection

![image](https://user-images.githubusercontent.com/10997022/214877049-8d369eb5-7440-4b22-9763-96da1c277f41.png)

#### when find server (save and restart tinfoil app)

![image](https://user-images.githubusercontent.com/10997022/214877143-e5a67dd8-939c-4a37-8763-619c1fa0b0d5.png)

## Which Tech Stack ?

- `express` | Serve Dynamically shop(.json|.tfl) with updated content at every refresh and serve files statically
- `serve-index` | To serve a rich listing of files (in case only shop.json shop.tfl for tinfoil)
- `json5` | To parse custom shop_template.jsonc (you can define on it custom content like a welcome message !!!)
