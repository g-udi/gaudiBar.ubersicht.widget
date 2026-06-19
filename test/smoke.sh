#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." >/dev/null 2>&1 && pwd)"

shell_scripts=(
    "$ROOT_DIR/lib/plugins/battery/battery"
    "$ROOT_DIR/lib/plugins/dnd/dnd"
    "$ROOT_DIR/lib/plugins/network/network"
    "$ROOT_DIR/lib/plugins/stats/stats"
    "$ROOT_DIR/lib/plugins/stats/cpu"
    "$ROOT_DIR/lib/plugins/stats/memory"
    "$ROOT_DIR/lib/plugins/stats/hdd"
    "$ROOT_DIR/lib/plugins/stats/network-traffic"
    "$ROOT_DIR/lib/plugins/yabai/yabai"
)

bash -n "${shell_scripts[@]}"

if command -v shellcheck >/dev/null 2>&1; then
    shellcheck -x "${shell_scripts[@]}"
fi

if git -C "$ROOT_DIR" ls-files | grep -E '(^|/)keys\.secret\.js$|(^|/)\.DS_Store$|(^|/)network\.out$'; then
    printf 'tracked local secret or runtime artifact found\n' >&2
    exit 1
fi

if git -C "$ROOT_DIR" ls-files 'lib/fonts/svgs/*' | grep .; then
    printf 'unused Font Awesome SVG tree is tracked\n' >&2
    exit 1
fi

if grep -R "require(.*keys\\.secret" "$ROOT_DIR" --include='*.js' --include='*.jsx'; then
    printf 'static keys.secret import found\n' >&2
    exit 1
fi

if grep -R "gaudiBar\\.widget" "$ROOT_DIR/main.jsx" "$ROOT_DIR/lib/plugins" --include='*.js' --include='*.jsx' --include='stats'; then
    printf 'stale gaudiBar.widget runtime path found\n' >&2
    exit 1
fi

printf 'gaudiBar smoke ok\n'
