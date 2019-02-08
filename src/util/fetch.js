/**
 * fetch
 */

//import preact from 'preact';
//import fetch from 'unfetch';

export function checkStatus(response, promiseStep) {
  if (response.ok){
    return response;
  } else {
    let error = new Error(`While processing ${promiseStep}: ${response.statusText}`);
    error.response = response;
    return Promise.reject(error);
  }
}

export default checkStatus;