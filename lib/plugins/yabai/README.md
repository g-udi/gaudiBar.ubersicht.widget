# yabai

![yabai-widget](https://github.com/user-attachments/assets/75143204-4ccd-44cc-b91d-00ddf7ac530b)

This widget displays the layout of the current space and the focused application (icon, name and window title) using [yabai](https://github.com/koekeishiya/yabai).

| Refresh Frequency | 10000 (fallback poll), immediate with yabai signals |
|-------------------|------|

## Features:
- Displays the layout of the current space (`bsp`, `stack`, `float`)
- Displays the currently focused application and its window title (capped at 80 characters); on an empty space only the layout is shown
- Uses Font Awesome icons for application icons (`APPLICATIONS_ICONS` and `APPLICATIONS_COLORS` in `index.jsx`)

## Refreshing from yabai signals

Polling yabai every couple of seconds is wasteful, so the widget only polls every 10 seconds as a safety net. To have it follow focus changes instantly, let yabai tell Übersicht when something changed by adding these signals to your `yabairc`:

```sh
gaudi_refresh="osascript -e 'tell application id \"tracesOf.Uebersicht\" to refresh widget id \"gaudiBar-ubersicht-widget-main-jsx\"'"

yabai -m signal --add label=gaudi_window_focused   event=window_focused             action="$gaudi_refresh"
yabai -m signal --add label=gaudi_title_changed    event=window_title_changed       action="$gaudi_refresh"
yabai -m signal --add label=gaudi_app_switched     event=application_front_switched action="$gaudi_refresh"
yabai -m signal --add label=gaudi_space_changed    event=space_changed              action="$gaudi_refresh"
yabai -m signal --add label=gaudi_window_destroyed event=window_destroyed           action="$gaudi_refresh"
```

Then reload yabai (`yabai --restart-service`). The refresh request makes the main widget run its plugins flagged `refreshOnSignal` (this one) straight away; the other plugins keep their own schedule.

The widget id above assumes the default folder name. If you cloned the widget under another name, the id is the path of `main.jsx` inside the widgets folder with `/` and `.` replaced by `-` and spaces by `_`.

yabai has no signal for a layout change (`yabai -m space --layout ...`), so that one shows up on the next fallback poll.

## Note:
This widget requires yabai to be installed and running. If it is missing or stopped, the widget stays hidden. Check the [yabai documentation](https://github.com/koekeishiya/yabai) for more details on how to set it up.
