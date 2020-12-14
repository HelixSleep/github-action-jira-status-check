const core = require('@actions/core');
const github = require('@actions/github')
const JiraApi = require('jira-client')


try {
    const input = core.getInput('search');
    const search = input ? input : github.context.payload.pull_request.head.ref;

    const statusMatchInput = core.getInput('status');
    const statusMatch = statusMatchInput ? statusMatchInput : 'Under Code Review';
    
    console.log(`Searching "${search}" for Jira issue number.`)

    let jira = new JiraApi({
        protocol: 'https',
        host: process.env.JIRA_BASE_URL,
        username: process.env.JIRA_USER_EMAIL,
        password: process.env.JIRA_API_TOKEN,
        apiVersion: '2',
        strictSSL: true
    });    
    
    const match = search.match(/([A-Za-z]{3}-\d{1,})/g)
    const issueNumber = match ? match[0] : null
    
    if (!issueNumber) {
        console.log('No issue number found. Assuming ready.')
        return;
    }
    
    console.log(`Issue number found: ${issueNumber}`)
    
    jira.findIssue(issueNumber)
        .then(issue => {
            const statusFound = issue.fields.status.name;
            console.log(`Status: ${statusFound}`);
            core.setOutput("status", statusFound);

            core.setOutput("issueNumber", issueNumber);

            if (statusFound !== statusMatch) {
                core.setFailed(`Status must be "${statusMatch}". Found "${statusFound}".`);
            }

            const payload = JSON.stringify(github.context.payload, undefined, 2)
            console.log(`The event payload: ${payload}`);
        })
        .catch(err => {
            console.error(err);
            core.setFailed(error.message);
        });
} catch (error) {
    core.setFailed(error.message);
}