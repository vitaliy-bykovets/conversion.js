import { isFunction } from "../utils/type";
import { error } from "../utils/log";

/**
 * XMLHttpRequest
 *
 * @param {String} url
 * @param {Function} callback
 * @param {Function} failCallback
 * @returns {Void}
 */
export function request(url, callback, failCallback) {

  const xhttp = new XMLHttpRequest();

  const pageLoaded = () => {
    if (xhttp.status >= 200 && xhttp.status < 400) {

      if (isFunction(callback)) {
        callback(xhttp.responseText, url);
      } else {
        error('callback for request is not a function');
      }

    } else if (xhttp.status == 404) {

      if (isFunction(failCallback)) {
        failCallback(url);
      } else {
        error('fail callback for request is not a function');
      }

    }
  };

  xhttp.addEventListener('load', pageLoaded);

  xhttp.onerror = function() {
    if (isFunction(failCallback)) {
      failCallback(url);
    } else {
      error('fail callback for request is not a function');
    }
  };

  xhttp.open("GET", url, true);
  xhttp.send();
}