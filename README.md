# gaudiBar

gaudiBar is a set of **extensible**, **adaptive** and **responsive** [Übersicht](http://tracesof.net/uebersicht/) system information bars, built from small widgets.

> tldr; Übersicht lets you run system commands and display their output on your desktop in little containers, called widgets.

![2024-09-19 16 59 13](https://github.com/user-attachments/assets/c8421565-4339-4432-80a2-61b4a8533cee)
*Screenshot of gaudiBar on my desktop running [Cursor](https://www.cursor.com/) and [kitty](https://github.com/kovidgoyal/kitty) terminal.*

The main decision behind developing gaudi was to allow usage of adaptive widgets. If you have been using Übersicht you will know that to customize the location of any widget, you had to dig into the code and position it, most probably with absolute positioning. For the case of information bars, I did not find that to be a good experience especially when the information is dynamic, for example:

- Display Wi-Fi information where the network SSID can be long.
- Display system information, application names, and opened window titles of varying lengths.

To overcome this, gaudi uses `flex` layout capabilities and a module per widget so the bar can be:

- **Extensible**: You can add/remove widgets using a centralized configuration file.
- **Adaptive**: Information or appearance adapts to context. For example, the weather widget can use your configured city, and the battery widget background changes based on the amount of charge left.
- **Responsive**: The `flex` layout adapts to different screen widths and widget counts so the desktop keeps a consistent look and feel.

## Widgets

- [battery](https://github.com/g-udi/gaudiBar.ubersicht.widget/tree/main/lib/plugins/battery)
- [crypto](https://github.com/g-udi/gaudiBar.ubersicht.widget/tree/main/lib/plugins/crypto)
- [date](https://github.com/g-udi/gaudiBar.ubersicht.widget/tree/main/lib/plugins/date)
- [dnd](https://github.com/g-udi/gaudiBar.ubersicht.widget/tree/main/lib/plugins/dnd)
- [github](https://github.com/g-udi/gaudiBar.ubersicht.widget/tree/main/lib/plugins/github)
- [network](https://github.com/g-udi/gaudiBar.ubersicht.widget/tree/main/lib/plugins/network)
- [prayerTime](https://github.com/g-udi/gaudiBar.ubersicht.widget/tree/main/lib/plugins/prayerTime)
- [stats](https://github.com/g-udi/gaudiBar.ubersicht.widget/tree/main/lib/plugins/stats)
- [time](https://github.com/g-udi/gaudiBar.ubersicht.widget/tree/main/lib/plugins/time)
- [weather](https://github.com/g-udi/gaudiBar.ubersicht.widget/tree/main/lib/plugins/weather)
- [yabai](https://github.com/g-udi/gaudiBar.ubersicht.widget/tree/main/lib/plugins/yabai)

## Installation

Make sure you have [Übersicht](http://tracesof.net/uebersicht/) installed.

Clone this repository into your Übersicht widgets folder:

```sh
widgets_dir="$HOME/Library/Application Support/Übersicht/widgets"
git clone https://github.com/g-udi/gaudiBar.ubersicht.widget "$widgets_dir/gaudiBar.ubersicht.widget"
```

You can always find your widgets folder by clicking the Übersicht menu bar icon and choosing **Open Widgets Folder**.

The folder name is not significant: the widget looks up its own folder at runtime, so a clone under another name keeps its styles, fonts and scripts.

Some widgets require optional tools or credentials. Each widget documents its own requirements under `lib/plugins/<plugin>/README.md`.

## Configuration

The layout is controlled by `lib/configs.js`. Add widget names to the area where you want them to appear:

```js
module.exports = {
    top: {
        right: [
            "dnd",
            "time",
            "battery",
            "network"
        ],
        middle: [
        ],
        left: [
            "weather",
            "crypto",
            "github",
            "prayerTime"
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

Optional API-backed widgets read credentials from an ignored `.env` file in the widget directory. Start from the checked-in example:

```sh
cp .env.example .env
```

Supported variables:

```sh
GAUDI_WEATHER_API_KEY=
GAUDI_WEATHER_CITY=london
GAUDI_COINMARKETCAP_API_KEY=
GAUDI_GITHUB_TOKEN=
GAUDI_DND_SHORTCUT=
```

`.env` is sourced by the shell, so quote values that contain spaces or special characters. Legacy ignored `keys.secret.js` files (`lib/plugins/<plugin>/keys.secret.js`, a single line such as `module.exports = { apiKey: 'your-key' };`) are still read for compatibility, but new installs should use `.env`. Tokens and API keys are handed to `curl` on standard input, so they do not show up in the process list.

## Layout

![gaudi-layout](https://user-images.githubusercontent.com/550726/67003279-844f4a80-f0d5-11e9-888d-7c35400b6183.png)

The image above shows how gaudi overlays on your desktop:

- The main container covers the whole desktop.
- Two primary bars sit at the top and bottom of the screen.
- Each primary bar has three secondary regions: left, middle, and right.
- Each secondary region can contain any number of widgets distributed by flex layout.

## How it works

### Übersicht

[Übersicht](http://tracesof.net/uebersicht/) creates a webview and places it on your desktop, just above the wallpaper but behind everything else. Übersicht widgets are written as `.coffee` or `.js`, and can also use flavors like `.jsx`, which let you format elements with HTML, style them with CSS, and manipulate data with JavaScript. For dynamic widgets, Übersicht lets you run terminal commands and insert the output into HTML, so just about any language can be used to write scripts for widgets.

### Widget modules

Widgets live under `lib/plugins`. The registry in `lib/plugins/index.js` exposes known widgets and lazy-loads each module only when it is present in `lib/configs.js`:

```js
const PLUGIN_LOADERS = {
    battery: () => require('./battery/index.jsx'),
    crypto: () => require('./crypto/index.jsx'),
    date: () => require('./date/index.jsx'),
    dnd: () => require('./dnd/index.jsx'),
    github: () => require('./github/index.jsx'),
    network: () => require('./network/index.jsx'),
    prayerTime: () => require('./prayerTime/index.jsx'),
    stats: () => require('./stats/index.jsx'),
    time: () => require('./time/index.jsx'),
    weather: () => require('./weather/index.jsx'),
    yabai: () => require('./yabai/index.jsx')
};
```

Each plugin can expose its own `refreshFrequency`. The main widget wakes once per second, checks the configured widgets, and only refreshes a plugin when its interval has elapsed; a plugin that exports `refreshOnMinute = true` (the clock) is refreshed when the minute changes instead. Slow commands cannot overlap with themselves, a command that never returns is given up on after a minute (or three intervals, whichever is longer), and network requests time out after 15 seconds. Optional/unconfigured widgets return no output instead of crashing the whole bar.

A plugin that returns `undefined` keeps what it last showed. A plugin that throws also keeps its last output, and a small red notice naming the plugin is shown above the bottom bar until it succeeds again.

A plugin that exports `refreshOnSignal = true` is also refreshed straight away whenever Übersicht is asked to refresh the widget from outside, which is how the [yabai](lib/plugins/yabai) plugin reacts to yabai signals:

```sh
osascript -e 'tell application id "tracesOf.Uebersicht" to refresh widget id "gaudiBar-ubersicht-widget-main-jsx"'
```

The widget id is the path of `main.jsx` inside the widgets folder with `/` and `.` replaced by `-` (and spaces by `_`).

### Shell scripts and environment

Shell-backed widgets run through helper functions in `lib/utils.js`. These helpers find the widget folder, export it as `GAUDI_BAR_WIDGET_DIR`, load `.env`, quote shell arguments safely, and read credentials (`readSecret`) without exposing them on a command line.

External commands are macOS-oriented. `php` and `yabai` are discovered from `PATH` or the usual Homebrew locations (`/opt/homebrew/bin`, `/usr/local/bin`), so Übersicht does not need to run commands in a login shell; if they are unavailable, the related widgets stay hidden or return an empty state.

## Development

Run the smoke test before committing changes:

```sh
./test/smoke.sh
```

The smoke test checks shell syntax, ShellCheck when available, PHP and JavaScript syntax (JSX too when Übersicht is installed, using the parser it ships), committed secret/runtime artifacts, static secret imports, stale runtime paths, that the dnd plugin stays read-only, and that no secret is passed to `curl` as an argument. It never reads local secret files. The same script runs on GitHub Actions for every push to `main` and every pull request.

## Credits & Inspirations

- [nerdbar.widget](https://github.com/apierz/nerdbar.widget)
- [bar](https://github.com/callahanrts/bar)
- [darksky.widget](https://github.com/DeltaOS2/darksky.widget)
- [prayer-time-widget](https://github.com/ashikahmad/prayer-time-widget)
- [istats.widget](https://github.com/roele/istats.widget)
