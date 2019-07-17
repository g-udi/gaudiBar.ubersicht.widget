import { run, css } from "uebersicht"

export const refreshFrequency = 100;

const gaudi_mini_icon = css`font-size: 7px;`
const gaudi_activeScreen = css`font-size: 14px; color: #19cb00`

export const render = () => {


    return run(`bash gaudiBar.widget/lib/plugins/screens/screens`).then((output) => {

        const values = output.split('@');

        const active = parseInt(values[1]);
        const total = parseInt(values[2]);

        //apply a proper number tag so that space change controls can be added

        const createScreens = (active, total) => {
            let screens = [];
            for (let i = 1, end = total, asc = 1 <= end; asc ? i <= end : i >= end; asc ? i++ : i--) {
                if (i === active) {
                    screens.push(<span key={`screen${i}`} className={`gaudi-icon ${gaudi_mini_icon} fas fa-square gaudi_screen ${gaudi_activeScreen} screen${i}`}></span>);
                } else {
                    screens.push(<span key={`screen${i}`} className={`gaudi-icon ${gaudi_mini_icon} fas fa-square gaudi_screen screen${i}`}></span>);
                }
            }
            return <span className="gaudi-flex" >{screens}</span>;
        }

        return (
            <div className="gaudi-bar-section-widget">
                <span className='gaudi-content__spaced'>{createScreens(active, total)}</span>
            </div>
        )
    })
}

