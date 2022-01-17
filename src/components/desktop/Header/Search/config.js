export function getSearchApi() {
  return {
    endpoint: 'https://suggestqueries.google.com/complete/search',
    params: [
      {
        key: 'client',
        value: 'youtube',
      },
    ],
  };
}
export default { getSearchApi };
