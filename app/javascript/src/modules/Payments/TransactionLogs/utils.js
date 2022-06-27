import { currencies } from '../../../utils/constants';
import { objectAccessor } from '../../../utils/helpers';

export default function flutterwaveConfig(authState, inputValue, t) {
  const communityCurrency = objectAccessor(currencies, authState.user.community.currency);
  const config = {
    public_key: authState.user.community.paymentKeys?.public_key,
    tx_ref: Date.now(),
    amount: inputValue.amount,
    currency: communityCurrency,
    payment_options: '',
    customer: {
      email: authState.user.email,
      phonenumber: authState.user.phonenumber,
      name: authState.user.name
    },
    customizations: {
      title: t('payment:misc.pay_for_item'),
      description: inputValue.description,
      logo:
        'https://st2.depositphotos.com/4403291/7418/v/450/depositphotos_74189661-stock-illustration-online-shop-log.jpg'
    }
  };

  return {
    config,
    communityCurrency
  };
}


 export function closeFlutterwaveModal() {
   document.getElementsByName('checkout').forEach(item => {
     item.setAttribute(
       'style',
       'position:fixed;top:0;left:0;z-index:-1;border:none;opacity:0;pointer-events:none;width:100%;height:100%;'
     );
     item.setAttribute('id', 'flwpugpaidid');
     item.setAttribute('src', 'https://checkout.flutterwave.com/?');
     document.body.style.overflow = '';
   });
 }