# Ng2JiraConnector

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.0.0.

## Installation
Run `npm i --save ng2-jira-connector` to install the latest published version.
Import 'JiraconnectorModule' in your module and provide the URL to your JIRA instance in the providers array:
```
...
imports: [
	...
	JiraconnectorModule
],
providers: [
	...
	{provide: JIRA_URL, useValue: 'https://jira.mcl.de/rest/api/2/'}
],
...
```

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive/pipe/service/class/module`.

## Build

Run `npm run prepublishOnly` to build the project into the dist/ folder. You can then import it in your other modules.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
