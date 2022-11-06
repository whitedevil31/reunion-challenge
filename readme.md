# TO RUN THE APP IN DEV MODE

npm run dev

# TO RUN THE APP IN PROD MODE

npm run start

# TO RUN THE APP IN TEST MODE

npm run test

# TO RUN THE DOCKERIZED APP

DOCKER HUB LINK : https://hub.docker.com/r/nanda31/reunion

docker-compose -f docker-compose-prod.yml up

# CONFIGURATION NEEDED TO RUN THE APP

Appropriate environment variables should be added in the .env file(root directory) and the DockerFile

All the testcases can be run by executing npm run test command
