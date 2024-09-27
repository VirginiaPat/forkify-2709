//we use class because later we will have a parent class View which will have methods that all the views should inharite and that makes everything easiest to implement. also we want every view to have a couple of methods and properties privet

import View from './View';

class SearchView extends View {
  _parentElement = document.querySelector('.search');

  ////--------------------------------////

  getQuery() {
    const query = this._parentElement.querySelector('.search__field').value;
    this._clearInput();
    return query;
  } //it's a method that we then call from the controller

  ////--------------------------------////

  _clearInput() {
    return (this._parentElement.querySelector('.search__field').value = '');
  }

  ////--------------------------------////

  addHandlerSearch(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      handler(); // this handler function should be the controlSearchFunction
    });
  } //this is going to be the publisher. we add the eventListener to the parentEl, not only the button but the entire form. that way it will work not only if we click the submit button but also if we hit enter
}

//CREATE OBJECT-------------------------------------------------------------------
//we create a new object and export it. so noone outside of this class will have access exept from the object. we don't pass any data in the new object so we don't need any constractor
export default new SearchView();
