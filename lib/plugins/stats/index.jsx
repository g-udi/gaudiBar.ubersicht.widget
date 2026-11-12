
import { css } from "uebersicht"
import * as Utils from '../../utils'

export const refreshFrequency = 5000;

const gaudi_widget_stats = css`background-color: transparent; margin-left: -15px`
const gaudi_color_green = css`color: #32cd32`
const gaudi_color_red = css`color: #be222f`

// Previous cumulative byte counters, used to turn two readings into a rate.
let previousTraffic = null;

/* @function getTrafficRates
 * @description converts the cumulative byte counters into bytes per second since the previous refresh
 * @parameter <Number> rx total bytes received
 * @parameter <Number> tx total bytes sent
 */
const getTrafficRates = (rx, tx) => {
    const current = { rx: Number(rx), tx: Number(tx), at: Date.now() };
    const previous = previousTraffic;
    let rates = { down: 0, up: 0 };

    if (!Number.isFinite(current.rx) || !Number.isFinite(current.tx)) return rates;

    if (previous && current.at > previous.at) {
        const seconds = (current.at - previous.at) / 1000;

        // Counters restart from zero after a reboot or when an interface goes away
        rates = {
            down: Math.max(0, current.rx - previous.rx) / seconds,
            up: Math.max(0, current.tx - previous.tx) / seconds
        };
    }

    previousTraffic = current;
    return rates;
}

export const render = () => {

    /* @function getCPU
     * @description renders the CPU utilization percentage. The calculation takes into account the number of cores for the CPU
     * @parameter <String> cpu the raw CPU utilization
     */
    const getCPU = (cpu) => {

        let cpuNum = parseFloat(cpu).toFixed(1);
        let cpuString = String(cpuNum);
        if (cpuNum < 10) {
            cpuString = `0${cpuString}`;
        }
        return (
            <span>
                <span className='fas fa-microchip gaudi-icon'></span><span>{cpuString}</span>
            </span>
        );
    }

    /* @function getMem
     * @description renders the share of physical memory in use
     * @parameter <String> mem the memory usage percentage
     */
    const getMem = (mem) => {

        let memNum = parseFloat(mem).toFixed(1);
        let memString = String(memNum);
        if (memNum < 10) {
          memString = `0${memString}`;
        }
        return (
            <span>
                <span className='fas fa-memory gaudi-icon'></span><span>{memString}%</span>
            </span>
        );
    }

    /* @function getNetTraffic
     * @description renders the network utilization for both upload and download
     * @parameter <Number> down the download rate in bytes per second
     * @parameter <Number> up the upload rate in bytes per second
     */
    const getNetTraffic = (down, up) => {

        const usageFormat = (bytes) => {
            const amount = parseFloat(bytes);

            if (!Number.isFinite(amount) || amount <= 0) return '0.0KB/s';
            if (amount >= 1024 * 1024) return `${(amount / 1024 / 1024).toFixed(1)}MB/s`;
            if (amount >= 1024) return `${(amount / 1024).toFixed(1)}KB/s`;
            return `${Math.round(amount)}B/s`;
        }

        const downString = usageFormat(down);
        const upString = usageFormat(up);

        return (
            <span>
                <span className={`gaudi-icon ${gaudi_color_green}`}> ↓ </span><span>{downString}</span>
                <span> ⎢ </span>
                <span className={`gaudi-icon ${gaudi_color_red}`}> ↑ </span><span>{upString}</span>
            </span>
        )
    }

    /* @function getFreeSpace
     * @description renders the free hard-disk space
     * @parameter <String> space the hard-disk free capacity in GB
     */
    const getFreeSpace = (space) => {
        return (
            <span>
                <span className='fa fa-hdd gaudi-icon'></span><span>{space}GB</span>
            </span>
        );
    }

    return Utils.runWithLocalEnv(`bash "$GAUDI_BAR_WIDGET_DIR/lib/plugins/stats/stats"`).then((output) => {

        const values = Utils.parseJson(output);
        if (!values) return Utils.emptyWidget();

        const traffic = getTrafficRates(values.rx, values.tx);

        // create an HTML string to be displayed by the widget
        return (
            <div className={`gaudi-bar-section-widget ${gaudi_widget_stats}`}>
                <span className="gaudi-bar-section-widget-section">{getCPU(values.cpu)}</span>
                <span className="gaudi-bar-section-widget-section">{getFreeSpace(String(values.hdd || '').trim())}</span>
                <span className="gaudi-bar-section-widget-section">{getMem(values.memory)}</span>
                <span className="gaudi-bar-section-widget-section">{getNetTraffic(traffic.down, traffic.up)}</span>
            </div>
        )
    }).catch(() => Utils.emptyWidget())
}
