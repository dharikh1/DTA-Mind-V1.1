# Dtamind Docker Hub Image

Starts Dtamind from [DockerHub Image](https://hub.docker.com/r/dtamindai/dtamind)

## Usage

1. Create `.env` file and specify the `PORT` (refer to `.env.example`)
2. `docker compose up -d`
3. Open [http://localhost:3000](http://localhost:3000)
4. You can bring the containers down by `docker compose stop`

## 🌱 Env Variables

If you like to persist your data (flows, logs, credentials, storage), set these variables in the `.env` file inside `docker` folder:

-   DATABASE_PATH=/root/.dtamind
-   LOG_PATH=/root/.dtamind/logs
-   SECRETKEY_PATH=/root/.dtamind
-   BLOB_STORAGE_PATH=/root/.dtamind/storage

Dtamind also support different environment variables to configure your instance. Read [more](https://docs.dtamindai.com/environment-variables)

## Queue Mode:

### Building from source:

You can build the images for worker and main from scratch with:

```
docker compose -f docker-compose-queue-source.yml up -d
```

Monitor Health:

```
docker compose -f docker-compose-queue-source.yml ps
```

### From pre-built images:

You can also use the pre-built images:

```
docker compose -f docker-compose-queue-prebuilt.yml up -d
```

Monitor Health:

```
docker compose -f docker-compose-queue-prebuilt.yml ps
```

