// into this file, we will basically put all the variables that should be constants and should be reused across the project. And the goal of having this file with all these variables is that it will allow us to easily configure our project by simply changing some of the data that is here in this configuration file.The only variables that we do want here are the ones that are responsible for kind of defining some important data about the application itself
export const API_URL = 'https://forkify-api.herokuapp.com/api/v2/recipes'; //I'm using uppercase here, because this is basically a constant that will never change.And so using uppercase for that kind of variable is kind of a common practiceespecially in a configuration file like this

export const TIMEOUT_SEC = 10;

export const RES_PER_PAGE = 10;

export const KEY = 'a9cf90c3-7f3b-4d10-9476-3a6e37730db8';

export const MODAL_CLOSE_SEC = 2.5;

export const LOCATION_RELOAD_SEC = 1;
