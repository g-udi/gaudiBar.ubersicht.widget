# github

![github-widget](https://user-images.githubusercontent.com/550726/66969791-fd718200-f082-11e9-8408-702375f2442d.png)

| Refresh Frequency             | 1000000                                                                   |
|-------------------------------|-------------------------------------------------------------------------|

This widget shows:
 - Total number of notifications across comments, mentiond, assignments and code review requests

This widget pop-over shows number of notifications received for:
 - comment: you commented on the thread.
 - mention: you were specifically **@mentioned** in the content.
 - team_mention: you were on a team that was mentioned.
 - assign: you were assigned to the issue.
 - review_requested: You, or a team you're a member of, were requested to review a pull requesty

> For more information about Github notifications [check our their API docs](https://developer.github.com/v3/activity/notifications/#list-your-notifications).

## Requirements

In order for the data to be fetched correctly from the API, you need to create a file called `keys.secret.js` inside the github widget folder that will contain the Github username for whom you want to fetch the information for and a [token](https://github.com/settings/tokens). The file should look like:

```js
module.exports = {
    user: '<GITHUB_USERNAME>',
    apiKey: '<GITHUB_ACCESS_TOKEN>'
}
```
> For more information on creating a personal access token, check [this Github article](https://help.github.com/en/articles/creating-a-personal-access-token-for-the-command-line)

## Customization

This widget uses the [Octicons Font](https://octicons.github.com/) to display the icons for each secion defined in the `GITHUB_NOTIFICATIONS` map:

```js
const GITHUB_NOTIFICATIONS = {
    comment: {
        count: 0,
        icon: "broadcast"
    },
    mention: {
        count: 0,
        icon: "mention"
    },
    team_mention: {
        count: 0,
        icon: "gist-secret"
    },
    assign: {
        count: 0,
        icon: "git-branch"
    },
    review_requested: {
        count: 0,
        icon: "eye"
    },
    security_alert: {
        count: 0,
        icon: "stop"
    }
};
```
