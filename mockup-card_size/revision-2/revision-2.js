/**
 * Stores the current settings for each mode.
 *
 * Each mode remembers its own settings while the user
 * switches between Responsive and Fixed.
 */
var cardSizeSettings = {
    responsive: {
        scale: 3,
        min: 1,
        max: 6
    },
    fixed: {
        columns: 4
    }
};


const RESPONSIVE_LABELS = ["XS", "S", "M", "L", "XL"];
const FIXED_LABELS = ["1", "2", "3", "4", "5", "6"];
const CARD_WIDTHS = {
    1: 140, // XS
    2: 180, // S
    3: 220, // M
    4: 260, // L
    5: 300  // XL
};
const CARD_GAP = 15;


/**
 * Initializes flashcard functionality.
 */
function initFlashcards() {
    var grid = document.querySelector("zing-grid");

    if (!grid) {
        console.warn("zing-grid element not found");
        return false;
    }

    return true;
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

        button.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    menu.addEventListener("click", function (event) {
        event.stopPropagation();
    });

    document.addEventListener("click", function () {
        menu.classList.remove("open");
        button.setAttribute("aria-expanded", "false");
    });
}


/**
 * Gets current card mode
 *
 * @returns {"responsive"|"fixed"|null}
 */
function getCurrentMode() {
    var grid = document.querySelector("zing-grid");

    return grid
        ? grid.getAttribute("card-mode")
        : null;
}


/**
 * Applies a column count to the card grid
 *
 * Shared by both Responsive and Fixed modes
 *
 * @param {number} columns
 */
function applyGridColumns(columns) {
    var body = document.querySelector("zg-body");

    if (!body) {
        return;
    }

    body.style.display = "grid";
    body.style.gap = CARD_GAP + "px";

    body.style.gridTemplateColumns = "repeat(" + columns + ", minmax(0, 1fr))";
}


/**
 * Updates slider fill and label
 *
 * @param {HTMLInputElement} slider
 * @param {HTMLElement|null} label
 * @param {string[]} values
 */
function updateSliderUI(slider, label, values) {
    if (!slider) {
        return;
    }

    var min = Number(slider.min);
    var max = Number(slider.max);
    var value = Number(slider.value);

    var percentage = ((value - min) / (max - min)) * 100;

    slider.style.background =
        `linear-gradient(
            to right,
            var(--range-slider-fill) 0%,
            var(--range-slider-fill) ${percentage}%,
            var(--slider-track-color) ${percentage}%,
            var(--slider-track-color) 100%
        )`;

    if(label){
        label.textContent = values[value - 1];
    }
}


/**
 * Generic slider setup
 *
 * Handles:
 * - restoring initial value
 * - slider fill
 * - slider label
 * - input callback
 *
 * @param {Object} options
 */
function setupSlider(options) {
    var slider = document.getElementById(options.sliderId);
    var label = document.getElementById(options.labelId);

    if (!slider) {
        return;
    }

    slider.value = options.initialValue;

    function update() {
        updateSliderUI(slider, label, options.values);

        if (options.onInput) {
            options.onInput(Number(slider.value));
        }
    }

    slider.addEventListener("input", update);
    update();
}

/**
 * Set to Responsive mode
 */
function setResponsiveMode() {
    var grid = document.querySelector("zing-grid");

    if (!grid) {
        return;
    }

    grid.setAttribute("card-mode", "responsive");

    var slider = document.getElementById("cardResponsiveSlider");
    var label = document.getElementById("currentResponsiveSize");

    if (slider){
        slider.value = cardSizeSettings.responsive.scale;
        updateSliderUI(slider, label, RESPONSIVE_LABELS);
    }

    var minInput = document.querySelector(".min-range");
    var maxInput = document.querySelector(".max-range");

    if(minInput){
        minInput.value = cardSizeSettings.responsive.min;
    }

    if(maxInput){
        maxInput.value = cardSizeSettings.responsive.max;
    }

    applyResponsiveLayout();
}


/**
 * Set to Fixed mode
 */
function setFixedMode() {
    var grid = document.querySelector("zing-grid");

    if (!grid) {
        return;
    }

    grid.setAttribute("card-mode", "fixed");

    var slider = document.getElementById("cardFixedSlider");
    var label = document.getElementById("currentFixedSize");

    if(slider){
        slider.value = cardSizeSettings.fixed.columns;
        updateSliderUI(slider, label, FIXED_LABELS);
    }

    applyFixedColumns();
}

/**
 * Updates the mode toggle label.
 *
 * @param {HTMLInputElement} toggle
 */
