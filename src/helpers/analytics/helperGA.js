import ga from './gaWrapper';

export default function trackTimeSpentGA(action) {
  let timer = 0;
  // CALL AFTER EVERY 15 Secs

  const timerInterval = setInterval(() => {
    timer += 1;
    ga('send', 'event', 'TimeSpent', `${timer * 15}sec`, action);

    // STOP TIMER AFTER 3 Mins
    if (timer === 12) {
      clearInterval(timerInterval);
    }
  }, 15000);

  return timerInterval;
}
