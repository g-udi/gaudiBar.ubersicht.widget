
import * as Utils from '../../utils'

export const refreshFrequency = 5000;

export const render = () => {

    return Utils.runWithLocalEnv(`bash "$GAUDI_BAR_WIDGET_DIR/lib/plugins/dnd/dnd" status`).then(async (output) => {

        const status = Utils.cleanupOutput(output) === "true" ? "on" : "off";
        
        const toggle = async () => {
            const newStatus = status === 'on' ? 'off' : 'on'
            Utils.runWithLocalEnv(`bash "$GAUDI_BAR_WIDGET_DIR/lib/plugins/dnd/dnd" ${newStatus}`)
        }

        const getDndStatus = () => {
            return status === "on" ? "fa fa-bell-slash" : "fa fa-bell"
        }

        return (
            <div>
                <link rel="stylesheet" type="text/css" href={Utils.widgetPath('lib/plugins/dnd/style.css')}></link>
                <div className={`gaudi-bar-section-widget ${status === "on" ? 'gaudi-dnd-enabled' : 'gaudi-dnd-disabled'} gaudi-clickable`}>
                    <span onClick={toggle} className={`${getDndStatus()} gaudi-icon gaudi-icon-single`}></span>
                </div>
            </div>
        )

    }).catch(() => Utils.emptyWidget())
}
