/**
 * Colorizes the subject tags in the flashcards based on predefined colors.
 */
function colorizeTags() {
  const subjectTagColors = {
    biology: '#4ab54f',
    math: '#3a9dee',
    physics: '#eab734',
    chemistry: '#bc3030',
    english: '#5f3acf',
    history: '#1b5df7',
    art: '#f886c8',
    'misc.': '#4f7587'
  };

  document.querySelectorAll('div[data-field-index="tag"]').forEach(el => {
    const tag = el.textContent.trim().toLowerCase();
    if (subjectTagColors[tag]) {
      el.style.background = subjectTagColors[tag];
    }
  });
}

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
      colorizeTags();
      setCardSize(document.getElementById('cardSize').value);
    });
  });

  const observer = new MutationObserver(() => {
    colorizeTags();
    setCardSize(document.getElementById('cardSize').value);
  });

  observer.observe(grid, {
    childList: true,
    subtree: true
  });

  setTimeout(() => {
    colorizeTags();
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

