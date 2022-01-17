import { useState, useEffect } from 'react';
import makeRequest from 'utils/makeRequest';

const useFetch = config => {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  //console.log('************ useFetch', config);
  const get = async reqParams => {
    let res;
    try {
      // console.log(
      //   '************ useFetch get ',
      //   reqParams.url,
      //   reqParams.options,
      //   reqParams.headers,
      // );
      res = await makeRequest.get(
        reqParams.url,
        reqParams.options,
        reqParams.headers,
      );
      setResponse(res);
    } catch (err) {
      setError(err);
    }
    return res;
  };
  const post = async reqParams => {
    let res;
    try {
      res = await makeRequest.post(
        reqParams.url,
        reqParams.options,
        reqParams.headers,
      );
      setResponse(() => res);
      //console.log('************ useFetch useEffect post', res, response);
    } catch (err) {
      setError(err);
    }
    return res;
  };

  useEffect(
    () => {
      //console.log('************ inside useEffect', config);
      if (config.url) {
        get(config);
      }
    },
    [config.url],
  );
  // console.log(
  //   '************ useFetch useEffect return **** ',
  //   config.url,
  //   response,
  // );
  return { response, error, get, post };
};

export default useFetch;
