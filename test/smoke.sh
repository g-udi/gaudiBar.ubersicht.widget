#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." >/dev/null 2>&1 && pwd)"

shell_scripts=(
    "$ROOT_DIR/lib/plugins/battery/battery"
    "$ROOT_DIR/lib/plugins/dnd/dnd"
    "$ROOT_DIR/lib/plugins/network/network"
    "$ROOT_DIR/lib/plugins/stats/stats"
    "$ROOT_DIR/lib/plugins/yabai/yabai"
)

bash -n "${shell_scripts[@]}"

if command -v shellcheck >/dev/null 2>&1; then
    shellcheck -x "${shell_scripts[@]}"
fi

if command -v php >/dev/null 2>&1; then
    php -l "$ROOT_DIR/lib/plugins/prayerTime/prayerTime.php" >/dev/null
fi

if command -v node >/dev/null 2>&1; then
    node --check "$ROOT_DIR/lib/configs.js"
    node --check "$ROOT_DIR/lib/plugins/index.js"
    node --check "$ROOT_DIR/lib/plugins/crypto/coins.js"
    node --input-type=module --check < "$ROOT_DIR/lib/utils.js"

    # JSX is parsed with the parser Übersicht itself ships, so no dependency is
    # needed; the check is skipped where Übersicht is not installed (e.g. in CI).
    jsx_parser="${GAUDI_JSX_PARSER:-/Applications/Übersicht.app/Contents/Resources/node_modules/@babel/parser}"
    if [[ -d "$jsx_parser" ]]; then
        # shellcheck disable=SC2016
        node -e '
            const parser = require(process.argv[1]);
            const fs = require("fs");
            for (const file of process.argv.slice(2)) {
                try {
                    parser.parse(fs.readFileSync(file, "utf8"), { sourceType: "module", plugins: ["jsx"] });
                } catch (error) {
                    console.error(`${file}: ${error.message}`);
                    process.exitCode = 1;
                }
            }
        ' "$jsx_parser" "$ROOT_DIR/main.jsx" "$ROOT_DIR"/lib/plugins/*/index.jsx
    else
        printf 'JSX syntax check skipped (Übersicht is not installed)\n'
    fi
fi

if git -C "$ROOT_DIR" ls-files | grep -E '(^|/)keys\.secret\.js$|(^|/)\.DS_Store$|(^|/)network\.out$'; then
    printf 'tracked local secret or runtime artifact found\n' >&2
    exit 1
fi

if git -C "$ROOT_DIR" ls-files 'lib/fonts/svgs/*' | grep .; then
    printf 'unused Font Awesome SVG tree is tracked\n' >&2
    exit 1
fi

if grep -R "require(.*keys\\.secret" "$ROOT_DIR/main.jsx" "$ROOT_DIR/lib" --include='*.js' --include='*.jsx' --exclude='*.secret.js'; then
    printf 'static keys.secret import found\n' >&2
    exit 1
fi

# The dnd plugin must stay read-only: no preference writes, no process kills.
if grep -nE 'defaults write|killall|pkill|plutil -(insert|replace|remove)' "$ROOT_DIR/lib/plugins/dnd/dnd"; then
    printf 'dnd plugin modifies system state\n' >&2
    exit 1
fi

# Secrets must reach curl through --config on stdin, never as arguments.
# shellcheck disable=SC2016
if grep -R -nE 'curl[^|]*(Bearer|API_KEY:|key=)[^|]*\$(secret|token|api_key)' "$ROOT_DIR/lib" --include='*.js' --include='*.jsx' --exclude='*.secret.js'; then
    printf 'secret passed to curl as an argument\n' >&2
    exit 1
fi

if grep -R "gaudiBar\\.widget" "$ROOT_DIR/main.jsx" "$ROOT_DIR/lib/plugins" --include='*.js' --include='*.jsx' --include='stats' --exclude='*.secret.js'; then
    printf 'stale gaudiBar.widget runtime path found\n' >&2
    exit 1
fi

printf 'gaudiBar smoke ok\n'
