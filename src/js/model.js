//IMPORTS-------------------------------------------------------------------
import { API_URL, RES_PER_PAGE, KEY } from './config.js';
// import { getJSON, sendJSON } from './helpers.js'; -we refactored this one to AJAx fuction-just keeo it for reference
import { AJAX } from './helpers.js';

//-------------------------------------------------------------------------------

//STATE OBJECT-----------------------------------------------------------------
export const state = {
  recipe: {},
  search: {
    query: '', //Now, in this case, we might not even need the query for now, but it's still a good idea to already store it here in the state, because maybe one day we will need it. For example, we might want to add some analytics in the future to know which queries are made the most.
    results: [],
    page: 1, //we set it to 1 by default
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
};

//-------------------------------------------------------------------------------

//changing the names of the recipe properties--------------------------
const createRecipeObject = function (data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }), //nice trick to conditionally add properties to an object.remember that the && operator short-circuits. So if recipe.key is a falsy value, so if it doesn't exist, then nothing happens here, right. And so then destructuring here, well does basically nothing. Now, if this actually is some value, then the second part of the operator is executed and returned. And so in that case, it is this object here basically ({key:recipe.key}) that is going to be returned. And so then this whole expression will become that object. And so then we can spread that object to basically put the values here. And so that will then be the same as if the values would be out here like this, key: recipe.key.
  };
};

//-------------------------------------------------------------------------------

//loadRecipe is responsible for fetching data from API. we export it so we can use it in the controller- it is changing the state object
export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}/${id}?key=${KEY}`);
    state.recipe = createRecipeObject(data);

    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false; // we want to keep bookmarked a recipe, and because we load it every time from the API what we can do is to check if there is already a recipe with the same ID in the bookmarks state. And if it is then we will mark the current recipe that we just loaded from the API as bookmarked set to true.And so with this, all the recipes that we now load we'll always have bookmarked set to either true or false.
    console.log(state.recipe);
    ////--------------------------------////
  } catch (err) {
    //Temp error handling
    console.error(`${err}!!!!!!!`);
    throw err; // we are throwing again the error so that we have access to the "console.error(`${err}!!!!!!!`);" for the renderError function of the recipeView module
  }
};

//-------------------------------------------------------------------------------

//IMPLEMENT THE SEARCH FUNCTIONALITY
//it's going to perfonm ajax call so it's an async function that is going to be called by the controller.And so, it's going to be the controller who will tell this function what it would actually search for.So basically, it will pass in a query like string, which we can then pluck into our API call
export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;

    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`); //we add & to add the key here and not ? because we already have a parameter (the search)

    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }),
      };
    }); //data.data.recipes is the array of all objects that we receive from the search and we want to create a new array which contains the new objects where the properties are different and then we will store the new object in the state. state contains all the data that we need to build our application

    state.search.page = 1; //we do that because if we search something else we need to strart from the page 1 again

    // console.log(data);
    ////--------------------------------////
  } catch (err) {
    console.error(`${err}!!!!!!!`);
    throw err;
  }
};

// loadSearchResults('pizza');

//-------------------------------------------------------------------------------

//IMPLEMENT PAGINATION
//it's not an async function because we already have loaded the results at the point we want to call this function
export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.resultsPerPage; //0
  const end = page * state.search.resultsPerPage; //9

  return state.search.results.slice(start, end);
};

//-------------------------------------------------------------------------------

//IMPLEMENT UPDATING SERVINGS // what this function will do is to reach into the state, and in particular into the recipe ingredients,and then change the quantity in each ingredient
export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
    //newQt=oldQt * newServings / oldServings //2*8/4=4
  });

  state.recipe.servings = newServings; //In order to finish, we also need to update the servings in the state. Because otherwise, if we tried to update the servings twice, then by the second time, we would still be using the old value of two servings. And so of course, we need to update this value. So state.recipe.servings, needs to be the newServings. And we're doing that here at the end of the function, because otherwise, we could not preserve this old. So this original value here.
};

