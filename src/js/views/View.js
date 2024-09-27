//IMPORTS-------------------------------------------------------------------
import icons from 'url:../../img/icons.svg'; //for any static assets that are not programming file we use url - //the html,that is displayed in the browser is from the dist folder and all the images and assets are coming from this folder and that includes the icons. we need to tell js that the icons come from the src folder. that's why we importing the icons file

//CLASS-------------------------------------------------------------------

export default class View {
  _data;

  ////--------------------------------////
  /**
   * Render the received object to the DOM
   * @param {Object | Object[]} data The data to be rendered(e.g. recipe)
   * @param {boolean} [render=true] if false, create markup string instead of rendering to the DOM
   * @returns {undefined | string} A markup string is returned if render = false
   * @this {object} View instance
   * @author Virginia Patrika
   * @todo Finish implementation
   */

  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();
    //So if there is no data, then we want to return immediately and we also want to render the error. So we can do that all in one line and this will then still work. So this.renderError and we actually don't even have to pass in any message because we already automatically get the message from this._errorMessage. Now, however, in this case, this check is actually not enough because in fact, we do get data. It's just an empty array and so in this case, we also want to treat the empty array as though we had no data. So this here basically only works for undefined  or for null. But now we also want to check if the received data is an array and if it is empty. So we can do that by saying so if there is no data or and then basically, if the data is an array and if it's empty. And we can do that by using a helper function that is on the Array constructor, which is isArray. So we can check that. And so if it's an array and the length of the array is zero basically, data.length zero,well,in this case, exit this function immediately and also render the error, okay?

    this._data = data;
    const markup = this._generateMarkup();

    if (!render) return markup;
    this._clear();

    //insert the markup into the parent element:
    this._parentElement.insertAdjacentHTML('afterbegin', markup); //after begin is as a first child
  }

  ////--------------------------------////
  //what we will do here in this method is to create newMarkup but not render it. So instead, all that we're gonna do is to generate this Markup and then compare that new HTML to the current HTML. And then only change text and attributes that actually have changed from the old version to the new version.
  update(data) {
    this._data = data;

    const newMarkup = this._generateMarkup(); //So here we now have the Markup but that is just a string. And so that is gonna be very difficult to compare to the DOM elements that we currently have on the page. And so to fix that problem, we can actually use a nice trick, which is to basically convert this Markup string to a DOM object that's living in the memory and that we can then use to compare with the actual DOM that's on the page.

    const newDOM = document.createRange().createContextualFragment(newMarkup); //newDOM here will become like a big object, which is like a virtual DOM. So a DOM that is not really living on the page but which lives in our memory.And so we can now use that DOM as if it was the real DOM on our page

    const newElements = Array.from(newDOM.querySelectorAll('*')); // after that we need to compare the new elements with the current elements
    const curElements = Array.from(this._parentElement.querySelectorAll('*')); //because this and the previous return a node list we need to convert them to arrays, that's why we use Array.from

    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];
      // console.log(curEl, newEl.isEqualNode(curEl)); //the isEqualNode ig going to compaire the curEl and the newEl

      //Updates changed TEXT
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        curEl.textContent = newEl.textContent;
      } //what we want to replace is only the text. there is a property that is available in all nodes :nodeValue. if node is text we get the content of the text node. the first child will return a node. and we need to sellect the first child because it is what is actually contains the text. also this text should not be empty. we also trim any white spaces. we also add some optional chaining (?) because the first child might not always exist

      //Updates changed ATTRIBUTES // whenever an element changes,we also want to change the attributes
      if (!newEl.isEqualNode(curEl))
        Array.from(newEl.attributes).forEach(attr =>
          curEl.setAttribute(attr.name, attr.value)
        );
    });
  }

  ////--------------------------------////

  _clear() {
    this._parentElement.innerHTML = '';
  } //delete all the existing markups-  //to see the results we need to insert the markup into the DOM an specifically in the parent element with the class .recipe. but before that we need to get rid of all markups that are already there- this way we delete the exixsting message

  ////--------------------------------////

  //Rendering a spinner before the recipe arrives. we create an external - generic function for this:
  renderSpinner() {
    const markup = `
      <div class="spinner">
        </svg>
      </div>`;

    this._clear(); //we clear rhe element before inserting anything
    this._parentElement.insertAdjacentHTML('afterbegin', markup); //we need to add this markup to the DOM as a child of the parent element
  }

  ////--------------------------------////

  renderError(message = this._errorMessage) {
    const markup = ` 
    <div class="error">
      <div>
        <svg>
          <use href="${icons}#icon-alert-triangle"></use>
        </svg>
      </div>
      <p>${message}</p>
    </div>`;

    this._clear(); //we clear rhe element before inserting anything
    this._parentElement.insertAdjacentHTML('afterbegin', markup); //we need to add this markup to the DOM as a child of the parent element
  }
  ////--------------------------------////

  renderMessage(message = this._message) {
    const markup = ` 
    <div class="message">
      <div>
        <svg>
          <use href="${icons}#icon-smile"></use>
        </svg>
      </div>
      <p>${message}</p>
    </div>`;

    this._clear(); //we clear rhe element before inserting anything
    this._parentElement.insertAdjacentHTML('afterbegin', markup); //we need to add this markup to the DOM as a child of the parent element
  }
  ////--------------------------------////
}
