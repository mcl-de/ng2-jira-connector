import { Inject, Injectable, InjectionToken } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/toPromise';

export interface IProjectPartial {
	id?: string|number;
	key?: string;
	name?: string;
}
export interface IIssuePriority {
	id?: string|number;
	name?: string;
}
export interface IIssueType {
	description?: string;
	id?: string|number;
	name?: string;
	subtask?: boolean;
}
export interface IIssueFields {
	components?: any[];
	description?: string;
	duedate?: any;
	issuetype: IIssueType;
	labels?: any[];
	priority?: IIssuePriority;
	project: IProjectPartial,
	summary: string;
}

export const JIRA_URL = new InjectionToken<string>('JiraUrl');

@Injectable()
export class JiraconnectorService {
	public headers: Headers = new Headers({'Content-type': 'application/json'});

	constructor(
		private _http: Http,
		@Inject(JIRA_URL) public jiraUrl: string
	) { }

	public setBasicAuthorization(username: string, password: string): void {
		this.headers.append('Authorization', 'Basic ' + window.btoa(`${username}:${password}`));
	}

	public createComment(issueId: string, comment: string): Promise<any> {
		return this._http.post(this.jiraUrl + 'issue/' + issueId + '/comment', JSON.stringify({ body: comment }), { headers: this.headers, withCredentials: true })
			.toPromise()
			.then((response) => response.json())
			.catch((error) => this.handleError(error));
	}

	public createIssue(fields: IIssueFields): Promise<any> {
		return this._http.post(this.jiraUrl + 'issue', JSON.stringify({ fields: fields }), { headers: this.headers, withCredentials: true })
			.toPromise()
			.then((response) => response.json())
			.catch((error) => this.handleError(error));
	}

	public getIssue(issueId: string): Promise<any> {
		return this._http.get(this.jiraUrl + 'issue/' + issueId, { withCredentials: true })
			.toPromise()
			.then((response) => response.json())
			.catch((error) => this.handleError(error));
	}

	public searchIssues(jqlString: string): Promise<any> {
		return this._http.post(this.jiraUrl + 'search', { jql: jqlString }, { withCredentials: true })
			.toPromise()
			.then((response) => response.json())
			.catch((error) => this.handleError(error));
	}

	public handleError(error: any): Promise<any> {
		return Promise.reject(error.message || error);
	}
}
