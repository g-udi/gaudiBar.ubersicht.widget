
import * as Utils from '../../utils'

export const refreshFrequency = 10000;

const DND_SCRIPT = `bash "$GAUDI_BAR_WIDGET_DIR/lib/plugins/dnd/dnd"`;

// Runs the Shortcuts shortcut named in GAUDI_DND_SHORTCUT; a no-op when it is not set.
const toggle = () => Utils.runWithLocalEnv(`${DND_SCRIPT} toggle`).catch(() => {});

export const render = () => {

    return Utils.runWithLocalEnv(`${DND_SCRIPT} status`).then((output) => {

        const values = Utils.parseJson(output) || {};
        const status = ['on', 'off'].includes(values.status) ? values.status : 'unknown';
        const canToggle = values.shortcut === true;
        const icon = status === 'on' ? 'fa fa-bell-slash' : 'fa fa-bell';

        return (
            <div>
                <link rel="stylesheet" type="text/css" href={Utils.widgetPath('lib/plugins/dnd/style.css')}></link>
                <div className={`gaudi-bar-section-widget gaudi-dnd-${status} ${canToggle ? 'gaudi-clickable' : ''}`}>
                    <span onClick={canToggle ? toggle : undefined} className={`${icon} gaudi-icon gaudi-icon-single`}></span>
                </div>
            </div>
        )

    }).catch(() => Utils.emptyWidget())
}
