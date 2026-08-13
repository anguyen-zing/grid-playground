/**
 * Sets the size of the flashcard grid based on the number of columns
 * @param {*} columns - refers to the number of columns for the grid layout
 * @returns 
 */
function setCardSize(columns) {
    const body = document.querySelector("zg-body");
    if (!body) return;

    body.style.display = "grid";
    body.style.gap = "15px";
    body.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
}

/**
 * Initializes the flashcards functionality by setting up event listeners and observers for the zing-grid element.
 * @returns 
 */
function initFlashcards() {
  const grid = document.querySelector('zing-grid');

  if (!grid) {
    console.warn('zing-grid element not found');
    return;
  }

  ['render', 'afterload', 'load', 'afterrender'].forEach(evt => {
    grid.addEventListener(evt, () => {
      setCardSize(document.getElementById('cardSize').value);
    });
  });

  const observer = new MutationObserver(() => {
    setCardSize(document.getElementById('cardSize').value);
  });

  observer.observe(grid, {
    childList: true,
    subtree: true
  });

  setTimeout(() => {
    setCardSize(document.getElementById('cardSize').value);
  }, 500);
}

/**
 * Sets up the custom "Card Sizing" dropdown (#cardSize / #cardSizeOptions).
 * Uses event delegation on document so it keeps working even if zing-grid
 * re-renders or replaces the dropdown markup after initial load.
 * @returns 
 */
function initCardSizeDropdown() {

  const setInitialValue = () => {
    const cardSizeEl = document.getElementById('cardSize');
    const cardSizeOptions = document.getElementById('cardSizeOptions');
    if (!cardSizeEl || !cardSizeOptions) return false;

    const initialSelected = cardSizeOptions.querySelector('.card-size-option.selected')
        || cardSizeOptions.querySelector('.card-size-option');

    if (initialSelected) {
      cardSizeEl.value = initialSelected.dataset.value;
      setCardSize(cardSizeEl.value);
    }
    return true;
  };

  setInitialValue();
  setTimeout(setInitialValue, 500); 

  document.addEventListener('click', (e) => {
    const cardSizeOptions = document.getElementById('cardSizeOptions');
    const cardSizeEl = document.getElementById('cardSize');
    if (!cardSizeOptions || !cardSizeEl) return;

    const clickedOption = e.target.closest('.card-size-option');
    const clickedToggle = e.target.closest('#cardSize');

    if (clickedOption) {
      e.stopPropagation();
      cardSizeOptions.querySelector('.selected')?.classList.remove('selected');
      clickedOption.classList.add('selected');
      cardSizeOptions.classList.remove('open');

      cardSizeEl.value = clickedOption.dataset.value;
      cardSizeEl.dispatchEvent(new Event('input', { bubbles: true }));
    } else if (clickedToggle) {
      e.stopPropagation();
      cardSizeOptions.classList.toggle('open');
    } else {
      cardSizeOptions.classList.remove('open');
    }
  });
}

window.addEventListener('DOMContentLoaded', () => {
  initFlashcards();
  initCardSizeDropdown();

  const option = document.getElementById("cardSize");
  option.addEventListener("input", () => {
        setCardSize(option.value);
    });
});