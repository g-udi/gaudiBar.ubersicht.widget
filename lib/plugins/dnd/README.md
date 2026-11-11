# dnd (Focus / Do Not Disturb)

![dnd-widget](https://github.com/user-attachments/assets/43ee7c5f-554b-493f-aec6-2604efe19fd5)

| Refresh Frequency | 10000 |
|-------------------|-------|

This widget shows whether a Focus (Do Not Disturb included) is active, and can run a shortcut of yours when clicked.

It is read-only: it never writes preferences and never restarts system services. The pre-Focus approach (editing the `com.apple.ncprefs` preferences and restarting `usernoted`) stopped working when Focus replaced Do Not Disturb in macOS 12 and has been removed.

## Status

The state is read from `~/Library/DoNotDisturb/DB/Assertions.json`, the file where macOS records a Focus that is switched on.

| Icon | Background | Meaning |
|------|------------|---------|
| bell with slash | red | a Focus is on |
| bell | purple | no Focus is on |
| bell | grey | the state cannot be read |

Limitations:

- macOS protects that file. Übersicht needs **Full Disk Access** (System Settings → Privacy & Security → Full Disk Access) to read it; without it the widget stays grey.
- Only a Focus switched on by hand, from Control Centre or by a shortcut is recorded there. A Focus that starts from a schedule or an automation may not be reported.
- Apple does not document the file, so its format can change between macOS releases. When it cannot be parsed the widget shows the grey state.

## Toggle on click

There is no public command to switch a Focus, so the widget delegates to [Shortcuts](https://support.apple.com/guide/shortcuts-mac/):

1. In the Shortcuts app create a shortcut with the **Set Focus** action, set to *Toggle* Do Not Disturb (or any Focus you like).
2. Put its name in the widget `.env` file (see the root `.env.example`):

    ```sh
    GAUDI_DND_SHORTCUT="Toggle Do Not Disturb"
    ```

A click then runs `shortcuts run "<name>"`. When `GAUDI_DND_SHORTCUT` is empty the widget is not clickable and a click does nothing.
