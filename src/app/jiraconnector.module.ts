import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { JiraconnectorService, JIRA_URL } from './jiraconnector.service';

@NgModule({
	declarations: [
	],
	imports: [
		BrowserModule,
		HttpModule
	],
	providers: [
		JiraconnectorService,
		{ provide: JIRA_URL, useValue: 'https://jira.foo.bar/rest/api/2/' },
	],
	bootstrap: []
})
export class JiraconnectorModule { }
