## Getting Started

### Clone the repository:

```bash
git clone git@github.com:bmathews42/vinyl_tracker
```

### Create a `.env` file:

Using the `.env.example` file as a template, create a .env file in the root directory of the project. This file will contain the environment variables needed to run the app.

### Install the dependencies:

```bash
npm install
```

### Start your mySql server:

You can either install/run your own mySql server link here: https://dev.mysql.com/downloads/installer/
Or (if you know how to use docker) you can run the following command to start a mySql server in a docker container:

```bash
docker compose up --build
```

### Start the app:

```bash
npm start
```
