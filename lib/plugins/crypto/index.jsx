
import { css } from "uebersicht"
import * as Utils from '../../utils'

export const refreshFrequency = 900000;

const gaudi_widget_crypto = css`background: #34495e`

const COINS = require('./coins');

const CURRENCY = String(COINS.currency || 'USD').toUpperCase();
const CURRENCY_SYMBOLS = { USD: '$', EUR: '€', GBP: '£' };
// Currencies without a known symbol are shown by their code, e.g. "CHF 1.2"
const PRICE_PREFIX = CURRENCY_SYMBOLS[CURRENCY] || `${CURRENCY} `;

export const render = () => {

    const symbols = COINS.primary.concat(COINS.secondary).join(',').toUpperCase();
    const url = `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=${encodeURIComponent(symbols)}&convert=${encodeURIComponent(CURRENCY)}`;
    // The key is fed to curl on stdin so it never appears in the process list
    const command = `${Utils.readSecret('GAUDI_COINMARKETCAP_API_KEY', 'lib/plugins/crypto/keys.secret.js')}; if [ -n "$secret" ]; then ${Utils.curlSecretConfig('header', 'X-CMC_PRO_API_KEY: ')} | curl -fsSL ${Utils.CURL_TIMEOUTS} --config - ${Utils.shellQuote(url)} || true; fi`;

    return Utils.runWithLocalEnv(command).then((output) => {
        try {
            if (!output) return Utils.emptyWidget();

            const coins = Utils.parseJson(output);
            if (!coins || !coins.data) return Utils.emptyWidget();

            const roundPrice = (amount, precision) => {
                let _precision = Math.pow(10, precision);
                return Math.round(amount * _precision) / _precision
            }

            const renderCoin = (__coin, index, className) => {
                const coin = coins.data[__coin.toUpperCase()];
                if (!coin || !coin.quote || !coin.quote[CURRENCY]) return null;

                const quote = coin.quote[CURRENCY];
                const trendClass = quote.percent_change_1h > 0 ? 'gaudi-crypto-green' : 'gaudi-crypto-red';

                return (
                    <span key={`${__coin}-${index}`} className={className}>
                        <span className={`gaudi-icon cf cf-${__coin.toLowerCase()}`}></span>
                        <span className={trendClass}>{PRICE_PREFIX}{roundPrice(quote.price, 4)} </span>
                    </span>
                )
            }

            return (
                <div className={`gaudi-bar-section-widget gaudi-widget-crypto ${gaudi_widget_crypto}`}>
                <link rel="stylesheet" type="text/css" href={Utils.widgetPath('lib/plugins/crypto/fonts/crypto.css')}></link>
                <link rel="stylesheet" type="text/css" href={Utils.widgetPath('lib/plugins/crypto/style.css')}></link>
                    {
                        COINS.primary.map((__coin, index) => {
                            return renderCoin(__coin, index, 'gaudi-bar-section-widget-section')
                        })
                    }
                    <span className={`gaudi_widget_details ${gaudi_widget_crypto}`}>
                        {
                            COINS.secondary.map((__coin, index) => {
                                return renderCoin(__coin, index, 'gaudi_widget_detail')
                            })
                        }
                    </span>
                </div>
            );
        } catch (error) {
            console.error("[ERROR] Rendering the CoinMarketCap API response", error);
            return Utils.emptyWidget();
        }
    }).catch(() => Utils.emptyWidget())
}
