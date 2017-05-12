import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component'
import { JiraconnectorModule } from './jiraconnector/jiraconnector.module';
import { JIRA_URL } from './jiraconnector/jiraconnector.service';

@NgModule({
	declarations: [
		AppComponent
	],
	imports: [
		BrowserModule,
		ReactiveFormsModule,
		HttpModule,
		JiraconnectorModule
	],
	providers: [
		{provide: JIRA_URL, useValue: 'https://jira.foo.bar/rest/api/2/'},
	],
	bootstrap: [AppComponent]
})
export class AppModule { }
