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

### battery

![battery-widget](https://user-images.githubusercontent.com/550726/66969708-905dec80-f082-11e9-9ad5-84b9ab9b32d9.png)

> Shows the battery charging status and percentage

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
            "wifi",
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
