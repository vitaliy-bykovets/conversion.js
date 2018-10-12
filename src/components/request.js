import { isFunction } from "../utils/type";

export function request(url, callback, failCallback) {

  const xhttp = new XMLHttpRequest();

  const pageLoaded = () => {
    if (xhttp.status >= 200 && xhttp.status < 400) {
      if (isFunction(callback)) callback(xhttp.responseText, url);
    } else if (xhttp.status == 404) {
      if (isFunction(failCallback)) failCallback(url);
    }
  };

  xhttp.addEventListener('load', pageLoaded);

  xhttp.onerror = function() {
    if (isFunction(failCallback)) failCallback(url);
  };

  xhttp.open("GET", url, true);
  xhttp.send();
}