/**
 * fetch
 */

//import preact from 'preact';
import fetch from 'unfetch';

function ffetch(toFetch){return fetch(toFetch).then(checkStatus)};

function checkStatus(response){
  if (response.ok){
    return response;
  } else {
    var error = new Error(response.statusText);
    error.response = response;
    return Promise.reject(error);
  }
}

export default ffetch

