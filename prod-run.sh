#!/bin/bash
docker-compose -f docker-compose.yml -f docker-compose.production.yml --env-file ./.env.production up -d
