export const PAYPAL_DONATE_URL = 'https://www.paypal.com/ncp/payment/MBXG99R6K3G6E';

const POPUP_NAME = 'paypal-donate';
const POPUP_FEATURES = 'width=500,height=700,resizable=yes,scrollbars=yes';

// PayPal's checkout page sends X-Frame-Options: SAMEORIGIN, so it can't be
// embedded in an iframe modal like the Google Form was — a real popup window
// is the closest equivalent browsers allow. Opening the window first (rather
// than relying on the form's target to create it) lets repeat clicks reuse
// and focus the same window instead of stacking up new ones.
export function openPayPalDonate() {
  const popup = window.open('', POPUP_NAME, POPUP_FEATURES);

  const form = document.createElement('form');
  form.action = PAYPAL_DONATE_URL;
  form.method = 'post';
  form.target = POPUP_NAME;
  document.body.appendChild(form);
  form.submit();
  form.remove();

  popup?.focus();
}
