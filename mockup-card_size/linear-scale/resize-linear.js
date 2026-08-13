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
      const slider = document.getElementById('cardSizeSlider');

      if (slider) {
        setCardSize(7 - Number(slider.value));
      }
    });
  });

  const observer = new MutationObserver(() => {
    const slider = document.getElementById('cardSizeSlider');

    if (slider) {
      setCardSize(7 - Number(slider.value));
    }
  });

  observer.observe(grid, {
    childList: true,
    subtree: true
  });

  setTimeout(() => {
    const slider = document.getElementById('cardSizeSlider');

    if (slider) {
      setCardSize(7 - Number(slider.value));
    }
  }, 500);
}

window.addEventListener('DOMContentLoaded', () => {
  initFlashcards();

  const button = document.getElementById("cardSizeButton");
  const menu = document.getElementById("cardSizeMenu");
  const slider = document.getElementById("cardSizeSlider");
  const currentSize = document.getElementById("currentSize");
  const points = document.querySelectorAll(".scale-points span");

  const cardsPerRow = [
    "6 Cards Per Row",
    "5 Cards Per Row",
    "4 Cards Per Row",
    "3 Cards Per Row",
    "2 Cards Per Row",
    "1 Card Per Row"
  ];

  if (!button || !menu || !slider) {
    return;
  }

  button.addEventListener("click", (event) => {
    event.stopPropagation();
    menu.classList.toggle("open");
  });

  menu.addEventListener("click", (event) => {
    event.stopPropagation();
  });

  document.addEventListener("click", () => {
    menu.classList.remove("open");
  });

  slider.addEventListener("input", () => {
    const value = Number(slider.value);
    const columns = 7 - value;

    setCardSize(columns);

    if (currentSize) {
      currentSize.textContent = cardsPerRow[value - 1];
    }

    points.forEach((point, index) => {
      point.style.backgroundColor =
        index === value - 1 ? "#2196F3" : "#999999";
    });
  });

  slider.dispatchEvent(new Event("input"));
});