
import { run } from "uebersicht"

import IStatsParser from './parser/IStatsParser.js';
import Transformer from './transformer/Transformer.js';

export const refreshFrequency= 10000;

const ISTATS_LOCATION = '/usr/bin/istats';

const OPTIONS = {
    tempUnit: 'C',
    animations: true,
};

export const render = () => {

    return run(`${ISTATS_LOCATION}`).then((output) => {


        const renderStat = (title, iconName, value) => {

            return (
                <div key={title} className="stat">
                    <i className={"icon " + iconName}></i>
                    <div className="text">{value}</div>
                </div>
            );
        }

        const clamp = (value, min, max) => {
            return Math.min(Math.max(value, min), max);
        }

        const getIcon = (data, key) => {
            if (key === 'cpu') {
                return 'icon-cpu';
            } else if (key.startsWith('fan')) {
                let cls = 'icon-fan';
                if (OPTIONS.animations) {
                    let percentage = getPercentage(data, key),
                    rndPercentage = Math.ceil(percentage / 20) * 20;
                    cls += ' animation-fan-' + clamp(rndPercentage, 0, 100);
                }
                return cls;
            }
            return '';
        }

        const getPercentage = (data, key) => {
            const MAX_CPU_TEMP = 90, MAX_FAN_SPEED = 6000;
            if (key === 'cpu') {
                return Math.floor(data[key]['cpu-temp'][0] / MAX_CPU_TEMP * 100);
            } else if (key.startsWith('fan')) {
                return Math.floor(data[key]['fan-speed'][0] / MAX_FAN_SPEED * 100);
            } else {
                return undefined;
            }
        }

        const getValue = (data, key) => {
            if (key === 'cpu') {
                return (OPTIONS.tempUnit === 'F')
                ? Math.floor(data[key]['cpu-temp'][0] * 1.8 + 32) + '°F'
                : data[key]['cpu-temp'][0] + '°C';
            } else if (key.startsWith('fan')) {
                return data[key]['fan-speed'][0] + 'RPM';
            } else {
                return undefined;
            }
        }

        const parsedData = IStatsParser.parse(output);
        const data = Transformer.transform(parsedData);

        return (
            <div className={`gaudi-bar-section-widget gaudi-istats-widget`}>
            <link rel="stylesheet" type="text/css" href="gaudiBar.widget/lib/plugins/istats/style.css"></link>
                {
                    Object.keys(data).map(key => {
                        return (
                            <div key={key} className="gaudi-bar-section-widget-section stat">
                                <span key={key} className="gaudi-bar-section-widget-section">
                                    <i className={"gaudi-icon icon " + getIcon(data, key)}></i>
                                    {
                                        key == "cpu" ? (<span className="text">{getValue(data, key)}</span>) : null

                                    }
                                </span>
                            </div>
                        );
                    })
                }
            </div>
        );

    })

}