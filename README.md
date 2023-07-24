# Projektgruppe2

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 13.2.2.

In order to start this project, you need to have nodejs installed.
With nodejs follow these instructions to install angular cli: https://angular.io/cli

## Development server

## Prerequisites

npm must be installed.

###Frontend:

1. npm install ngx-material-timepicker
2. npm install forms-module
3. npm install tslib

###Backend:

1. npm install
2. npm install mysql2
3. npm install bcrypt
4. npm install jsonwebtoken
5. npm install validator
6. npm install cors

# Start Backend

Download MySQL Server and MySQL Workbench. Start Server and connect to Workbench. To ensure connectivity to database the name of the database should be 'fishdb' and the Password 'Fish_2023'.
In your MySQL Workbench go to Data Import and select "Import From Self Contained File". Create a new schema called 'fishdb'. For the File Path choose either "FishDatabase_Empty" or "FishDatabase_WithSampleUsers" from the folder "Backend" and then click on "Start Import".
After a successful import open the terminal and change your directory to the "Backend" folder. In this directory use the command "node app" to connect to your server. In your terminal you should receive confirmation that the server is running and your backend is now functional.

# Start Angular Frontend

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

