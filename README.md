# gaudi-widgets

gaudi-widgets are **extensible**, **adaptive** and **responsive** [Übersicht](http://tracesof.net/uebersicht/) system information bars. 

> tldr; Übersicht lets you run system commands and display their output on your desktop in little containers, called widgets

![Gaudi Widgets](https://user-images.githubusercontent.com/550726/66969790-fd718200-f082-11e9-99db-63ea5e96f98a.png)
*Screenshot of gaudi widgets on my desktop running [kitty](https://github.com/kovidgoyal/kitty) terminal*

The main decision behind developing gaudi was to allow usage of adaptive widgets. If you have been using Übersicht you will know that to customize the location of any widget, you had to dig into the code and position it<sup> _most probably with absolute position_</sup>. For the case of information bars, I did not find that to be a good experience especially when the information is dynamic e.g.,
 
 - Display Wi-Fi information where the network SSID can be long (you can work around this with a maximum width and text overflow .. but really?)
 - System Information, application and opened window names of varying lengths

... etc.

To overcome this, I have designed gaudi utilizing `flex` layout capabilities and using modules for each widget allowing the content to be:
 - **Extensible**: You can add/remove widgets using a centralized configuration file.
 - **Adaptive**: Information or appearance adapt to the context (e.g., location) of the user. For example, the weather widget automatically detects your location and shows the relevant weather condition for you or the battery widget background color changes to reflect the amount of charge left.
 - **Responsive**: The `flex` layout allows gaudi to adapt to different screen widths and number of widgets so that you can have a consistent look and feel to your desktop.

## Installation

Make sure you have [Übersicht](http://tracesof.net/uebersicht/) installed.

Then clone this repository.

```bash
# Make sure that this points to your widgets folder
$WIDGETS_HOME=$HOME/Library/Application\ Support/Übersicht/widgets/nerdbar.widget
git clone https://github.com/ahmadassaf/gaudi-widgets $WIDGETS_HOME
```
or to your current widget directory if you have changed it.
> You can always know your widgets folder by clicking on the Übersicht menu bar icon and clicking on *Open widgets folder*

Some widgets may require installing some additional packages, they are all documented under each widgets section below.

## Layout

![gaudi-layout](https://user-images.githubusercontent.com/550726/67003279-844f4a80-f0d5-11e9-888d-7c35400b6183.png)

The image above shows how gaudi overlays on your desktop: 
 - The main container covering the whole desktop
 - Two main `primary-bar` components on the top and bottom of the screen
 - Each `primary-bar` has three `secondary-bar` region (top, middle, right)
 - Each `secondary-bar` can contain N widgets that are distributed evenly

## Widgets

### stats

| Refresh Frequency             | 10000                                                                   |
|-------------------------------|-------------------------------------------------------------------------|

This widget shows:
 - Network upload and download traffic
 - Current memory and CPU percentage
 - Current free HDD space in GB 

#### Customization

In order to give a more accurate calculation for the CPU load you can define the number of cores in the `NUMBER_OF_CORES` variable.

### [date](https://github.com/ahmadassaf/gaudi-widgets/tree/master/lib/plugins/date)

| Refresh Frequency             | 10000                                                                   |
|-------------------------------|-------------------------------------------------------------------------|

This widget shows the current date.

### istats

| Refresh Frequency             | 10000                                                                   |
|-------------------------------|-------------------------------------------------------------------------|

This widget shows:
 - Fan speed (animated)
 - Current CPU temperature

#### Requirements

This widget required the [iStats](https://github.com/Chris911/iStats) Ruby gem to be installed.

In the case where you have multiple Ruby envs (using for example `rbenv`), you might need to specify the location for the `istats` binary by editing the variable `ISTATS_LOCATION` in `index.jsx`.

### [time](https://github.com/ahmadassaf/gaudi-widgets/tree/master/lib/plugins/time)

| Refresh Frequency             | 10000                                                                   |
|-------------------------------|-------------------------------------------------------------------------|

This widget shows the current time.

### [battery](https://github.com/ahmadassaf/gaudi-widgets/tree/master/lib/plugins/battery)

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

### [chunkwm](https://github.com/ahmadassaf/gaudi-widgets/tree/master/lib/plugins/chunkwm)

| Refresh Frequency             | 100                                                                   |
|-------------------------------|-------------------------------------------------------------------------|

This widget shows:
 - The current space [chunkwm](https://github.com/koekeishiya/chunkwm) mode (monocle, float or bsp)
 - The active window's window title (application name) <sup>and any sub name like file name or website name depending on the application</sup>
 - Adaptive color status and icons for applications

#### Configuration

This widget controls what icons are shown for each application and the color of the text for that application via two maps using [Font Awesome](https://fontawesome.com/) that are loaded by default with gaudi:

```js
const APPLICATIONS_ICONS = {
    "google chrome": "fab fa-chrome",
    "path finder": "fab fa-apple",
    "messages": "fas fa-comments",
    "fantastical 2": "fas fa-calendar",
    "kitty": "fas fa-terminal",
    "finder": "fab fa-apple",
    "system preferences": "fas fa-cogs",
    "station": "fab fa-artstation",
    "evernote": "fab fa-evernote",
    "todoist": "fa fa-list",
    "gitkraken": "fab fa-gitkraken",
    "spotify": "fab fa-spotify",
    "electron": "fab fa-codepen"
}
```
```js
const APPLICATIONS_COLORS = {
    "google chrome": "#be222f",
    "path finder": "##3385d7",
    "kitty": "#32cd32",
    "system preferences": "#867C85",
    "evernote": "#2dbe60",
    "todoist": "#db4c3f",
    "gitkraken": "#169287",
    "spotify": "#1db954",
    "electron": "#2c3e50"
}
```

You can customize those to your liking. The default icon used for applications is `fa-spinner`.

### [crypto](https://github.com/ahmadassaf/gaudi-widgets/tree/master/lib/plugins/crypto)

| Refresh Frequency             | 1000000                                                                   |
|-------------------------------|-----------------------------------------------------------------------

This widget shows:
 - The status of primary coins you track directly on the desktop
 - The icon of the crypto currecny fetched from [CryptoFont](https://cryptofont.com/) that is loaded in the widget.
 - A color code (green (increase) / red (decrease)) that indicates that change in price for the last 1 hour

This widget pop-over shows:
 - The status of the secondary coins on click

The widget make use of the [CoinMarketCap](https://coinmarketcap.com/) API `https://api.coinmarketcap.com/v1/ticker/`.

#### Configuration

The set of primary and secondary coins is configured via the `coins.js` file where you include the coin code as show below:

```js
module.exports =  {
    primary: ["btc", "xrp"],
    secondary: ["doge", "eth", "dash", "strat", "steem"]
};
```

### [github](https://github.com/ahmadassaf/gaudi-widgets/tree/master/lib/plugins/github)

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

#### Requirements

In order for the data to be fetched correctly from the API, you need to create a file called `keys.secret.js` inside the github widget folder that will contain the Github username for whom you want to fetch the information for and a [token](https://github.com/settings/tokens). The file should look like:

```js
module.exports = {
    user: '<GITHUB_USERNAME>',
    apiKey: '<GITHUB_ACCESS_TOKEN>'
}
```
> For more information on creating a personal access token, check [this Github article](https://help.github.com/en/articles/creating-a-personal-access-token-for-the-command-line)

#### Customization

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

### [prayertime](https://github.com/ahmadassaf/gaudi-widgets/tree/master/lib/plugins/prayerTime)

| Refresh Frequency             | 10000                                                                   |
|-------------------------------|-------------------------------------------------------------------------|

This widget shows:
 - The time for the upcoming prayer

This widget pop-over shows:
 - city and country for the current identified location
 - the prayer times for the current day in the identified location
 - the current (last) prayer time highlighted in green

> This widget makes use of the `geolocation.getCurrentPosition` function to get an accurate **current** location of the user. As a fallback you can adjust the `GEO_LOCATION` object

### [screens](https://github.com/ahmadassaf/gaudi-widgets/tree/master/lib/plugins/screens)

| Refresh Frequency             | 100                                                                   |
|-------------------------------|-------------------------------------------------------------------------|

This widget shows:
 - The desktop spaces available
 - Highlights the active desktop with a green background

### [spaces](https://github.com/ahmadassaf/gaudi-widgets/tree/master/lib/plugins/screens)

| Refresh Frequency             | 10000                                                                   |
|-------------------------------|-------------------------------------------------------------------------|

This widget shows the current desktop number that [chunkwm](https://github.com/koekeishiya/chunkwm) assigns.

### [todoist](https://github.com/ahmadassaf/gaudi-widgets/tree/master/lib/plugins/todoist)

| Refresh Frequency             | 1000000                                                                   |
|-------------------------------|-------------------------------------------------------------------------|

This widget shows:
 - Total number of overdue tasks in [Todoist](https://todoist.com).

> This widget uses the `/rest/v1/tasks?filter=overdue` endpoint. You can [check their documentation](https://developer.todoist.com/rest/v8/#tasks) for more information.

#### Requirements

In order for the data to be fetched correctly from the API, you need to create a file called `keys.secret.js` inside the todoist widget folder that will contain the Todoist API key. The file should look like:

```js
module.exports = {
    apiKey: '<TODOIST_API_KEY>'
}
```
> For more information on creating a personal access token, check [this instructions here](https://todoist.com/Users/viewPrefs?page=integrations)

#### Configuration

You can adjust various setting in the `CONFIGURATIONS` map:

 1. `calcMethod`: Calculation method

    Possible values:

        0: Ithna Ashari
        1: University of Islamic Sciences, Karachi
        2: Islamic Society of North America (ISNA)
        3: Muslim World League (MWL)
        4: Umm al-Qura, Makkah
        5: Egyptian General Authority of Survey
        6: Custom Setting
        7: Institute of Geophysics, University of Tehran

 2. `asrMethod`: Juristic Methods / Asr Calculation Methods:

    Possible values:

        0: Shafii (standard)
        1: Hanafi
        3. latitude  : Latitude
        4. longitude : Longitude
        5. timezone  : Timezone
 3. `timezone`: the current location timezone
 4. `location`: the city and country (set automatically from the geo object)
 5. `hoursformat12`: if false, times shows in 24Hour format, otherwise in 12Hour format (without AM/PM)
 6. `hideSunset`: as Mugrib and Sunset times are same, It is preffered to hide Sunset
 7. `hideSunrise`: hide sunrise time (default: `true`)


> Note: You can find your latitude/longitude [here](http://freegeoip.net/) or from google map or so.

### weather

| Refresh Frequency             | 10000                                                                   |
|-------------------------------|-------------------------------------------------------------------------|

This widget shows:

 - High/Low temperature in the current location
 - Icon that corresponds to the current weather conditions (rain, snow, fog, cloudy, wind, clear, mostly clear, partly cloudy, clear night, party cloudy night and unkown)

> This widget makes use of the `geolocation.getCurrentPosition` function to get an accurate **current** location of the user. As a fallback you can adjust the `GEO_LOCATION` object

#### Requirements

In order for the data to be fetched correctly from the API, you need to create a file called `keys.secret.js` inside the weather widget folder that will contain the [DarkSky](https://darksky.net/dev) API key. The file should look like:

```js
module.exports = {
    apiKey: '<DARKSKY_API_KEY>'
}
```

#### Customization

This widget uses [Font Awesome](https://fontawesome.com/) to display the icons for each secion defined in the `MAPPINGS` map:

```js
const MAPPINGS = {
    icons: {
        "rain"                :"fa-cloud-showers-heavy",
        "snow"                :"fa-snowflake",
        "fog"                 :"fa-smog",
        "cloudy"              :"fa-cloud",
        "wind"                :"fa-wind",
        "clear-day"           :"fa-sun",
        "mostly-clear-day"    :"fa-cloud-sun",
        "partly-cloudy-day"   :"fa-cloud-sun-rain",
        "clear-night"         :"fa-moon",
        "partly-cloudy-night" :"fa-cloud-moon",
        "unknown"             :"fa-temperature-high"
    }
}
```

### [stats](https://github.com/ahmadassaf/gaudi-widgets/tree/master/lib/plugins/stats)

| Refresh Frequency             | 10000                                                                   |
|-------------------------------|-------------------------------------------------------------------------|

This widget shows:
 - Network upload and download traffic
 - Current memory and CPU percentage
 - Current free HDD space in GB 

#### Customization

In order to give a more accurate calculation for the CPU load you can define the number of cores in the `NUMBER_OF_CORES` variable.

### [istats](https://github.com/ahmadassaf/gaudi-widgets/tree/master/lib/plugins/istats)

| Refresh Frequency             | 10000                                                                   |
|-------------------------------|-------------------------------------------------------------------------|

This widget shows:
 - Fan speed (animated)
 - Current CPU temperature

#### Requirements

This widget required the [iStats](https://github.com/Chris911/iStats) Ruby gem to be installed.

In the case where you have multiple Ruby envs (using for example `rbenv`), you might need to specify the location for the `istats` binary by editing the variable `ISTATS_LOCATION` in `index.jsx`.

### [network](https://github.com/ahmadassaf/gaudi-widgets/tree/master/lib/plugins/network)

| Refresh Frequency             | 10000                                                                   |
|-------------------------------|-------------------------------------------------------------------------|

This widget shows:
 - Icon to indicate whether the laptop is connected to an Ethernet network or WiFi
 - The SSID of the WiFi network if available

### [spotify](https://github.com/ahmadassaf/gaudi-widgets/tree/master/lib/plugins/spotify)

| Refresh Frequency             | 100                                                                   |
|-------------------------------|-------------------------------------------------------------------------|

This widget shows:
 - The current playing song in Spotify (song title and singer/band name)
 - Playback control buttons that are clickable:
   - pause/play
   - next song
   - prevoius song

#### Requirements
This widget depends on the [`shpotify`](https://github.com/hnarayanan/shpotify) command line spotify utility. 

> `shpotify` can be installed easily via `brew install shpotify`

# How it works:

## Übersicht

[Übersicht](http://tracesof.net/uebersicht/) creates a webview and places it on your desktop, just above the wallpaper but behind everything else. Übersicht widgets are written as `.coffee` or `.js` <sup>and other flavors like `.jsx`</sup>  files which let you format elements with html, style them with css and manipulate data with javascript and coffeescript. For dynamic widgets, Übersicht let's you run terminal commands and insert the output into html, so just about any language can be used to write scripts for widgets.

## Setting up the layout (widgets configuration)

The widgets are defined inside the `lib/plugins` folder and are loaded via the `lib.index.js` that exposes them.

```js
module.exports = {
    battery: require('./battery/index.jsx'),
    chunkwm: require('./chunkwm/index.jsx'),
    date: require('./date/index.jsx'),
    istats: require('./istats/index.jsx')
    ...
}
```

The layout of the widgets is configured via the `lib/configs.js`. You simply need to add the widget name in the designated area. **It is important to match the widget name entry with the widget name defined in the exports in `/lib/index.js` in order for it to load properly**. 

```js
module.exports = {
    top: {
        right: [
            "time",
            "battery",
            "network",
            "weather"
        ],
        middle: [
            "date"
        ],
        left: [
            "crypto",
            "github",
            "todoist",
            "spaces"
        ]
    },
    bottom: {
        right: [
            "stats",
            "istats"
        ],
        middle: [
            "screens"
        ],
        left: [
            "chunkwm"
        ]
    }
}
```

# Writing Widgets

In essence, widgets are JavaScript modules that expose a few key properties and methods. They need to be defined in a single file with a `.jsx` extension for Übersicht to pick them up.

Widget rendering is done using [React](https://reactjs.org) and it's [JSX](https://reactjs.org/docs/introducing-jsx.html) syntax. Simple widget state is managed for you by Übersicht, but for more advanced widgets you can manage state using a Redux-like pattern. You `dispatch` events, which get processed by a single `updateState` function which returns the new state, which is passed to the render function of your widget.

State is kept when you modify your widget, which allows for live coding. Any changes to the UI of your widget will be immediatly visible.  One drawback (at least with the current implementation) is that if you change the shape of your state you might have to 'Refresh all Widgets' from the app menu for your widget to work.

You can also include node modules and split your widget into separate files using [ESM syntax](http://2ality.com/2014/09/es6-modules-final.html).

For the full official docs [check out Übersicht README](https://github.com/felixhageloh/uebersicht#command).


## Widget Skeleton

In essence, every widget needs to expose a `render` function that outputs a `jsx` object. Similar to any Übersicht widget the `run` function is what will execute the command you wish and then outputs the `jsx` that will be rendered in the master layout.

The `refreshFrequency` <sup>defined in ms</sup> constant is used to allow gaudi to know when it has to `run` the widget again in order to get new output. 

The output of the `run` function has to be wrapped in `<div>` with class `gaudi-bar-section-widget`. 

```js

import { run } from "uebersicht"

export const refreshFrequency= 10000;

export const render = () => {

    return run(`COMMAND`).then((output) => {

        return (<div className='gaudi-bar-section-widget'>{output}</div>)

    })
}
```

If you wish to add custom CSS as well to your widget then you can also import `css`:

```js
import { run, css } from "uebersicht"

const CUSTOM_CSS = css`background: #06F`

return (
    <div className={`gaudi-bar-section-widget ${CUSTOM_CSS}`}></div>
)
```
The best way would be to check the widgets directory `lib/plugins` and get inspiration on the various use cases.

### Hover/Click context

Sometimes there are lots of information that you want to show on demand rather than always. the [crypto](https://github.com/ahmadassaf/gaudi-widgets/tree/master/lib/plugins/crypto), [prayerTime](https://github.com/ahmadassaf/gaudi-widgets/tree/master/lib/plugins/prayerTime) and [github](https://github.com/ahmadassaf/gaudi-widgets/tree/master/lib/plugins/github) widgets both make use of that by only showing a subset of information and the rest hidden in an on-click pop-up. 

To make use of the on-click pop-up you can add in your widget a `details` view you can do:

```jsx
<span className='gaudi_crypto_details'>
    {
        return (
            <span key={index} className="gaudi_crypto_detail">
                <span className={`gaudi-icon cf cf-${_secondaryCoin.symbol.toLowerCase()}`}></span>
                <span className={_secondaryCoin.percent_change_1h > 0 ? 'gaudi-crypto-green' : 'gaudi-crypto-red'}>${roundPrice(_secondaryCoin.price_usd, 4)} </span>
            </span>
        )
    }
</span>
```
and then in your stylesheet add:

```css
.gaudi_crypto_details {
    position: absolute;
    top: 30px;
    left: 0;
    visibility: hidden;
    display: flex;
}

.gaudi_crypto_detail {
    display: table;
    background: #000;
    padding: 3px 8px;
    border: 1px solid rgb(122, 122, 122);
    font-size: 10px;
}

.gaudi_crypto_detail:first-of-type {
    border-top-left-radius: 3px;
    border-bottom-left-radius: 3px;
}

.gaudi_crypto_detail:last-of-type {
    border-top-right-radius: 3px;
    border-bottom-right-radius: 3px
}
```
of course you can customize this to your liking, but I hope you got the main idea.

### Geo-localized widgets

You have access to the built in `geolocation` API like:

```js
geolocation.getCurrentPosition((weather)=> {
    
    GEO_LOCATION = {
        latitude: weather.position.coords.latitude,
        longitude: weather.position.coords.longitude,
        city: weather.address.city,
        country: weather.address.country
    }
});
```
### Fonts and Icons

[Font Awesome](https://fontawesome.com/) is loaded as part of gaudi and you can add any font that you wish in `/lib/fonts` and have global access to them across gaudi widgets.

```js
<span className={`fas fa-plug gaudi-icon`}></span>
```
