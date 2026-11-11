import * as Utils from './lib/utils'

const CONFIGURATION = require('./lib/configs');
const PLUGINS = require('./lib/plugins');

export const refreshFrequency = 1000;

const PRIMARY_BARS = ["top", "bottom"];
const SECONDARY_BARS = ["left", "middle", "right"];
const DEFAULT_PLUGIN_REFRESH = 10000;

const pluginState = {};
let lastTick = 0;

const configuredPlugins = () => {
    const seen = {};

    return PRIMARY_BARS.reduce((plugins, primaryBar) => {
        const primaryConfig = CONFIGURATION[primaryBar] || {};

        SECONDARY_BARS.forEach((secondaryBar) => {
            (primaryConfig[secondaryBar] || []).forEach((pluginName) => {
                if (!pluginName || seen[pluginName]) return;
                seen[pluginName] = true;
                plugins.push(pluginName);
            });
        });

        return plugins;
    }, []);
};

const shouldRefreshPlugin = (pluginName, plugin, now, forced) => {
    const state = pluginState[pluginName] || {};
    const refreshInterval = plugin.refreshFrequency || DEFAULT_PLUGIN_REFRESH;

    if (state.inFlight) return false;
    if (forced && plugin.refreshOnSignal) return true;

    return !state.lastRun || now - state.lastRun >= refreshInterval;
};

const renderPlugin = (pluginName, plugin, dispatch, now) => {
    pluginState[pluginName] = {
        ...(pluginState[pluginName] || {}),
        inFlight: true,
        lastRun: now
    };

    Promise.resolve(plugin.render())
        .then((output) => {
            pluginState[pluginName].inFlight = false;
            if (output === undefined) return;
            dispatch({ output, type: pluginName });
        })
        .catch((error) => {
            pluginState[pluginName].inFlight = false;
            console.error(`[gaudi] ${pluginName} failed`, error);
        });
};

export const command = (dispatch) => {
    const now = Date.now();

    // Timer ticks are never less than refreshFrequency apart, so an earlier call is a
    // refresh requested from outside (e.g. a yabai signal running
    // `osascript -e 'tell application id "tracesOf.Uebersicht" to refresh widget id "..."'`).
    const forced = lastTick > 0 && now - lastTick < refreshFrequency - 50;
    lastTick = now;

    configuredPlugins().forEach((pluginName) => {
        const plugin = PLUGINS.get(pluginName);

        if (!plugin) {
            console.warn(`[gaudi] Unknown plugin "${pluginName}"`);
            return;
        }

        if (shouldRefreshPlugin(pluginName, plugin, now, forced)) {
            renderPlugin(pluginName, plugin, dispatch, now);
        }
    });
};

export const render = ({state, warning}) => {
    const widgetState = state || {};

    try {
        return <div className="gaudi">

            <link rel="stylesheet" type="text/css" href={Utils.widgetPath('lib/fonts/css/fonts.css')} />
            <link rel="stylesheet" type="text/css" href={Utils.widgetPath('style.css')} />

            {warning ? <div className="gaudi-warning">{warning}</div> : null}

            {PRIMARY_BARS.map((primaryBar, index) => {
                return <div key={`bar-${primaryBar}-${index}`} className={`gaudi-bar__${primaryBar}`}>
                    {SECONDARY_BARS.map((secondaryBar) => {
                        return <div key={`bar-${primaryBar}-${secondaryBar}-${index}`}
                            className={`gaudi-bar-section gaudi-bar__${primaryBar}-${secondaryBar}`}>
                            {((CONFIGURATION[primaryBar] || {})[secondaryBar] || []).map((widget, index) => {
                                return !!widget && widgetState[widget] ? (
                                    <div className={`gaudi-bar-section-widget-container plugin-${widget}`} key={`widget-${widget}-${index}`}>
                                        {widgetState[widget]}
                                    </div>
                                ) : null;
                            })}
                        </div>
                    })}
                </div>
            })}
        </div>
    } catch (error) {
        return <div> 🛑Something went wrong ❗<strong>{String(error)}</strong></div>
    }

}

export const updateState = (event, previousState) => {
    const currentState = previousState || {};

    if (event.error) {
        console.error(event.error);
        return { ...currentState, warning: `We got an error: ${event.error}` };
    }

    return event.type ? { state: { ...(currentState.state || {}), [event.type]: event.output } } : event;
};
