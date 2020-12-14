const core = require('@actions/core')

try {
    const search = core.getInput('search');
    console.log(`Searching "${search}" for Jira ticket ID.`)

    const match = search.match(/([A-Za-z]{3}-\d{1,})/g)
    const ticket_id = match ? match[0] : null
    console.log(`Found: ${ticket_id}`)
    
    core.setOutput("ticket_id", ticket_id);
} catch (error) {
    core.setFailed(error.message);
}