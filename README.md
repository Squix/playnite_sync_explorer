# Playnite sync explorer
This is a very simple web ui for [Playnite Sync Server](https://github.com/Yalgrin/playnite-simple-sync-server) by @Yalgrin.

It connects directly to the postgresdb storing your games data.
Hence, it is recommended for security and simplicity to run this project in a **docker compose stack**, with the db and the playnite-sync-server.

It uses Deno2, Fresh and Preact.

### Usage

1. Clone the repo
2. Build the image with `docker build -t playnite-sync-explorer`
3. Create a docker-compose.yaml with this content:

```(yaml)
services:
    playnite-sync-explorer:
        image : 'playnite-sync-explorer'
        environment:
            - DENO_DEPLOYMENT_ID=random_string
            - DATABASE_URL=postgres://playnite-db/playnite?user=playnite&password=playnite
        ports:
            - "3000:3000"
        depends_on:
            - playnite-db
    playnite-sync-server:
        image: 'yalgrin/playnite-simple-sync-server:0.1.3'
        container_name: playnite-simple-sync-server
        hostname: playnite-simple-sync-server
        restart: unless-stopped
        logging:
        options:
            max-size: 10m
        volumes:
            - 'Playnite-Sync-Server/metadata/:/app/metadata'
            - 'Playnite-Sync-Server/logs/:/app/logs'
        environment:
            SYNC_SERVER_PORT: 8093
            SYNC_SERVER_LOG_DIR: /app/logs/
            SYNC_SERVER_DB_HOST: playnite-db
            SYNC_SERVER_DB_PORT: 5432
            SYNC_SERVER_DB_NAME: playnite
            SYNC_SERVER_DB_USER: playnite
            SYNC_SERVER_DB_PASSWORD: playnite
            SYNC_SERVER_MAX_FILE_SIZE: 100MB
            SYNC_SERVER_METADATA_FOLDER: /app/metadata
        ports:
            - '8093:8093'
        depends_on:
            - playnite-db
    playnite-db:
        image: 'postgres:17.5'
        container_name: playnite-db
        hostname: playnite-db
        restart: unless-stopped
        logging:
            options:
            max-size: 10m
        volumes:
            - 'Playnite-Sync-Server/postgres/data/:/var/lib/postgresql/data'
        environment:
            POSTGRES_DB: playnite
            POSTGRES_USER: playnite
            POSTGRES_PASSWORD: playnite
```
