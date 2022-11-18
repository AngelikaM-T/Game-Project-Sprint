# Northcoders House of Games API

## Link to host
https://magnificent-hare-sheath-dress.cyclic.app/api/health

## Background

Following the link above will take you to the backend of a RESTFUL API built for the purpose of accessing application data programmatically. 

The intention here is to mimic the building of a real world backend service (such as reddit) which should provide this information to the front end architecture.

## Connect to repository 

In order to run this repository locally and successfully connect to each database, please set up the following files in your root: .env.development PGDATABASE=nc_games .env.test PGDATABASE=nc_games_test
*Please ensure that your env. files have been .gitignored.

To install all dependencies defined in the package.json script, please run NPM install in your terminal

## Seed database & Run the tests

These scripts (and others) can be found in the package.json. Seeding the database can be done by running the seed script (npm run seed) and tests can be run through npm run test.

## Software requirements

This API was built using Node.js version v18.8.0 and Postgres version 15 on Mac

