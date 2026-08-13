/**
 * Initializes the flashcards functionality.
 */
function initFlashcards() {
  var grid = document.querySelector("zing-grid");

  if (!grid) {
    console.warn("zing-grid element not found");
    return;
  }

  // Default card size
  setCardSize("m");
}

/**
 * Sets the card size on the ZingGrid element.
 *
 * @param {string} size - xs, s, m, l, or xl
 */
function setCardSize(size) {
  var grid = document.querySelector("zing-grid");

  if (!grid) {
    return;
  }

  grid.setAttribute("card-size", size);
}


/**
 * Initialize flashcard controls once the DOM is ready.
 */
window.addEventListener("DOMContentLoaded", function () {
  initFlashcards();

  var button = document.getElementById("cardSizeButton");
  var menu = document.getElementById("cardSizeMenu");
  var slider = document.getElementById("cardSizeSlider");
  var currentSize = document.getElementById("currentSize");
  var points = document.querySelectorAll(".scale-points span");

  /*
   * Slider values:
   * 1 = XS
   * 2 = S
   * 3 = M
   * 4 = L
   * 5 = XL
   */
  var cardSizes = [
    "xs",
    "s",
    "m",
    "l",
    "xl"
  ];

  if (!button || !menu || !slider) {
    return;
  }

  /**
   * Open and close the card size menu.
   */
  button.addEventListener("click", function (event) {
    event.stopPropagation();

    menu.classList.toggle("open");
  });

  /**
   * Prevent clicks inside the menu from closing it.
   */
  menu.addEventListener("click", function (event) {
    event.stopPropagation();
  });

  /**
   * Close the menu when clicking anywhere outside of it.
   */
  document.addEventListener("click", function () {
    menu.classList.remove("open");
  });

  /**
   * Update the card size when the slider changes.
   */
  slider.addEventListener("input", function () {
    var value = Number(slider.value);
    var size = cardSizes[value - 1];

    if (!size) {
      return;
    }

    // Update the ZingGrid card size.
    setCardSize(size);

    // Update the text below the slider.
    if (currentSize) {
      currentSize.textContent = size.toUpperCase();
    }

    // Update the slider points.
    points.forEach(function (point, index) {
      if (index === value - 1) {
        point.style.backgroundColor = "#2196F3";
      } else {
        point.style.backgroundColor = "#999999";
      }
    });
  });

  /**
   * Set the initial slider state.
   */
  slider.dispatchEvent(new Event("input"));
});