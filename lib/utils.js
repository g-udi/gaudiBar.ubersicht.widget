import * as Uebersicht from 'uebersicht'

// Folder name used until the real one has been resolved (see resolveWidgetDir).
const DEFAULT_WIDGET_DIR = 'gaudiBar.ubersicht.widget'

let widgetDir = DEFAULT_WIDGET_DIR
let widgetDirPromise = null

export const shellQuote = (value) => `'${String(value).replace(/'/g, `'\\''`)}'`

// Same transformation Übersicht applies to a widget file path to build its DOM id.
const toWidgetId = (path) => path.split('/').join('-').replace(/\./g, '-').replace(/\s/g, '_')

// Übersicht runs commands from the widgets folder. List every folder (one or
// two levels deep) that looks like this widget, so a clone under any name works.
const FIND_WIDGET_DIRS =
    `for f in ./*/lib/plugins/index.js ./*/*/lib/plugins/index.js; do ` +
    `d="\${f%/lib/plugins/index.js}"; ` +
    `if [ -f "$d/main.jsx" ] && [ -f "$d/lib/configs.js" ]; then printf '%s\\n' "\${d#./}"; fi; ` +
    `done`

const pickWidgetDir = (candidates) => {
    if (!candidates.length) return DEFAULT_WIDGET_DIR

    // Several copies installed: prefer the one whose widget id is on the page.
    if (typeof document !== 'undefined') {
        const rendered = candidates.find((dir) => document.getElementById(toWidgetId(`${dir}/main.jsx`)))
        if (rendered) return rendered
    }

    return candidates.includes(DEFAULT_WIDGET_DIR) ? DEFAULT_WIDGET_DIR : candidates[0]
}

const resolveWidgetDir = () => {
    if (!widgetDirPromise) {
        widgetDirPromise = Uebersicht.run(FIND_WIDGET_DIRS)
            .then((output) => {
                widgetDir = pickWidgetDir(String(output || '').split('\n').filter(Boolean))
            })
            .catch(() => {})
    }
    return widgetDirPromise
}

// Absolute URL path of a file inside the widget folder (for <link> tags).
export const widgetPath = (path = '') => `/${encodeURI(widgetDir)}${path ? `/${path}` : ''}`

export const parseJson = (json) => {
    try {
        return JSON.parse(json)
    } catch (error) {
        console.error(error, json)
        return undefined
    }
}

const withLocalEnv = (command) =>
    `GAUDI_BAR_WIDGET_DIR=${shellQuote(widgetDir)}; export GAUDI_BAR_WIDGET_DIR; ` +
    `[ -f "$GAUDI_BAR_WIDGET_DIR/.env" ] && set -a && . "$GAUDI_BAR_WIDGET_DIR/.env" && set +a; ${command}`

// Runs a shell command with GAUDI_BAR_WIDGET_DIR exported and the local .env loaded.
export const runWithLocalEnv = (command) => resolveWidgetDir().then(() => Uebersicht.run(withLocalEnv(command)))

// Shell snippet that sets $secret from an environment variable (usually loaded
// from .env), falling back to the `apiKey` of a legacy, git-ignored secret file.
export const readSecret = (envVar, legacyFile) =>
    `secret_file="$GAUDI_BAR_WIDGET_DIR/${legacyFile}"; secret="\${${envVar}:-}"; ` +
    `if [ -z "$secret" ] && [ -f "$secret_file" ]; then ` +
    `secret=$(sed -n "s/.*apiKey:[[:space:]]*['\\\"]\\([^'\\\"]*\\).*/\\1/p" "$secret_file" | head -n 1); fi`

// Shell snippet that prints one `curl --config -` line carrying $secret, so the
// secret reaches curl on stdin and never shows up in the process list.
export const curlSecretConfig = (option, prefix = '') =>
    `printf '%s = "%s%s"\\n' ${shellQuote(option)} ${shellQuote(prefix)} ` +
    `"$(printf '%s' "$secret" | sed 's/[\\\\"]/\\\\&/g')"`

// curl options that stop a stalled request from hanging a plugin.
export const CURL_TIMEOUTS = '--connect-timeout 5 --max-time 15'

// Shell snippet that sets $<variable> to the path of a command, looking in PATH
// and then in the Homebrew locations, which Übersicht's shell does not have in
// PATH unless it runs commands in a login shell. Empty when it is not installed.
export const findCommand = (name, variable) =>
    `${variable}=$(command -v ${name} 2>/dev/null || true); ` +
    `for candidate in /opt/homebrew/bin/${name} /usr/local/bin/${name}; do ` +
    `if [ -z "$${variable}" ] && [ -x "$candidate" ]; then ${variable}="$candidate"; fi; done`

export const emptyWidget = () => null

export const cleanupOutput = (output) => String(output || '').trim().replace(/(\r\n|\n|\r)/gm, '')
