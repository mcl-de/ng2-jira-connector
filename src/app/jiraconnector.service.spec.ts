import { async, fakeAsync, tick } from '@angular/core/testing';
import { ReflectiveInjector } from '@angular/core';
import { BaseRequestOptions, ConnectionBackend, Http, ResponseOptions, Response, ResponseType, RequestOptions } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { JiraconnectorService, JIRA_URL } from './jiraconnector.service';

describe('JiraconnectorService', () => {
	let lastConnection: MockConnection;
	beforeEach(async(() => {
		this.jiraUrl = 'https://jira.foo.bar/rest/api/2'
		this.injector = ReflectiveInjector.resolveAndCreate([
			{provide: ConnectionBackend, useClass: MockBackend},
			{provide: RequestOptions, useClass: BaseRequestOptions},
			{provide: JIRA_URL, useValue: this.jiraUrl},
			JiraconnectorService,
			Http
		])
		this.connector = this.injector.get(JiraconnectorService);
		this.backend = this.injector.get(ConnectionBackend) as MockBackend;
		this.backend.connections.subscribe((connection: MockConnection) => lastConnection = connection);
	}));

	it('should set the jiraUrl via the InjectionToken', () => {
		expect(this.connector.jiraUrl).toEqual(this.jiraUrl);
	});

	it('should set the "Content-type" in the headers to "application/json"', () => {
		expect(this.connector.headers.get('Content-type')).toEqual('application/json');
	});

	it('should encode basic authentication parameters to base64', () => {
		this.connector.setBasicAuthorization('foo', 'bar');
		let base64 = window.btoa('foo:bar');
		expect(this.connector.headers.get('Authorization')).toEqual('Basic ' + base64);
	});

	it('should send a request to jira with getIssue()', () => {
		this.connector.getIssue('FOO-123');
		expect(lastConnection).toBeDefined();
		expect(lastConnection.request.url).toMatch(this.jiraUrl);
	});

	it('should create a comment with createComment()', fakeAsync(() => {
		let result: any;
		let comment: String = 'foobar';
		this.connector.createComment('FOO-123', comment).then((res) => result = res);
		lastConnection.mockRespond(
			new Response(
				new ResponseOptions({
					status: 200,
					body: {
						body: comment
					}
				})
			)
		);
		tick();
		expect(result.body).toEqual(comment);
	}));

	it('should call handleError() if createComment() errors', fakeAsync(() => {
		let result: any;
		spyOn(this.connector, 'handleError');
		this.connector.createComment('FOO-123', 'foobar')
			.then((res) => result = res)
			.catch((error) => console.log(error));
		lastConnection.mockError(new Error('some error'));
		tick();
		expect(this.connector.handleError).toHaveBeenCalled();
	}));

	it('should get an issue with getIssue()', fakeAsync(() => {
		let result: any;
		this.connector.getIssue('FOO-123').then((res) => result = res);
		lastConnection.mockRespond(
			new Response(
				new ResponseOptions({
					status: 200,
					body: {
						fields: {
							summary: "Test",
							description: "Test test test",
							status: {
								name: "Closed"
							}
						},
						id: "10000",
						key: "FOO-123",
						self: this.jiraUrl + '/issue/10000'
					}
				})
			)
		);
		tick();
		expect(result.key).toEqual('FOO-123');
		expect(result.fields.summary).toBeDefined();
	}));

	it('should call handleError() if getIssue() errors', fakeAsync(() => {
		let result: any;
		spyOn(this.connector, 'handleError');
		this.connector.getIssue('FOO-123')
			.then((res) => result = res)
			.catch((error) => console.log(error));
		lastConnection.mockError(new Error('some error'));
		tick();
		expect(this.connector.handleError).toHaveBeenCalled();
	}));

	it('should create an issue with createIssue()', fakeAsync(() => {
		let result: any;
		this.connector.createIssue({
			project: {
				key: 'Foo'
			},
			issuetype: {
				id: 1
			},
			summary: 'Test',
			labels: [
				'Bar'
			]
		}).then((res) => result = res);
		lastConnection.mockRespond(
			new Response(
				new ResponseOptions({
					status: 200,
					body: {
						id: "10000",
						key: "FOO-456",
						self: this.jiraUrl + '/issue/10000'
					}
				})
			)
		);
		tick();
		expect(result.key).toEqual('FOO-456');
	}));

	it('should call handleError() if createIssue() errors', fakeAsync(() => {
		let result: any;
		spyOn(this.connector, 'handleError');
		this.connector.createIssue({
			project: {
				key: 'Foo'
			},
			issuetype: {
				id: 1
			},
			summary: 'Test',
			labels: [
				'Bar'
			]
		})
			.then((res) => result = res)
			.catch((error) => console.log(error));
		lastConnection.mockError(new Error('some error'));
		tick();
		expect(this.connector.handleError).toHaveBeenCalled();
	}));

	it('should get several issues with searchIssues()', fakeAsync(() => {
		let result: any;
		this.connector.searchIssues('project = Foo AND labels = Bar AND status != Closed').then((res) => result = res);
		lastConnection.mockRespond(
			new Response(
				new ResponseOptions({
					status: 200,
					body: {
						issues: [
							{
								id: "1",
								key: "FOO-1",
								fields: {
									labels: [
										'Bar'
									]
								}
							},
							{
								id: "2",
								key: "FOO-2",
								fields: {
									labels: [
										'Bar'
									]
								}
							},
							{
								id: "3",
								key: "FOO-3",
								fields: {
									labels: [
										'Bar'
									]
								}
							},
						],
						total: 3,
					}
				})
			)
		);
		tick();
		expect(result.total).toEqual(result.issues.length);
		expect(result.issues[0].fields.labels[0]).toEqual('Bar');
	}));

	it('should call handleError() if searchIssues() errors', fakeAsync(() => {
		let result: any;
		spyOn(this.connector, 'handleError');
		this.connector.searchIssues('project = Foo AND labels = Bar AND status != Closed')
			.then((res) => result = res)
			.catch((error) => console.log(error));
		lastConnection.mockError(new Error('some error'));
		tick();
		expect(this.connector.handleError).toHaveBeenCalled();
	}));

	it('should return an error with handleError()', fakeAsync(() => {
		let result: any;
		let error: any;
		this.connector.handleError(new Error('some error'))
			.then((res) => result = res)
			.catch((err) => error = err);
		tick();
		expect(result).toBeUndefined();
		expect(error).toBeDefined();
	}));
});
