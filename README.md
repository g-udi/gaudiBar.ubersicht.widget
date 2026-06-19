# gaudiBar

gaudiBar is an [Übersicht](http://tracesof.net/uebersicht/) desktop bar built from small, configurable widgets. It renders top and bottom bars, loads only the widgets listed in `lib/configs.js`, and refreshes each widget on its own interval.

## Install

Clone this repository into your Übersicht widgets folder:

```sh
widgets_dir="$HOME/Library/Application Support/Übersicht/widgets"
git clone https://github.com/g-udi/gaudiBar.ubersicht.widget "$widgets_dir/gaudiBar.ubersicht.widget"
```

You can find the widgets folder from the Übersicht menu bar item via **Open Widgets Folder**.

## Configuration

Edit `lib/configs.js` to choose where widgets appear:

```js
module.exports = {
    top: {
        right: ["dnd", "time", "battery", "network"],
        middle: [],
        left: ["weather", "crypto", "github", "prayerTime"]
    },
    bottom: {
        right: ["stats"],
        middle: [],
        left: ["yabai"]
    }
}
```

Optional API-backed widgets read credentials from an ignored `.env` file in the widget directory. Start from the example:

```sh
cp .env.example .env
```

Supported variables:

```sh
GAUDI_WEATHER_API_KEY=
GAUDI_WEATHER_CITY=london
GAUDI_COINMARKETCAP_API_KEY=
GAUDI_GITHUB_TOKEN=
```

Legacy ignored `keys.secret.js` files are still read for compatibility, but new installs should use `.env`.

## Widgets

- `battery`: battery percentage and charging source
- `crypto`: CoinMarketCap prices for coins configured in `lib/plugins/crypto/coins.js`
- `date`: local date
- `dnd`: macOS Do Not Disturb status and toggle
- `github`: GitHub notification counts
- `network`: active network service, SSID, and IP
- `prayerTime`: next prayer time using the bundled PHP calculator
- `stats`: CPU, disk, memory, and network throughput
- `time`: local time
- `weather`: current WeatherAPI temperature
- `yabai`: active yabai layout, app, and window title

## Runtime Notes

The main widget wakes once per second, but individual plugins are deduplicated and throttled by their own `refreshFrequency`. Slow plugins cannot overlap with themselves, and unconfigured optional plugins return no output instead of crashing the whole bar.

External commands are macOS-oriented. `yabai` and `php` are discovered from `PATH`; if they are unavailable, their widgets stay hidden.

## Development

Run the smoke test:

```sh
./test/smoke.sh
```

The smoke test checks shell syntax, ShellCheck when available, committed secret/runtime artifacts, static secret imports, and stale runtime paths.
