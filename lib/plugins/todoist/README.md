# todoist

![todoist-widget](https://user-images.githubusercontent.com/550726/67053525-995dc500-f139-11e9-8b0f-93290666286d.png)

| Refresh Frequency             | 1000000                                                                   |
|-------------------------------|-------------------------------------------------------------------------|

This widget shows:
 - Total number of overdue tasks in [Todoist](https://todoist.com).

> This widget uses the `/rest/v1/tasks?filter=overdue` endpoint. You can [check their documentation](https://developer.todoist.com/rest/v8/#tasks) for more information.

## Requirements

In order for the data to be fetched correctly from the API, you need to create a file called `keys.secret.js` inside the todoist widget folder that will contain the Todoist API key. The file should look like:

```js
module.exports = {
    apiKey: '<TODOIST_API_KEY>'
}
```
> For more information on creating a personal access token, check [this instructions here](https://todoist.com/Users/viewPrefs?page=integrations)