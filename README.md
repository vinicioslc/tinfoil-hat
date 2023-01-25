# 📂 Tinfoil-Hat

Your Tinfoil static files served locally

With this thing Tinfoilers can serve all your NSP files in local network from a old computer

# Docker-compose for CasaOS

```yml
version: "3"
services:
  app:
    hostname: tinfoil-hat
    image: vinicioslc/tinfoil-hat:latest
    environment:
      - DEBUG=*
    ports:
      # Change to any port of your machine (7878 in that case) (dont change the :80 !!!)
      - 7878:80
      # you can now access on your browser http://localhost:7878 and see your games
    volumes:
      # path to your custom shop_template.jsonc used to show message on success or add authentication
      # - ./shop_template.jsonc:/shop_template.jsonc
      # path to your directory with games
      - c:/switch/titles:/games/
```

## Workflow

1. Serve all files statically inside path
2. Serve web interface to navigate like on PHP apache servers
3. Serve dynamically shop.json and shop.tfl as you place new games and files

## TO-DO

- [  ] Download torrent files from magnet link