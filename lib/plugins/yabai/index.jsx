import { css } from "uebersicht"
import * as Utils from '../../utils'

// Fallback poll. For instant updates add the yabai signals from the README:
// they ask Übersicht to refresh the widget, and plugins with `refreshOnSignal`
// are then refreshed straight away instead of waiting for this interval.
export const refreshFrequency = 10000;
export const refreshOnSignal = true;

const gaudi_widget_yabai=css`background: #000`
const gaudi_application_title = css`color: #06F`

const MAX_TITLE_LENGTH = 80;

export const render = () => {

    const getAppIcon = (app) => {

        const APPLICATIONS_ICONS = {
            "google chrome": "fab fa-chrome",
            "path finder": "fab fa-apple",
            "messages": "fas fa-comments",
            "fantastical": "fas fa-calendar",
            "calendar": "fas fa-calendar",
            "kitty": "fas fa-terminal",
            "finder": "fab fa-apple",
            "system settings": "fas fa-cogs",
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
            "path finder": "#3385d7",
            "kitty": "#32cd32",
            "system settings": "#867C85",
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

    // Caps a window title at MAX_TITLE_LENGTH characters, ending with an ellipsis.
    const trimWindowName = (title) => {
        const name = String(title || "").trim();

        return name.length > MAX_TITLE_LENGTH ? `${name.slice(0, MAX_TITLE_LENGTH - 1).trimEnd()}…` : name;
    }

    return Utils.runWithLocalEnv(`bash "$GAUDI_BAR_WIDGET_DIR/lib/plugins/yabai/yabai"`).then((output) => {
        const yabai = Utils.parseJson(output);
        if (!yabai || !yabai.layout) return Utils.emptyWidget();

        // No focused window (an empty space): still show the layout
        const activeWindow = yabai.activeWindow || {};
        const app = activeWindow.app;
        const title = trimWindowName(activeWindow.title);

        return (
            <div className={`gaudi-bar-section-widget ${gaudi_widget_yabai}`}>
                <span className='gaudi-icon fas fa-desktop'></span>
                <div>
                    <span>{String(yabai.layout.type || '').toUpperCase()}</span>
                    {
                        !!app ? (
                            <span>
                                <span> | </span>
                                <span className={`${getAppIcon(app)} ${getAppColor(app)} ${gaudi_application_title} gaudi-icon`}></span>
                                <span>{app.toUpperCase()}</span>
                                {
                                    title && app.toLowerCase() !== title.toLowerCase() ?
                                    (
                                        <span> | {title}</span>
                                    ) : null
                                }
                            </span>
                        ) : null
                    }
                </div>
            </div>
        )
    }).catch(() => Utils.emptyWidget())
}
