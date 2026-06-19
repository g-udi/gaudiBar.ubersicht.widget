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

const pluginCache = {};

module.exports = {
    get(pluginName) {
        if (!PLUGIN_LOADERS[pluginName]) return null;
        if (!pluginCache[pluginName]) {
            pluginCache[pluginName] = PLUGIN_LOADERS[pluginName]();
        }
        return pluginCache[pluginName];
    },

    names() {
        return Object.keys(PLUGIN_LOADERS);
    }
};
