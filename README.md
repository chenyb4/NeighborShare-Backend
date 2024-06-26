# NeighborShare Backend

The project will build a NodeJS application with JavaScript. Node and Express are used in the backend with JavaScript. MongoDB is used as the database to persist data.

## Table of contents

---
- [Description](#description)
- [Installation](#installation)
- [Docker Setup](#docker-setup)


## Description

---
The project is a NodeJs application with JavaScript as the language. The project uses ```npm``` as the package manager.


## Installation

---
First run the following command to use ```npm``` to install the packages.
```bash
npm install
```

### Running the application
Before running the application, you need to configure the database connection string in ```.env``` file in the root directory of the project. In the ```.env.example``` that you can already find in the root directory, there is an example with description in it on how to put the connection string to the right place. 

Make sure that the database instance is running. 

When these are all properly configured, run one of the following commands to start the application.

```bash
# watch mode during development
npm run dev
```
or
```bash
# production mode
npm start
```
>Note: Database transactions are used for this application. Please make sure that the database instance that you use for this application supoprts transactions. e.g. MongoDB Atlas supports it. 


## Docker Setup

---
There are two docker files in this project. They are:
- ```Dockerfile```: you can find this file in the root directory of the project. This is the docker file for the backend application.
- ```docker-compose.yml```: this is the docker compose file for the backend and database. You can find this file in the root directory of the project. 
- ```start.sh```: this is a script for building the docker images and running the docker containers in one click. 

For running the application using docker, please first make sure that you have docker installed on your computer. Then run the following two commands:

```bash
# Build the Docker images
docker-compose build
```
then 
```bash
# Start the containers
docker-compose up
```
>Note: If the docker containers cannot be started properly, please delete your ```node_modules``` directory and your ```package-lock.json``` file.

