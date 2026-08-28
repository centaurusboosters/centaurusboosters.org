'use client';

import { tinaField } from '../tina/editable';
import { openPayPalDonate } from '../../lib/paypal';

export default function DonateClient({ site }) {
  return (
    <div id="donate" className="section">
      <div className="section-head">
        <div className="kicker kicker--rules kicker--center">DONATE</div>
        <h2 data-tina-field={tinaField(site?.donate, 'headline')} className="section-title">{site.donate.headline}</h2>
        <p data-tina-field={tinaField(site?.donate, 'body')} className="section-intro">{site.donate.body}</p>
      </div>
      <div className="paypal-donate">
        <button data-tina-field={tinaField(site?.donate, 'cta_label')} type="button" onClick={openPayPalDonate} className="btn btn--red">{site.donate.cta_label} →</button>
        <div className="paypal-donate-info">
          <img className="paypal-donate-cards" src="https://www.paypalobjects.com/images/Debit_Credit_APM.svg" alt="Visa, Mastercard, and other cards accepted" />
          <p className="paypal-donate-powered">
            Powered by <img className="paypal-wordmark" src="https://www.paypalobjects.com/paypal-ui/logos/svg/paypal-wordmark-color.svg" alt="PayPal" />
          </p>
        </div>
      </div>
    </div>
  );
}
