/**
 * Initializes the flashcards functionality.
 */
function initFlashcards() {
    var grid = document.querySelector("zing-grid");

    if (!grid) {
        console.warn("zing-grid element not found");
        return;
    }
    setResponsiveMode();
    console.log("Default/Initial Mode is", getCurrentMode());
}

/**
 * Opens and closes the card size menu
 */
function setupCardSizeMenu() {
    var button = document.getElementById("cardSizeButton");
    var menu = document.getElementById("cardSizeMenu");

    if (!button || !menu) {
        return;
    }

    button.addEventListener("click", function (event) {
        event.stopPropagation();

        var isOpen = menu.classList.toggle("open");

        button.setAttribute(
            "aria-expanded",
            isOpen ? "true" : "false"
        );
    });

    menu.addEventListener("click", function (event) {
        event.stopPropagation();
    });

    document.addEventListener("click", function () {
        menu.classList.remove("open");
        button.setAttribute(
            "aria-expanded",
            "false"
        );
    });
}


/**
 * Sets the grid to Responsive mode.
 */
function setResponsiveMode() {
    var grid = document.querySelector("zing-grid");

    if (!grid) {
        return;
    }

    grid.setAttribute("card-mode", "responsive");
    grid.removeAttribute("card-size");
    grid.style.removeProperty("--zg-card-columns");

    var slider = document.getElementById("cardResponsiveSlider");

    if (slider) {
        slider.dispatchEvent(new Event("input"));
    }
}

/**
 * Sets the grid to Fixed mode.
 */
function setFixedMode() {
    var grid = document.querySelector("zing-grid");

    if (!grid) {
        return;
    }

    grid.setAttribute("card-mode", "fixed");
    grid.removeAttribute("card-size");

    var slider = document.getElementById("cardFixedSlider");
    if (slider) {
        slider.dispatchEvent(new Event("input"));
    }
}

/**
 * Gets current the 'card-mode' attribute value
 * @returns mode value: responsive or fixed 
 */
function getCurrentMode() {
    var grid = document.querySelector("zing-grid");
    const currentMode = grid.getAttribute('card-mode');

    return currentMode;
}

/**
 * Updates the toggle label text based on toggle state.
 *
 * @param {HTMLInputElement} toggle - Toggle checkbox
 */
function updateToggleLabel(toggle) {
    var label = document.getElementById('toggleLabel');

    if (!label) {
        return;
    }

    label.textContent = toggle.checked ? 'Responsive' : 'Fixed';
}

/**
 * Sets up the Responsive / Scale mode toggle.
 */
function setupModeSwitching() {
    var toggle = document.getElementById('cardSizeModeToggle');

    if (!toggle) {
        return;
    }

    toggle.addEventListener("change", function () {
        handleModeChange(toggle);
        updateToggleLabel(toggle);
    });
}

/**
 * Handles switching between Responsive and Fixed modes.
 *
 * @param {HTMLInputElement} input - Toggle checkbox
 */
function handleModeChange(input) {
    const minMaxScale = document.getElementById("minMaxScale");
    const responsiveScale = document.getElementById("cardResponsiveScale");
    const fixedScale = document.getElementById("cardFixedScale");

    // Checked = Responsive, Unchecked = Fixed
    if (input.checked) {
        setResponsiveMode();

        minMaxScale.classList.remove("disabled");
        responsiveScale.classList.remove("disabled");

        fixedScale.classList.add("disabled");
    }
    else {
        setFixedMode();

        minMaxScale.classList.add("disabled");
        responsiveScale.classList.add("disabled");

        fixedScale.classList.remove("disabled");
    }

    console.log("Mode changed to:", getCurrentMode());
}

/**
 * Allows users to choose a fixed set of cards per row and
 * card width adjusts to fill the available grid space
 * @returns 
 */
function activateFixedMode() {
    var slider = document.getElementById("cardFixedSlider");
    var body = document.querySelector("zg-body");

    if (!slider || !body) {
        return;
    }

    slider.addEventListener("input", function () {
        var columns = Number(slider.value);

        body.style.display = "grid";
        body.style.gap = "15px";
        body.style.gridTemplateColumns = "repeat(" + columns + ", 1fr)";
    });

    slider.dispatchEvent(new Event("input"));
}

/**
 * Controls the size of the cards (XS–XL), and the # of cards per row changes 
 * automatically based on the available screen width with CSS media queries
 * @returns 
 */
