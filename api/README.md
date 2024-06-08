## Setup project

### Install dependencies

```bash 
npm install
```

### Create .env file

```bash
mv .env.example .env
```

### Database

#### Before you can start the server, you need to have a running postgres database. You can use docker to run a postgres database.

#### In the **root directory** of the project, there is a docker-compose file that you can use to run a postgres database.

#### to use the docker-compose file, run the following command:

```bash
docker-compose up -d
```
