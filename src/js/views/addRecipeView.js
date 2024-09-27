//IMPORTS-------------------------------------------------------------------
import View from './View.js';
import icons from 'url:../../img/icons.svg';

//CLASS-------------------------------------------------------------------
class AddRecipeView extends View {
  _parentElement = document.querySelector('.upload');
  _message = 'Recipe was succesfully uploaded :)';

  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');

  ////--------------------------------////

  constructor() {
    super();
    this._addhandlerShowWindow();
    this._addHandlerCloseWindow();
  }

  ////--------------------------------////

  toggleWindow() {
    this._overlay.classList.toggle('hidden');
    this._window.classList.toggle('hidden');
  }

  ////--------------------------------////

  _addhandlerShowWindow() {
    this._btnOpen.addEventListener('click', this.toggleWindow.bind(this));
  } //listening the event of opening and closing the btns. we want to remove the hidden class. we use toggle because it will add the class and remove it if it is there. we want this to be called as soon as the page loads.Now, in this case, this has nothing to do with any controller because there is nothing special happening here that the controller needs to tell us, that's why we can run this function as soon as this object is created.
  //so what I'm gonna do is to this time add a constructor method (see above), then since this is a child class (AddRecipeView child class of View), we need to start by calling super. And so only after that, we can use the this keywords. And then let's say, this.addHandlerShowWindow. And because addHandlerShowWindow is now only gonna be used inside of this class.we add an underscore to mark it as protected.

  ////--------------------------------////

  _addHandlerCloseWindow() {
    this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
    this._overlay.addEventListener('click', this.toggleWindow.bind(this));
  } //is for closing the window by clicking the x or outside of it

  ////--------------------------------////

  addHandlerUpload(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      const dataArr = [...new FormData(this)]; //So let's say data = and then we can create a newFormData and into the form data constructor, we have to pass in an element that is a form. And so that form in this case is the this keyword, right? Because we are inside of a handler function. And so this points to this.parentElement, which is of course the upload form.Now this here will then return a weird object that we cannot really use, but we can actually spread that object into an array.And so this will then basically give us an array, which contains all the fields with all the values we want.
      const data = Object.fromEntries(dataArr); //this is to make the array of entrie to an object

      //console.log(dataArr); //So let's then lock that data to the console. Now let's think what we actually want to do with this data eventually. So this data right here is the data that we eventually will want to use to upload to the API, right? And that action of uploading the data is going to be just another API call, right? And where do API calls happen?Well, they happen in the model. And so therefore we will need a way of getting this data to the model. So just like we did many times before, we now need to create a controller function, which will then be the handler of this event, okay?
      handler(data);
    });
  } //this function is for submiting the form.To get access in all the values of the recipe data we can use smthg that is called FormData,that's a pretty modern browser API that we can now make use of.

  _generateMarkup() {}
}

//CREATE OBJECT-------------------------------------------------------------------
export default new AddRecipeView(); //we will have to import this object here in the controller still because otherwise, our main script so the controller will never execute this file. And so then this object here will never be created. And so the event listener here will never be added.
