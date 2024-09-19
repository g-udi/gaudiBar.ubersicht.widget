# gaudi-widgets

gaudi-widgets are **extensible**, **adaptive** and **responsive** [Übersicht](http://tracesof.net/uebersicht/) system information bars. 

> tldr; Übersicht lets you run system commands and display their output on your desktop in little containers, called widgets

![2024-09-19 16 59 13](https://github.com/user-attachments/assets/c8421565-4339-4432-80a2-61b4a8533cee)
*Screenshot of gaudi widgets on my desktop running [Cursor](https://www.cursor.com/) and [kitty](https://github.com/kovidgoyal/kitty) terminal*

The main decision behind developing gaudi was to allow usage of adaptive widgets. If you have been using Übersicht you will know that to customize the location of any widget, you had to dig into the code and position it<sup> _most probably with absolute position_</sup>. For the case of information bars, I did not find that to be a good experience especially when the information is dynamic e.g.,
 
 - Display Wi-Fi information where the network SSID can be long (you can work around this with a maximum width and text overflow .. but really?)
 - System Information, application and opened window names of varying lengths

... etc.

To overcome this, I have designed gaudi utilizing `flex` layout capabilities and using modules for each widget allowing the content to be:
 - **Extensible**: You can add/remove widgets using a centralized configuration file.
 - **Adaptive**: Information or appearance adapt to the context (e.g., location) of the user. For example, the weather widget automatically detects your location and shows the relevant weather condition for you or the battery widget background color changes to reflect the amount of charge left.
 - **Responsive**: The `flex` layout allows gaudi to adapt to different screen widths and number of widgets so that you can have a consistent look and feel to your desktop.

 ## Widgets
 - [battery](https://github.com/g-udi/gaudiBar.widget/tree/master/lib/plugins/battery)
 - [crypto](https://github.com/g-udi/gaudiBar.widget/tree/master/lib/plugins/crypto)
 - [date](https://github.com/g-udi/gaudiBar.widget/tree/master/lib/plugins/date)
 - [dnd](https://github.com/g-udi/gaudiBar.widget/tree/master/lib/plugins/dnd)
 - [github](https://github.com/g-udi/gaudiBar.widget/tree/master/lib/plugins/github)
 - [network](https://github.com/g-udi/gaudiBar.widget/tree/master/lib/plugins/network)
 - [prayertime](https://github.com/g-udi/gaudiBar.widget/tree/master/lib/plugins/prayerTime)
 - [stats](https://github.com/g-udi/gaudiBar.widget/tree/master/lib/plugins/stats)
 - [weather](https://github.com/g-udi/gaudiBar.widget/tree/master/lib/plugins/weather)
 - [yabai](https://github.com/g-udi/gaudiBar.widget/tree/master/lib/plugins/yabai) 

## Installation

Make sure you have [Übersicht](http://tracesof.net/uebersicht/) installed.

Then clone this repository.

```bash
# Make sure that this points to your widgets folder
$WIDGETS_HOME=$HOME/Library/Application\ Support/Übersicht/widgets/
git clone https://github.com/ahmadassaf/gaudi.widgets $WIDGETS_HOME/gaudi.widgets
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
        ]
    },
    bottom: {
        right: [
            "stats"
        ],
        middle: [
        ],
        left: [
            "yabai"
        ]
    }
}
```

# Credits & Inspirations
 - [nerdbar.widget](https://github.com/apierz/nerdbar.widget)
 - [bar](https://github.com/callahanrts/bar)
 - [darksky.widget](https://github.com/DeltaOS2/darksky.widget)
 - [prayer-time-widget](https://github.com/ashikahmad/prayer-time-widget)
 - [istats.widget](https://github.com/roele/istats.widget)
