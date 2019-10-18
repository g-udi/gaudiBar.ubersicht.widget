# chunkwm
![chunkwm-widget](https://user-images.githubusercontent.com/550726/66969663-61477b00-f082-11e9-8b3e-f5c88e06d6b8.png)

| Refresh Frequency             | 100                                                                   |
|-------------------------------|-------------------------------------------------------------------------|

This widget shows:
 - The current space [chunkwm](https://github.com/koekeishiya/chunkwm) mode (monocle, float or bsp)
 - The active window's window title (application name) <sup>and any sub name like file name or website name depending on the application</sup>
 - Adaptive color status and icons for applications

## Customization

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

You can customize those to your liking. The default icon used for applications is `fa-spinner` as shown below:

![default-chunkwm-icon](https://user-images.githubusercontent.com/550726/66969662-61477b00-f082-11e9-8261-cad1400d2517.png)