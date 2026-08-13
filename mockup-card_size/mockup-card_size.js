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

window.addEventListener('DOMContentLoaded', () => {
  initFlashcards();
  
  const slider = document.getElementById("cardSize");
  setCardSize(slider.value);
  slider.addEventListener("input", () => {
        setCardSize(slider.value);
    });
});

