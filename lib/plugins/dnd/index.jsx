
import { run } from "uebersicht"
import * as Utils from '../../utils'

export const refreshFrequency= 100;

export const render = () => {

    return run(`bash gaudiBar.widget/lib/plugins/dnd/dnd status`).then(async (output) => {

        const status = Utils.cleanupOutput(output) == "true" ? "on" : "off";
        
        const toggle = async () => {
            const newStatus = status === 'on' ? 'off' : 'on'
            run(`bash gaudiBar.widget/lib/plugins/dnd/dnd ${newStatus}`)
        }

        const getDndStatus = () => {
            return status == "on" ? "fa fa-bell-slash" : "fa fa-bell"
        }

        return (
            <div>
                <link rel="stylesheet" type="text/css" href="gaudiBar.widget/lib/plugins/dnd/style.css"></link>
                <div className={`gaudi-bar-section-widget ${status == "on" ? 'gaudi-dnd-enabled' : 'gaudi-dnd-disabled'} gaudi-clickable`}>
                    <span onClick={toggle} className={`${getDndStatus()} gaudi-icon gaudi-icon-single`}></span>
                </div>
            </div>
        )

    })
}