# istats

![istats-widget](https://user-images.githubusercontent.com/550726/67034406-8504d280-f10f-11e9-9771-8e90aaae5c75.gif)

| Refresh Frequency             | 10000                                                                   |
|-------------------------------|-------------------------------------------------------------------------|

This widget shows:
 - Fan speed (animated)
 - Current CPU temperature

## Requirements

This widget required the [iStats](https://github.com/Chris911/iStats) Ruby gem to be installed.

In the case where you have multiple Ruby envs (using for example `rbenv`), you might need to specify the location for the `istats` binary by editing the variable `ISTATS_LOCATION` in `index.jsx`.