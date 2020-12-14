const core = require('@actions/core');
const github = require('@actions/github')
const JiraApi = require('jira-client')


try {
    const ref = github.context.payload.pull_request.head.ref;
    const payload = JSON.stringify(github.context.payload, undefined, 2)
    console.log(`Ref: ${ref}`);
    console.log(`JIRA_BASE_URL: ${process.env.JIRA_BASE_URL}`);
    console.log(`JIRA_USER_EMAIL: ${process.env.JIRA_USER_EMAIL}`);
    console.log(`JIRA_API_TOKEN: ${process.env.JIRA_API_TOKEN}`);
    
    let jira = new JiraApi({
        protocol: 'https',
        host: process.env.JIRA_BASE_URL,
        username: process.env.JIRA_USER_EMAIL,
        password: process.env.JIRA_API_TOKEN,
        apiVersion: '2',
        strictSSL: true
    });
    
    const input = core.getInput('search');
    const search = input ? input : ref;

    console.log(`Searching "${search}" for Jira ticket ID.`)
    
    const match = search.match(/([A-Za-z]{3}-\d{1,})/g)
    const issueNumber = match ? match[0] : null
    console.log(`Found: ${issueNumber}`)

    async function logIssueName() {
        try {
            const issue = await jira.findIssue(issueNumber);
            console.log(`Status: ${issue.fields.status.name}`);
        } catch (err) {
            console.error(err);
        }
    }
    
    core.setOutput("issueNumber", issueNumber);
    console.log(`The event payload: ${payload}`);
} catch (error) {
    core.setFailed(error.message);
}