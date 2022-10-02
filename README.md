# Misskey Connector
## Node.js automatic client to repost your notes from Misskey to Twitter
***Note:*** *this repository is under active development, try to keep updating. I'm actively fixing bugs and adding new features*

### Usage:
- Pull this repository
- Convert .env to .env.development and .env.production, if you will use this script only as-is, your main file is .env.production
- Write down your credentials into .env.files
- Deploy edited repository to server, set prod-run.sh to executable and run prod-run.sh bash script

### Development:
- Pull this repository
- Convert .env into .env.development
- Run codebase with `docker-compose up`

### Roadmap
- Add Twitter V2 API OAUTH support
- ~~Add support for Facebook connection, conversion notes to FB posts~~
  - Posting directly to FB is not possible ATM due the API restrictions
- Add MongoDB database for managing multiple accounts - ***Active development***
- Add Misskey multiaccount support - ***Active development***
- Add support for Facebook pages API - ***Active development***
- Refactor codebase to OOP classes - ***Coming soon later this year***
- ~~Simple config dashboard and service endpoints~~
- Make out of box docker container support for easy server installation
- Add Github CI/CD support out of box

### Used technology:
- Docker
- MongoDB
- NodeJS
- Express
- Twitter 1 API
- Facebook Graph API ***Coming soon***
- Official Misskey API library

### Warning
Never share to repository your credential data from social sites API!

![MK Mascot](https://i.pinimg.com/564x/0e/38/46/0e3846c009b086f106ea98cf82c9a653.jpg)