function updateToggleLabel(toggle) {
    var label = document.getElementById("toggleLabel");

    label.textContent = toggle.checked ? "Responsive" : "Fixed";
}


/**
 * Manage switching between Responsive and Fixed
 *
 * @param {HTMLInputElement} toggle
 */
function handleModeChange(toggle) {
    var responsive = toggle.checked;

    var minMaxScale = document.getElementById("minMaxScale");
    var responsiveScale =document.getElementById("cardResponsiveScale");
    var fixedScale = document.getElementById("cardFixedScale");

    if(minMaxScale) {
        minMaxScale.classList.toggle("disabled", !responsive);
    }

    if(responsiveScale) {
        responsiveScale.classList.toggle("disabled",!responsive );
    }

    if (fixedScale) {
        fixedScale.classList.toggle("disabled", responsive);
    }

    updateToggleLabel(toggle);

    if(responsive) {
        setResponsiveMode();
    }
    else {
        setFixedMode();
    }
}


/**
 * Sets up Responsive / Fixed mode toggle
 */
function setupModeSwitching() {
    var toggle = document.getElementById("cardSizeModeToggle");
            
    toggle.addEventListener("change", function () {
        handleModeChange(toggle);
    });

    handleModeChange(toggle);
}


/**
 * Applying the Fixed column count
 */
function applyFixedColumns() {
    applyGridColumns(
        cardSizeSettings.fixed.columns
    );
}


/**
 * Sets up the Fixed slider
 */
function setupFixedSlider() {
    setupSlider({
        sliderId: "cardFixedSlider",
        labelId: "currentFixedSize",
        values: FIXED_LABELS,

        initialValue: cardSizeSettings.fixed.columns,

        onInput: function (value) {
          
            cardSizeSettings.fixed.columns = value;

            if (getCurrentMode() === "fixed") {
                applyFixedColumns();
            }
        }
    });
}


/**
 * Sets up the Responsive scale slider
 */
function setupResponsiveSlider() {
    setupSlider({
        sliderId: "cardResponsiveSlider",
        labelId: "currentResponsiveSize",
        values: RESPONSIVE_LABELS,
        initialValue: cardSizeSettings.responsive.scale,

        onInput: function (value) {
            cardSizeSettings.responsive.scale = value;

            if (getCurrentMode() === "responsive") applyResponsiveLayout();
        }
    });
}


/**
 * Applies the Responsive layout.
 *
 * Scale controls approximate card width.
 * Available width determines how many cards fit
 * Min / Max limit the resulting column count
 */
function applyResponsiveLayout() {
    if (getCurrentMode() !== "responsive") {
        return;
    }

    var body = document.querySelector("zg-body");

    if(!body){ return; }

    var settings = cardSizeSettings.responsive;
    var minCardWidth = CARD_WIDTHS[settings.scale] || 220;
    var availableWidth = body.clientWidth;

    if(!availableWidth) { return; }

    var columns = Math.floor((availableWidth + CARD_GAP) / (minCardWidth + CARD_GAP));

    columns = Math.max(settings.min, Math.min(columns, settings.max));

    applyGridColumns(columns);
}


/**
 * Sets up Min / Max dual-range slider
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

        if (minValue > maxValue) {
            minValue = maxValue;
            minInput.value = minValue;
        }

        cardSizeSettings.responsive.min = minValue;
        cardSizeSettings.responsive.max = maxValue;

        minDisplay.value = minValue;
        maxDisplay.value = maxValue;

        var range = maxNumber - minNumber;
        var minPercent = ((minValue - minNumber) / range) * 100;
        var maxPercent = ((maxValue - minNumber) / range) * 100;

        innerRange.style.left = minPercent + "%";
        innerRange.style.right = (100 - maxPercent) + "%";

        if (getCurrentMode() === "responsive") {
            applyResponsiveLayout();
        }
    }

    minInput.addEventListener("input", updateRangeSlider);
    maxInput.addEventListener("input", updateRangeSlider);

    updateRangeSlider();
}

/**
 * Recalculate Responsive layout when available browser width changes.
 */
function setupResponsiveResize() {
    window.addEventListener("resize", function () {
        if(getCurrentMode() === "responsive") {
            applyResponsiveLayout();
        }
    }
    );
}

window.addEventListener( "DOMContentLoaded",
    function () {
        if (!initFlashcards()) {
            return;
        }

        setupCardSizeMenu();
        setupResponsiveSlider();
        setupFixedSlider();
        setupMinMaxSlider();

        setupModeSwitching();
        setupResponsiveResize();
    }
);