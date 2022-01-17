import analyticsWrapper from 'helpers/analytics/analyticsWrapper';

export default function gaWrapper(...args) {
  analyticsWrapper('gaAndGrx', ...args);
}
