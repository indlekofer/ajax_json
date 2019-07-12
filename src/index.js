import formatUrl from '@indlekofer/format_url';
import Promise from 'promise'; 
import {
  ERROR_TIMEOUT,
  ERROR_JSON,
  ERROR_REJECT
} from './constants';
export {
  ERROR_TIMEOUT,
  ERROR_JSON,
  ERROR_REJECT
};

export const config = (settings) => {
  //defaults
  settings.url = settings.url || '/';
  settings.query = settings.query || {};
  settings.method = settings.method || 'GET';
  settings.async = settings.async || true;
  settings.header = settings.header || {};
  settings.withCredentials = settings.withCredentials || false;
  settings.timeout = settings.timeout || 3000;

  if (typeof settings.auth == 'undefined' || settings.auth === null || settings.auth === '' || !settings.auth) {
    settings.auth = false;
  }
  if (typeof settings.body == 'undefined' || settings.body === null || settings.body === '' || !settings.body) {
    settings.body = false;
  } else {
    settings.body = JSON.stringify(settings.body, undefined, 0);
  }

};

export default (settings, req = new XMLHttpRequest()) => {
  return new Promise((resolve, reject) => {
    //var req = new XMLHttpRequest();
    //mutate settings with some defaults
    config(settings);
    //callbacks
    req.onreadystatechange = () => {
      if (req.readyState === 4) {
        if (req.status == 0 && req.statusText == null) {
          req.error = ERROR_REJECT;
          reject(req);
        } else {
          req.error = false;
          try {
            if (req.responseText == '') req.responseBody = {};
            else req.responseBody = JSON.parse(req.responseText);
            resolve(req);
          } catch (e) {
            req.error = ERROR_JSON;
            reject(req);
          }
        }
      }
    };

    req.ontimeout = () => {
      req.error = ERROR_TIMEOUT;
      reject(req);
    };

    req.open(settings.method, formatUrl(settings.url, settings.query), settings.async);
    req.withCredentials = settings.withCredentials;
    req.timeout = settings.timeout;
    //headers
    req.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
    req.setRequestHeader('Accept', 'application/json');
    req.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    if (settings.auth !== false) req.setRequestHeader('Authentication', settings.auth);
    //send
    if (!settings.body) req.send();
    else req.send(settings.body);
  });
};

