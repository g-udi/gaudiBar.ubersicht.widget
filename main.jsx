import * as Utils from './lib/utils'

const CONFIGURATION = require('./lib/configs');
const PLUGINS = require('./lib/plugins');

export const refreshFrequency = 1000;

const PRIMARY_BARS = ["top", "bottom"];
const SECONDARY_BARS = ["left", "middle", "right"];
const DEFAULT_PLUGIN_REFRESH = 10000;
const STALE_IN_FLIGHT = 60000;

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

    if (state.inFlight) {
        // A run that never settles (a hung command) must not block the plugin for good.
        const staleAfter = Math.max(STALE_IN_FLIGHT, refreshInterval * 3);
        if (now - state.lastRun < staleAfter) return false;
    }

    if (forced && plugin.refreshOnSignal) return true;
    if (!state.lastRun) return true;

    // Clocks refresh when the minute changes rather than on a fixed interval.
    if (plugin.refreshOnMinute) return Math.floor(now / 60000) !== Math.floor(state.lastRun / 60000);

    return now - state.lastRun >= refreshInterval;
};

const renderPlugin = (pluginName, plugin, dispatch, now) => {
    pluginState[pluginName] = {
        ...(pluginState[pluginName] || {}),
        inFlight: true,
        lastRun: now
    };

    // Only the latest run may clear the in-flight flag (an older, stale run can settle late).
    const settle = () => {
        if (pluginState[pluginName].lastRun === now) pluginState[pluginName].inFlight = false;
    };

    // Lets a plugin ask for its own refresh, e.g. after a click changed what it shows.
    const refresh = () => {
        if (!pluginState[pluginName].inFlight) renderPlugin(pluginName, plugin, dispatch, Date.now());
    };

    Promise.resolve()
        .then(() => plugin.render({ refresh }))
        .then((output) => {
            settle();
            // `undefined` means "nothing new": keep what is on screen.
            if (output === undefined) return;
            dispatch({ output, type: pluginName });
        })
        .catch((error) => {
            settle();
            console.error(`[gaudi] ${pluginName} failed`, error);
            dispatch({ error: String((error && error.message) || error), type: pluginName });
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

export const render = ({state, warnings}) => {
    const widgetState = state || {};
    const warning = Object.values(warnings || {}).join(' · ');

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

    // Übersicht reports every run of `command` itself; the plugins dispatch their own
    // events, so that one only matters when `command` failed as a whole.
    const source = event.type === 'UB/COMMAND_RAN' ? 'gaudi' : event.type;

    if (!source || (source === 'gaudi' && !event.error)) return currentState;

    const warnings = { ...(currentState.warnings || {}) };

    // A failed plugin keeps its last output and shows a warning until it succeeds again.
    if (event.error) {
        warnings[source] = `${source}: ${event.error}`;
        return { ...currentState, warnings };
    }

    delete warnings[source];

    return { state: { ...(currentState.state || {}), [source]: event.output }, warnings };
};