//-------------------------------------------------------------------------------

//PERSIST BOOKMARK - STORE THE BOOKMARKS IN THE LOCAL STORAGE//with this we don't lose our bookmarks when the page reloads.
const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks)); //this one we don't need to export because we simply will call it in these other two functions. Here, all we have to do is local storage.setItem. Then here we can give that item a name. So that's bookmarks. And then here, we need to set a string. And we do that by calling Json.stringify and then with the object that we basically want to convert to a string. And so that is state.bookmarks. and all we have to do is to call this function into addBookmark and deleteBookmark functions
};

//-------------------------------------------------------------------------------

//IMPLEMENT ADDING BOOKMARKS // this function  this will receive basically a recipe and then it will set that recipe as a bookmark
export const addBookmark = function (recipe) {
  //Add bookmark
  state.bookmarks.push(recipe);

  //Mark current recipe as bookmark
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  persistBookmarks();
};

//-------------------------------------------------------------------------------

//IMPLEMENT DELETING BOOKMARKS //this one will simply receive an ID because that is actually simpler. And this is a common pattern that you will see in programming when we add something we get the entire data. And when we want to delete something, we only get to the ID.
export const deleteBookmark = function (id) {
  //Delete bookmark
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1);

  //Mark current recipe as NOT bookmarked
  if (id === state.recipe.id) state.recipe.bookmarked = false;

  persistBookmarks();
};

//-------------------------------------------------------------------------------

//TAKING A BOOKMARK OUT OF THE LOCAL STORAGE //when the page is loaded, we then want to run a method which will basically render the bookmarks in the bookmarks view. So the first step in doing that, is to actually get the bookmarks out of the local storage and back into our code. And then after that, we can then, render them back to this bookmarks view
const init = function () {
  const storage = localStorage.getItem('bookmarks'); //I'm not storing it directly into our state, because this data might not be defined actually. we might have nothing in the storage

  if (storage) state.bookmarks = JSON.parse(storage); //so only if there is storage, then we want state.bookmarks to be Json.parse, which is basically to convert the string back to an object.
};

init();
// console.log(state.bookmarks);

//-------------------------------------------------------------------------------

//FUNCTION FOR DEBUGING - it is only for development
const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};

// clearBookmarks(); -it will work when calling it only if the above init function is enabled

//-------------------------------------------------------------------------------

//SENDING THE NEW RECIPE DATA TO THE FORKIFY API.- it will make a request to the API so it's going to be an async function.the first task of this function here will be to take the raw input data and transform it into the same format as the data that we also get out of the API.
export const uploadRecipe = async function (newRecipe) {
  try {
    // console.log(Object.entries(newRecipe));
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        const ingArr = ing[1].split(',').map(el => el.trim()); //Because with replaceAll if we had two words like tomato sauce then the result was one word  instead of this replaceAll here, we will split the string into multiple parts,which will then return an array. And then I will loop over that array and trim each of the elements. So map to create a new array. Let's just call it element here and then just return element.trim
        // const ingArr = ing[1].replaceAll(' ', '').split(',');
        if (ingArr.length !== 3)
          throw new Error(
            'Wrong ingredient format! please use the correct format'
          );
        const [quantity, unit, description] = ingArr;
        return { quantity: quantity ? +quantity : null, unit, description };
      });

    ////--------------------------------////

    //create the object that will be uploaded
    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };

    // console.log(recipe);

    ////--------------------------------////

    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe); //this will actually send the recipe then back to us. And so let's store that as data and also await it
    state.recipe = createRecipeObject(data); //refactoring the recipe and creating the createRecipeObject we can use it when we get data from the API but also when after sending them
    addBookmark(state.recipe); //we are adding the bookmark because there wasn't any
    ////--------------------------------////
  } catch (err) {
    throw err;
  }
};
