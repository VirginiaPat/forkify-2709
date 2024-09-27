//IMPORTS-------------------------------------------------------------------
import View from './View.js';
import icons from 'url:../../img/icons.svg';

//CLASS-------------------------------------------------------------------
class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  ////--------------------------------////

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;

      const goToPage = +btn.dataset.goto;
      handler(goToPage);
    });
  } //we need to use the publisher subscriber pattern, that works by creating a publisher,which is basically a function which is the one listening for the event (addHandlerClick) which receives a handler function, which in our case, is going to be a controller that lives in the controller module. And so with this, we will then be able to listen for the event here in the view where it makes sense, while at the same time, being able to handle that event from the controller, Now here we are going to use event delegation, because there are going to be two buttons, but of course, we don't want to listen to each of them individually. So instead, we will add the event listener to the common parent element, which is indeed this.parentElement. we have a function, because we cannot immediately call the handler that comes in here, because first, we will need to figure out which button was actually clicked, based on the event.So in this case we can simply create a button element and select the closest button element to the clicked element.

  ////--------------------------------////
  _generateMarkup() {
    const curPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    ); //Math.ceil is for turning 5.9 to 6
    // console.log(numPages);

    // Page 1, and there are other pages
    if (curPage === 1 && numPages > 1) {
      return this._generateMarkupButton(curPage, true);
    }

    // Last page
    if (curPage === numPages && numPages > 1) {
      return this._generateMarkupButton(curPage, false);
    }

    // Other page
    if (curPage < numPages) {
      return `
          ${this._generateMarkupButton(curPage, true)}
          ${this._generateMarkupButton(curPage, false)}
          `;
    }

    // Page 1, and there are NO other pages
    return '';
  }

  _generateMarkupButton(curPage, isNextPage) {
    const dataGoTo = isNextPage ? curPage + 1 : curPage - 1;

    return `
      <button data-goto="${dataGoTo}" class="btn--inline ${
      isNextPage ? 'pagination__btn--next' : 'pagination__btn--prev'
    }">
        <svg class="search__icon">
          <use href="${icons}${
      isNextPage ? '#icon-arrow-right' : '#icon-arrow-left'
    }"></use>
        </svg>
        <span>Page ${dataGoTo}</span>
      </button>
    `;
  }
}

//CREATE OBJECT-------------------------------------------------------------------
export default new PaginationView();
