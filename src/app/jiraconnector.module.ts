import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { JiraconnectorService, JIRA_URL } from './jiraconnector.service';

@NgModule({
	declarations: [],
	imports: [
		HttpModule
	],
	providers: [JiraconnectorService],
	bootstrap: []
})
export class JiraconnectorModule { }
