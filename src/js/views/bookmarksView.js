//IMPORTS-------------------------------------------------------------------
import View from './View.js';
import previewView from './previewView.js';
import icons from 'url:../../img/icons.svg';

//CLASS-------------------------------------------------------------------
class BookMarksView extends View {
  _parentElement = document.querySelector('.bookmarks__list');

  _errorMessage = 'No bookmarks yet. Find a nice recipe and bookmark it :)';
  _message = '';

  ////--------------------------------////
  //before we take the data (bookmarks) from the local storage we need to render them right at the beginning when we load the page.
  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }

  ////--------------------------------////

  _generateMarkup() {
    // console.log(this._data);
    return this._data
      .map(bookmark => previewView.render(bookmark, false))
      .join('');
  }

  ////--------------------------------////
}

//CREATE OBJECT-------------------------------------------------------------------
export default new BookMarksView();
