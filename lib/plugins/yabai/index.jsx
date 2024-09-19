import { run, css } from "uebersicht"

export const refreshFrequency = 100;

const gaudi_widget_yabai=css`background: #000`
const gaudi_application_title = css`color: #06F`

export const render = () => {

    const getAppIcon = (app) => {

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

        app = app.replace(/^\s+/g, "");
        app = app.toLowerCase();

        return APPLICATIONS_ICONS[app] || 'fas fa-spinner';

    }

    const getAppColor = (app) => {

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

        app = app.replace(/^\s+/g, "");
        app = app.toLowerCase();

        const _color = APPLICATIONS_COLORS[app] || '#19cb00';

        return css`color: ${_color}`;

    }

    const trimWindowName = (path) => {

        let file = "";
        const wins = path;
        let win = "";
        const winseg = wins.split('/');
        file = winseg[winseg.length - 1];
        let j = winseg.length - 1;
        let flag1 = 0;
        let flag2 = 0;

        while (file.length >= 65) {
            file = file.slice(0, -1);
            flag1 = 1;
        }

        if (j > 1) {
            while (j >= 1) {
                j -= 1;
                if ((win + file).length >= 65) {
                    win = ` …/${win}`;
                    break;
                } else {
                    win = winseg[j] + '/' + win;
                }
            }
        }

        while (win.length >= 65) {
            win = win.slice(1);
            flag2 = 1;
        }

        if (flag1 >= 1) {
            file = file + '…';
        }

        if (flag2 >= 1) {
            win = `…${win}`;
        }

        if (path === "") {
            win = "…";
        }

        return `${win} ${file}`.trim()

    }

    return run(`bash gaudiBar.widget/lib/plugins/yabai/yabai`).then((output) => {
        const yabai = JSON.parse(output);

        if (yabai.activeWindow) {

            const app = yabai.activeWindow.app;
            const title = yabai.activeWindow.title;
    
            return (
                <div className={`gaudi-bar-section-widget ${gaudi_widget_yabai}`}>
                    <span className='gaudi-icon fas fa-desktop'></span>
                    <div>
                        <span>{yabai.layout.type.toUpperCase()}</span>
                        {
                            !!app ? (
                                <span>
                                    <span> | </span>
                                    <span className={`${getAppIcon(app)} ${getAppColor(app)} ${gaudi_application_title} gaudi-icon`}></span>
                                    <span>{app.toUpperCase()}</span>
                                    {
                                        app.toLowerCase() != trimWindowName(title).toLowerCase() ?
                                        (
                                            <span> | {trimWindowName(title)}</span>
                                        ) : null
                                    }
                                </span>
                            ) : null
                        }
                    </div>
                </div>
            )
        } else return null;
    })
}