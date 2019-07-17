
import { run, css } from "uebersicht"

export const refreshFrequency= 1000000;

const gaudi_widget_crypto = css`background: transparent`

const COINS = require('./coins');

export const render = () => {

    return run(`curl -s https://api.coinmarketcap.com/v1/ticker/`).then((output) => {

        try {

            const coins = JSON.parse(output);

            const roundPrice = (amount, precision) => {
                let _precision = Math.pow(10, precision);
                return Math.round(amount * _precision) / _precision
            }

            return (
                <div className={`gaudi-bar-section-widget gaudi-widget-crypto ${gaudi_widget_crypto}`}>
                <link rel="stylesheet" type="text/css" href="gaudiBar.widget/lib/plugins/crypto/fonts/crypto.css"></link>
                <link rel="stylesheet" type="text/css" href="gaudiBar.widget/lib/plugins/crypto/style.css"></link>
                    {
                        COINS.primary.map((primaryCoin, index) => {

                            let _primaryCoin = coins.find(__coin => { return __coin.symbol.toLowerCase() == primaryCoin });
                            return (
                                <span key={index} className="gaudi-bar-section-widget-section">
                                    <span className={`cf cf-${_primaryCoin.symbol.toLowerCase()}`}></span>
                                    <span className={_primaryCoin.percent_change_1h > 0 ? 'gaudi-crypto-green' : 'gaudi-crypto-red'}> ${roundPrice(_primaryCoin.price_usd, 4)} </span>
                                </span>
                            )
                        })
                    }
                    <span className='gaudi_crypto_details'>
                        {
                            COINS.secondary.map((secondaryCoin, index) => {
                                let _secondaryCoin = coins.find(__coin => { return __coin.symbol.toLowerCase() == secondaryCoin });
                                {
                                    return (
                                        <span key={index} className="gaudi_crypto_detail">
                                            <span className={`gaudi-icon cf cf-${_secondaryCoin.symbol.toLowerCase()}`}></span>
                                            <span className={_secondaryCoin.percent_change_1h > 0 ? 'gaudi-crypto-green' : 'gaudi-crypto-red'}>${roundPrice(_secondaryCoin.price_usd, 4)} </span>
                                        </span>

                                    )
                                }
                            })
                        }
                    </span>
                </div>
            );
        } catch (error) {
            console.log("[ERROR] Making CoinTracker API Request", error);
        }
    })

}