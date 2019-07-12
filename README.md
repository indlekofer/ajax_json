# @indlekofer/ajax_json

[![npm version](https://badge.fury.io/js/%40indlekofer%2Fajax_json.svg)](https://badge.fury.io/js/%40indlekofer%2Fajax_json)

## Usage

```js
import request from '@indlekofer/ajax_json';

let setting = {};
request(settings)
  .then((req) => {
    console.log(req.status);
    //containes the parsed json object
    console.log(req.responseBody);
  }, (req) => {
    //e.g.: timeout or json parser problems
    console.log(req.error);
  })
```

## Parameters

  **settings**: *object* settings  
  **req**: *object* (default XMLHttpRequest)   

## Settings

*settings objekt*

  **url**: *string* (default: '/')  
  **method**: *string* (default: 'GET')  
  **body**: *object* request body  
  **query**: *object* request get  
  **async**: *bool* (default: true)  
  **withCredentials**: *bool* (default: false) seend cookies  
  **auth**: *string* (default false) base64 encoded authentication string

## Errors

*compare the req.error with the given error code constants*

  **ERROR_JSON**: invalid json response  
  **ERROR_TIMEOUT**: the request timed out  
  **ERROR_REJECT**: rejected request. e.g.: cors  

