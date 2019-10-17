# battery

![battery-widget](https://user-images.githubusercontent.com/550726/66969708-905dec80-f082-11e9-9ad5-84b9ab9b32d9.png)

| Refresh Frequency             | 10000                                                                   |
|-------------------------------|-------------------------------------------------------------------------|

This widget shows:
 - Battery charge status (pluggin in or disconnected from AC source)
 - Current charge percentage
 - Adaptive color status and icons to reflect the charge percentage

| Charge Percentage | Icon                      | Color  |
|-------------------|---------------------------|--------|
| >= 90%            | fa-battery-full           | <span style="color:blue">blue</span>   |
| >= 50 && < 90     | fa-battery-three-quarters | <span style="color:blue">blue</span>   |
| >= 25 && < 50     | fa-battery-half           | <span style="color:orange">orange</span> |
| >= 10 && < 25     | fa-battery-quarter        | <span style="color:yellow">yellow</span> |
| < 10              | fa-battery-empty          | <span style="color:red">red</span>    |