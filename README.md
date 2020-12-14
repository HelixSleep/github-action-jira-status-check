# Jira Status Checker action

This action checks to see if the Jira issue's status is correct.

## Inputs

### `search`

The string to search of an Jira issue number. Optional. Default `[PULL REQUEST HEAD REF]`.

### `status`

The status to match against. Optional. Default `"Under Code Review"`.

## Outputs

### `issueNumber`

The Jira issue number found.

### `status`

The status of the Jira issue.

## Example usage

uses: HelixSleep/github-action-jira-status-check@1.0
with:
    issueNumber: 'LEG-100' # Optional. Will look for ticket ID in branch name if not provided.
    status: 'QA Review' # Optional. Defaults to 'Under Code Review'.
