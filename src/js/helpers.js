//the goal of this file or of this module is to contain a couple of functions that we reuse over and over in our project. And so here in this module we then have a central place for all of them basically

//IMPORTS-------------------------------------------------------------------
import { TIMEOUT_SEC } from './config.js';

//-------------------------------------------------------------------------------

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
}; //what this function does,is that it will return a new promise.So this promise here,which will reject after a certain number of seconds.And so in order to now use this function here,we will have a race between this time out promise which will take whatever seconds we pass into it, and this fetch function here, which is the one responsible for getting the data.And then whatever occurs first will win the race

//-------------------------------------------------------------------------------

//AJAX call -for refactoring the getJSON and sendJSON methods. we set the upload data=udefined because when we call it as the get JSOn there are no data to upload
export const AJAX = async function (url, uploadData = undefined) {
  try {
    const fetchPro = uploadData
      ? fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(uploadData),
        })
      : fetch(url);

    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message} (${res.status})`);

    return data;
  } catch (err) {
    throw err;
  }
};

//-------------------------------------------------------------------------------
/* -- we refactored the below code. it's the AJAX function
// it's gonna be an async function which will basically do the fetching and also converting to JSON all in one step
export const getJSON = async function (url) {
  try {
    //1) Loading the data(recipe)from the API-----------------------------
    const fetchPro = fetch(url);
    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]); //res stands for response. the fetch will create a promise and since we are in an async function we await this promise. once we have the results we need to convert them in JSON: (i explain why we use Promise.race above)
    const data = await res.json(); //json is a method that is available on all response objects. and a response object is exactly what the fetch function returns

    if (!res.ok) throw new Error(`${data.message} (${res.status})`);

    return data; //we want to return the data
  } catch (err) {
    throw err; //the error is actually occurring in the getJSON function,not in the module model( function loadRecipe).so, when there's going to be an error here in this function,then the promise that the getJSON function returns is actually still being fulfilled. So it's still basically a successful promise even if there happened an error here. But we want the error message inside the model module that is why we re-throw the error.And so now with this, the promise that's being returned from getJSON will actually reject.
  }
};

//-------------------------------------------------------------------------------

//this function will send the new recipe to the API using the fetch function
export const sendJSON = async function (url, uploadData) {
  try {
    const fetchPro = fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }, //headers are basically some snippets of text, which are like information about the request itself. And many of them are like standard headers. And one that we need to define is the Content Type. And then here application/JSON, and so with this we tell the API that the data that we're gonna send is going to be in the JSON format. And so only then our API can correctly accept that data and create a new recipe in the database
      body: JSON.stringify(uploadData),
    }); //up until this point, all we ever did was to simply pass in a URL into the fetch function and that would then automatically create a get request. However, to send data, we need  a post request. And so here besides passing in the URL we also need to pass in an object of some options

    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message} (${res.status})`);

    return data;
  } catch (err) {
    throw err;
  }
};
*/
