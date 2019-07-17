
import { run, css } from "uebersicht"

export const refreshFrequency = 1000;

const gaudi_color_green = css`color: #32cd32`
const gaudi_color_red = css`color: #be222f`

const NUMBER_OF_CORES = 6;

export const render = () => {

    /* @function getCPU
     * @description renders the CPU utilization percentage. The calculation takes into account the number of cores for the CPU
     * @parameter <String> cpu the raw CPU utilization
     */
    const getCPU = (cpu) => {

        let cpuNum = (parseFloat(cpu) / NUMBER_OF_CORES).toFixed(1);
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

    /* @function getCPU
     * @description renders the CPU utilization percentage. The calculation takes into account the number of cores for the CPU
     * @parameter <String> cpu the raw CPU utilization
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
     * @parameter <String> down the download rate in bytes
     * @parameter <String> up the upload rate in bytes
     */
    const getNetTraffic = (down, up) => {

        const usageFormat = (kb) => {
            if (kb / 1024 < 0.01) {
                return "0.00MB";
            }
            return isNaN(parseFloat((kb/1024).toFixed(2))) ? '0.0MB' : `${parseFloat((kb/1024).toFixed(2))}MB`;
        }

        const convertBytes = (bytes) => {
            return usageFormat(bytes / 1024);
        }

        const downString = convertBytes(parseInt(down)) == NaN ? '-' : convertBytes(parseInt(down));
        const upString = convertBytes(parseInt(up)) == NaN ? '-' : convertBytes(parseInt(up));
        return (
            <span>
                <span className={`gaudi-icon ${gaudi_color_green}`}> ↑ </span><span>{downString}</span>
                <span> ⎢ </span>
                <span className={`gaudi-icon ${gaudi_color_red}`}> ↓ </span><span>{upString}</span>
            </span>
        )
    }

    /* @function getFreeSpace
     * @description renders the hard-disk utilization percentage
     * @parameter <String> space the hard-disk free capacity in GB
     */
    const getFreeSpace = (space) => {
        return (
            <span>
                <span className='fa fa-hdd gaudi-icon'></span><span className='white'>{space}GB</span>
            </span>
        );
    }

    return run(`bash gaudiBar.widget/lib/plugins/stats/stats`).then((output) => {

        const values = output.split('@')

        // create an HTML string to be displayed by the widget
        return (
            <div className="gaudi-bar-section-widget">
                <span className="gaudi-bar-section-widget-section">{getCPU(values[0])}</span>
                <span className="gaudi-bar-section-widget-section">{getFreeSpace(values[4].replace('Gi', '').trim())}</span>
                <span className="gaudi-bar-section-widget-section">{getMem(values[1])}</span>
                <span className="gaudi-bar-section-widget-section">{getNetTraffic(values[2], values[3])}</span>
            </div>
        )
    })
}
