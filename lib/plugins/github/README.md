# github

![github-widget](https://user-images.githubusercontent.com/550726/66969791-fd718200-f082-11e9-8408-702375f2442d.png)

| Refresh Frequency             | 300000                                                                    |
|-------------------------------|-------------------------------------------------------------------------|

This widget shows:
 - Total number of notifications across comments, mentions, assignments, code review requests and security alerts

This widget pop-over shows number of notifications received for:
 - comment: you commented on the thread.
 - mention: you were specifically **@mentioned** in the content.
 - team_mention: you were on a team that was mentioned.
 - assign: you were assigned to the issue.
 - review_requested: you, or a team you're a member of, were requested to review a pull request.
 - security_alert: GitHub discovered a security vulnerability in one of your repositories.

Only notifications you are participating in are fetched, 50 per page for up to 10 pages; fetching stops at the first page that is not full.

> For more information about Github notifications [check out their API docs](https://docs.github.com/en/rest/activity/notifications#list-notifications-for-the-authenticated-user).

## Requirements

Set `GAUDI_GITHUB_TOKEN` in the widget `.env` file. See the root `.env.example`. A classic personal access token needs the `notifications` scope. Without a token the widget stays hidden.

For more information on creating a personal access token, check [this Github article](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens).

## Customization

This widget uses the [Octicons Font](https://octicons.github.com/) to display the icons for each section defined in the `GITHUB_NOTIFICATIONS` map:

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
        icon: "gist-secret"
    }
};
```
