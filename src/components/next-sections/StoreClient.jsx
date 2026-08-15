'use client';

import { tinaField } from '../tina/editable';
import { countdownLabel } from '../../lib/schedule';

export default function StoreClient({ store, daysLeft }) {
  const count = countdownLabel(daysLeft);
  const products = store.products ?? [];

  return (
    <div id="store" className="section section--mid">
      <div className="store-grid">
        <div className="store-copy">
          <div className="kicker kicker--rule">TEAM STORE</div>
          <h2 data-tina-field={tinaField(store, 'headline')} className="section-title">{store.headline}</h2>
          {count && <div data-tina-field={tinaField(store, 'close_date')} className="countdown-pill">{count} TO ORDER</div>}
          <p data-tina-field={tinaField(store, 'body')} className="section-intro">{store.body}</p>
          <div className="store-cta">
            <a data-tina-field={tinaField(store, 'cta_label')} href={store.url} target="_blank" rel="noopener noreferrer" className="btn btn--red">{store.cta_label} →</a>
          </div>
        </div>
        {products.length > 0 && (
          <div data-tina-field={tinaField(store, 'products')} className="store-shots">
            {products.map((product, i) => (
              <img key={i} className="store-shot" src={product.image} alt={product.alt} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