function activateResponsiveMode() {
    var slider = document.getElementById("cardResponsiveSlider");
    var grid = document.querySelector("zing-grid");

    if (!slider || !grid) {
        return;
    }

    var cardSizes = [
        "xs",
        "s",
        "m",
        "l",
        "xl"
    ];

    slider.addEventListener("input", function () {
        var value = Number(slider.value);
        var size = cardSizes[value - 1];

        if (!size) {
            return;
        }

        grid.setAttribute("card-mode", "scale");
        grid.setAttribute("card-size", size);

        applyMinMaxRange();
    });

    slider.dispatchEvent(new Event("input"));
}

function applyMinMaxRange() {
    var minInput = document.querySelector(".min-range");
    var maxInput = document.querySelector(".max-range");
    var grid = document.querySelector("zing-grid");

    if (!minInput || !maxInput || !grid) {
        return;
    }

    var min = Number(minInput.value);
    var max = Number(maxInput.value);

    grid.style.removeProperty("--zg-card-columns");

    var columnWidth = parseFloat(
        getComputedStyle(grid).getPropertyValue("--zg-card-columns")
    );

    if (!columnWidth) {
        return;
    }

    var columns = Math.round(100 / columnWidth);

    columns = Math.max(min, Math.min(columns, max));

    grid.style.setProperty(
        "--zg-card-columns",
        (100 / columns) + "%"
    );
}

/**
 * Updates slider fill as user drags it
 * @param {*} slider 
 */
function updateSliderFill(slider) {
    var min = Number(slider.min);
    var max = Number(slider.max);
    var value = Number(slider.value);

    var percentage = ((value - min) / (max - min)) * 100;

    slider.style.background = `linear-gradient(to right, var(--range-slider-fill) 0%, var(--range-slider-fill) ${percentage}%, var(--slider-track-color) ${percentage}%, var(--slider-track-color) 100%)`;
}

/**
 * Updates the current value label to reflect the exact value from slider
 * @param {*} slider 
 * @param {*} label 
 * @param {*} values 
 * @returns 
 */
function updateSliderLabel(slider, label, values) {
    var value = Number(slider.value);

    if (!label) {
        return;
    }

    label.textContent = values[value - 1];
}

/**
 * Setting up the general scale slider (responsive and fixed)
 * @param {*} sliderId 
 * @param {*} labelId 
 * @param {*} values 
 * @returns 
 */
function setupScaleSlider(sliderId, labelId, values) {
    var slider = document.getElementById(sliderId);
    var label = document.getElementById(labelId);

    if (!slider) {
        return;
    }

    slider.addEventListener("input", function () {
        updateSliderFill(slider);
        updateSliderLabel(slider, label, values);
    });

    slider.dispatchEvent(new Event("input"));
}

/**
 * Sets up Min/Max dual-range slider
 */
function setupMinMaxSlider() {
    var minInput = document.querySelector(".min-range");
    var maxInput = document.querySelector(".max-range");
    var minDisplay = document.querySelector(".min-input");
    var maxDisplay = document.querySelector(".max-input");
    var innerRange = document.querySelector(".inner-range-slider");

    if (!minInput || !maxInput || !minDisplay || !maxDisplay || !innerRange) {
        return;
    }

    function updateRangeSlider() {
        var minValue = Number(minInput.value);
        var maxValue = Number(maxInput.value);
        var minNumber = Number(minInput.min);
        var maxNumber = Number(minInput.max);

        // Update displayed values
        minDisplay.value = minValue;
        maxDisplay.value = maxValue;

        // Update inner range slider position and width
        var minPercent = ((minValue - minNumber) / (maxNumber - minNumber)) * 100;
        var maxPercent = ((maxValue - minNumber) / (maxNumber - minNumber)) * 100;

        innerRange.style.left = minPercent + "%";
        innerRange.style.right = (100 - maxPercent) + "%";

        applyMinMaxRange();
    }

    minInput.addEventListener("input", updateRangeSlider);
    maxInput.addEventListener("input", updateRangeSlider);

    updateRangeSlider();
}

window.addEventListener("DOMContentLoaded", function () {
    initFlashcards();

    setupCardSizeMenu();
    setupModeSwitching();

    setupScaleSlider(
        "cardResponsiveSlider",
        "currentResponsiveSize",
        ["XS", "S", "M", "L", "XL"]
    );

    setupScaleSlider(
        "cardFixedSlider",
        "currentFixedSize",
        ["1", "2", "3", "4", "5", "6"]
    );

    activateResponsiveMode();
    activateFixedMode();

    setupMinMaxSlider();
});



