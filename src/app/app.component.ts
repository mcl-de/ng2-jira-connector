import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms'
import { Observable } from 'rxjs/Rx';

import { JiraconnectorService } from './jiraconnector/jiraconnector.service'

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent {
	public result: Observable<string>;
	public issueForm: FormGroup;
	public issuesForm: FormGroup;

	constructor(
		private _jiraconnector: JiraconnectorService,
		private _formBuilder: FormBuilder
	) {
		this.issueForm = this._formBuilder.group({
			issueId: [''],
		});
		this.issuesForm = this._formBuilder.group({
			jqlString: [''],
		});
	}

	public getIssue(id: string): void {
		this.result = this._jiraconnector.getIssue(id);
	}

	public getIssues(jqlString: string): void {
		this.result = this._jiraconnector.searchIssues(jqlString);
	}

}
