// https://forkify-api.herokuapp.com/v2

//IMPORTS-------------------------------------------------------------------
import * as model from './model.js'; //import everything as model from the module model
import { MODAL_CLOSE_SEC, LOCATION_RELOAD_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

import 'core-js/stable'; //we import core and regenerator so that old browsers are being supported by our applications - this one is for polyfilling everything else
import 'regenerator-runtime/runtime'; //is for polyfilling async - await
//-------------------------------------------------------------------------------

// if (module.hot) {
//   module.hot.accept();
// } //this is not real javascript. it's coming from parcel

//-------------------------------------------------------------------------------

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1); //window.location is the intire url and then we can take out the # using the slice method
    // console.log(id);

    if (!id) return; // se periptosi pou den eXei id na emfanizete i selida

    //0)Update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());

    //1) Updating bookmarks view
    bookmarksView.update(model.state.bookmarks);

    //2) Render the spinner before the recipe arrives---------------------
    recipeView.renderSpinner();

    //3) Loading the data(recipe)from the API-----------------------------
    await model.loadRecipe(id); //we use the model because it's a named export and we insert everything from the model. it is an async function so it is going to return a promise and we need to await it

    //4) Rendering recipe------------------------
    recipeView.render(model.state.recipe);
    //
  } catch (err) {
    console.log(err);
    recipeView.renderError();
  }
};

//-------------------------------------------------------------------------------

const controlSearchResults = async function () {
  try {
    //0. Render spinner
    resultsView.renderSpinner();
    // console.log(resultsView);

    //1. Get search query
    const query = searchView.getQuery();
    if (!query) return;

    //Load search results
    await model.loadSearchResults(query);

    //Render results
    resultsView.render(model.getSearchResultsPage());

    //Render the initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
}; //here we want to call the loadSearchResults from the model.just like  the controlRecipes this one doesn't return anything, it only manipulates the state object in model module.
//in order to actually make this work, we now need to listen for the event of basically clicking this button (search) or submitting this form. And then, only on that event,we want to actually call, this controller function here (controlSearchResults).So not in the beginning when the script loads. we are going to use the Publisher-Subscriber pattern

//-------------------------------------------------------------------------------

//Controller that will be executed whenever a click on one of the buttons happens
const controlPagination = function (goToPage) {
  // 1) Render NEW results
  resultsView.render(model.getSearchResultsPage(goToPage));

  // 2) Render NEW pagination buttons
  paginationView.render(model.state.search);
};

//-------------------------------------------------------------------------------

//UPDATING RECIPE SERVINGS
const controlServings = function (newServings) {
  //Update the recipe servings (in state object)
  model.updateServings(newServings);

  //Update the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe); //we used render() in the begining but in order to avoid rendering the whole recipe view, which causes problems as it downloads the image again we switch to update.  the difference between update and render is that the update method will basically only update text and attributes in the DOM. So without having to re-render the entire view. this update method comes from the View module
};

//-------------------------------------------------------------------------------

//ADDING / DELETING A BOOKMARK + RENDER BOOKMARK LIST
const controlAddBookmark = function () {
  //Add/remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  //Update recipe view
  recipeView.update(model.state.recipe);

  //Render bookmarks
  bookmarksView.render(model.state.bookmarks); //in the state we didn't only store the IDs of the bookmarks, but really we stored the entire data about the bookmarks.So that we can nicely display them in the bookmarks list
};

//-------------------------------------------------------------------------------

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

//-------------------------------------------------------------------------------

const controlAddRecipe = async function (newRecipe) {
  try {
    //Render spinner
    addRecipeView.renderSpinner();

    //Upload the new recipe data
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    //Render recipe
    recipeView.render(model.state.recipe);

    //Success message
    addRecipeView.renderMessage();

    //Render bookmark view- adds the new element to the bookmark view.  we are not using the update method here because we really want to insert a new element
    bookmarksView.render(model.state.bookmarks);

    //Change ID in the URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`); //window.history:that is the history API of the browsers. And then on this history object, we can call the pushState method. And so this will basically allow us to change the URL without reloading the page. Now, pushState takes three arguments. And this first one is called a state which doesn't really matter. You can just specify null. Then the second one is the title which is actually also not relevant. So we can just use an empty string. And then the one that actually is important is the third one, because this one is actually the URL. And so here we can simply put the hash and then the ID that we want to put onto the URL. So that is @model.state.recipe.id. note for anothersituation window.history.back: is for going back to the last page

    //Close form window- we set a timeout because we want first to display a message
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);

    ////--------------------------------////
  } catch (err) {
    console.error('!!!', err);
    addRecipeView.renderError(err.message);
  }
  setTimeout(function () {
    location.reload();
  }, LOCATION_RELOAD_SEC * 1000);
}; //this function recives the newRecipe data

//-------------------------------------------------------------------------------

//Publisher/subscriber pattern
const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
