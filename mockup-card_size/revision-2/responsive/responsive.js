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

    updateResponsiveColumns();
}


/**
 * Sets the grid to manual Card Scale mode.
 *
 * @param {string} size - xs, s, m, l, or xl
 */
function setCardSize(size) {
    var grid = document.querySelector("zing-grid");

    if (!grid) {
        return;
    }

    grid.setAttribute("card-mode", "scale");
    grid.setAttribute("card-size", size);

    grid.style.removeProperty("--zg-card-columns");
}


/**
 * Calculates the number of cards shown per row
 * in Responsive mode.
 */
function updateResponsiveColumns() {
    var grid = document.querySelector("zing-grid");

    if (!grid || grid.getAttribute("card-mode") !== "responsive") {
        return;
    }

    var gridWidth = grid.clientWidth;

    if (!gridWidth) {
        return;
    }

    var minimumCardWidth = 280;
    var columns = Math.floor(gridWidth / minimumCardWidth);

    columns = Math.max(columns, 1);
    columns = Math.min(columns, 6);

    var columnWidth = 100 / columns;

    grid.style.setProperty("--zg-card-columns", columnWidth + "%");

    updateResponsiveStatus(columns);
}


/**
 * Updates the responsive status text.
 *
 * @param {number} columns - Number of cards per row
 */
function updateResponsiveStatus(columns) {
    var responsiveStatus = document.getElementById("responsiveStatus");

    if (!responsiveStatus) {
        return;
    }

    if (columns === 1) {
        responsiveStatus.textContent =
            "Responsive: " + columns + " card per row";
    } 
    else {
        responsiveStatus.textContent =
            "Responsive: " + columns + " cards per row";
    }
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
 * Sets up the Responsive / Scale mode radio buttons.
 */
function setupModeSwitching() {
    var modeInputs = document.querySelectorAll('input[name="cardSizeMode"]');

    modeInputs.forEach(function (input) {
        input.addEventListener("change", function () {
            handleModeChange(input);
        });
    });
}


/**
 * Handles switching between Responsive and Scale modes.
 *
 * @param {HTMLInputElement} input - Selected radio button
 */
function handleModeChange(input) {
    var cardSizeScale = document.getElementById("cardSizeScale");
    var responsiveStatus = document.getElementById("responsiveStatus");

    if (input.value === "responsive" && input.checked) {
        setResponsiveMode();

        if(cardSizeScale){
            cardSizeScale.classList.add("disabled");
        }

        if(responsiveStatus){
            responsiveStatus.classList.add("visible");
        }

        return;
    }

    if (input.value === "scale" && input.checked) {
        var slider = document.getElementById("cardSizeSlider");

        var cardSizes = [
            "xs",
            "s",
            "m",
            "l",
            "xl"
        ];

        var value = Number(slider.value);
        var size = cardSizes[value - 1];

        if(size){ 
            setCardSize(size); 
        }

        if(cardSizeScale){
            cardSizeScale.classList.remove("disabled");
        }

        if (responsiveStatus){
            responsiveStatus.classList.remove("visible");
        }
    }
}


/**
 * Sets up the card size slider.
 */
function setupCardSizeSlider() {
    var slider = document.getElementById("cardSizeSlider");

    if (!slider) {
        return;
    }

    slider.addEventListener("input", function () {
        updateCardSizeFromSlider(slider);
    });
}


/**
 * Updates the card size based on the slider value.
 *
 * @param {HTMLInputElement} slider - Card size slider
 */
function updateCardSizeFromSlider(slider) {
    var currentSize = document.getElementById("currentSize");
    var cardSizeScale = document.getElementById("cardSizeScale");

    var responsiveStatus = document.getElementById("responsiveStatus");

    var points = document.querySelectorAll(".scale-points span");

    var cardSizes = [
        "xs",
        "s",
        "m",
        "l",
        "xl"
    ];

    var value = Number(slider.value);
    var size = cardSizes[value - 1];

    if (!size) {
        return;
    }

    /* Switch to Scale mode */
    var scaleRadio = document.querySelector( 'input[name="cardSizeMode"][value="scale"]');

    if (scaleRadio && !scaleRadio.checked) {
        scaleRadio.checked = true;
    }

    if(cardSizeScale){
        cardSizeScale.classList.remove("disabled");
    }

    if(responsiveStatus){
        responsiveStatus.classList.remove("visible");
    }

    setCardSize(size);

    /* Update current size label */
    if(currentSize) {
        currentSize.textContent = size.toUpperCase();
    }

    /* Update slider points */
    points.forEach(function (point, index) {
        if(index === value - 1) {
            point.style.backgroundColor = "#2196F3";
        } 
        else {
            point.style.backgroundColor = "#999999";
        }
    });
}


/**
 * Watches the grid size and updates the number
 * of responsive columns when it changes
 */
function setupResizeObserver() {
    var grid = document.querySelector("zing-grid");

    if (!grid || typeof ResizeObserver === "undefined") {
        return;
    }

    var resizeObserver = new ResizeObserver(function () {
        if (grid.getAttribute("card-mode") === "responsive"){
            updateResponsiveColumns();
        }
    });

    resizeObserver.observe(grid);
}


/**
 * Sets the initial state of the controls.
 */
function setupInitialState() {
    var responsiveRadio = document.querySelector('input[name="cardSizeMode"][value="responsive"]');

    var cardSizeScale = document.getElementById("cardSizeScale");
    var responsiveStatus = document.getElementById("responsiveStatus");

    if(responsiveRadio){
        responsiveRadio.checked = true;
    }

    if(cardSizeScale){
        cardSizeScale.classList.add("disabled");
    }

    if(responsiveStatus){
        responsiveStatus.classList.add("visible");
    }

    updateResponsiveColumns();
}


window.addEventListener("DOMContentLoaded", function () {
    initFlashcards();

    setupCardSizeMenu();
    setupModeSwitching();
    setupCardSizeSlider();
    setupResizeObserver();
    setupInitialState();
});