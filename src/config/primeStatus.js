export const primeConfig = {
  activePrimeUserPrcArr: [1, 3, 4, 5, 8],
  notPrimeStatus: {
    0: {
      status: 'not_a_times_prime_user',
      ctaText: 'Start Free Trial',
      ctaFormType: 'verifyMobileScreen',
    },
  },
  subscriptionExpiredStatus: {
    2: {
      status: 'free_trial_expired',
      ctaText: 'Subscribe Now',
      headingMsg: 'Your free trial ended on',
      ctaFormType: 'paymentScreen',
    },
    4: {
      status: 'free_trial_with_payment_expired',
      ctaText: 'Subscribe Now',
      headingMsg: 'Your free trial ended on',
      ctaFormType: 'paymentScreen',
    },
    6: {
      status: 'subscription_expired',
      ctaText: 'Subscribe Now',
      headingMsg: 'Your subscription ended on',
      ctaFormType: 'paymentScreen',
    },
    7: {
      status: 'subscription_cancelled',
      ctaText: 'Subscribe Now',
      headingMsg: 'Your subscription ended on',
      ctaFormType: 'paymentScreen',
    },
  },
};

export default primeConfig;
