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
        'misc.': '#4f7587',
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
    const body = document.querySelector('zg-body');

    if (!body) return;

    body.style.display = 'grid';
    body.style.gap = '16px';
    body.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
}

/**
 * Retrieves the flashcard data from the 'zg-data' element in the DOM.
 * @returns 
 */
function getFlashcardData() {
    const dataElement = document.querySelector('zg-data');

    if (!dataElement) return [];

    const rawData = dataElement.getAttribute('data');

    if (!rawData) return [];

    try {
        return JSON.parse(rawData);
    } catch (error) {
        console.error('Could not parse flashcard data:', error);
        return [];
    }
}

/**
 * Retrieves the data for a specific flashcard based on its title.
 * @param {*} card - The flashcard element
 * @param {*} data - The array of flashcard data
 * @returns The matching flashcard data or null if not found
 */
function getCardData(card, data) {
    const titleElement = card.querySelector(
        'div[data-field-index="title"]'
    );

    if (!titleElement) {
        console.warn('Could not find title for card');
        return null;
    }

    const cardTitle = titleElement.textContent
        .trim()
        .replace(/\s+/g, ' ');

    const cardData = data.find(item => {
        const dataTitle = String(item.title || '')
            .trim()
            .replace(/\s+/g, ' ');

        return dataTitle === cardTitle;
    });

    if (!cardData) {
        console.warn('Could not find data for:', cardTitle);
        return null;
    }

    return cardData;
}

/**
 * Creates the back side of a flashcard with the solution and example.
 * @param {*} cardData - The data for the flashcard, including the back content and example
 * @returns 
 */
function createBack(cardData) {
    const back = document.createElement('div');

    back.className = 'flashcard-back';

    const content = document.createElement('div');
    content.className = 'flashcard-back-content';

    const solutionLabel = document.createElement('div');
    solutionLabel.className = 'answer-label';
    solutionLabel.textContent = 'Solution';

    const answer = document.createElement('div');
    answer.className = 'answer-text';
    answer.textContent = cardData.back || '';

    content.appendChild(solutionLabel);
    content.appendChild(answer);

    if (cardData.example) {
        const exampleLabel = document.createElement('div');
        exampleLabel.className = 'example-label';
        exampleLabel.textContent = 'Example';

        const example = document.createElement('div');
        example.className = 'example-text';
        example.textContent = cardData.example;

        content.appendChild(exampleLabel);
        content.appendChild(example);
    }

    const hint = document.createElement('div');
    hint.className = 'flip-hint';
    hint.textContent = 'Click to flip back';

    content.appendChild(hint);
    back.appendChild(content);

    return back;
}

/**
 * Allows the user to flip the flashcards to view the back side with the solution and example.
 * @returns 
 */
function enableCardFlip() {
    const cards = document.querySelectorAll('zg-row');
    const data = getFlashcardData();

    if (!cards.length || !data.length) return;

    cards.forEach(card => {
        if (card.dataset.flipEnabled === 'true') return;

        const cardData = getCardData(card, data);

        if (!cardData) return;

        const front = document.createElement('div');
        front.className = 'flashcard-front';

        while (card.firstChild) {
            front.appendChild(card.firstChild);
        }

        const back = createBack(cardData);

        const inner = document.createElement('div');
        inner.className = 'flashcard-inner';

        inner.appendChild(front);
        inner.appendChild(back);

        card.appendChild(inner);
        card.dataset.flipEnabled = 'true';
        card.addEventListener('click', event => {
            event.preventDefault();
            event.stopPropagation();

            card.classList.toggle('flipped');
        }, true);
    });
}

function refreshAll() {
    colorizeTags();

    const slider = document.getElementById('cardSize');

    if (slider) {
        setCardSize(slider.value);
    }

    enableCardFlip();
}

/**
 * 
 * @param {*} fn 
 * @param {*} delay 
 * @returns 
 */
function debounce(fn, delay = 100) {
    let timer;

    return (...args) => {
        clearTimeout(timer);

        timer = setTimeout(() => {
            fn(...args);
        }, delay);
    };
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

    const debouncedRefresh = debounce(refreshAll);

    ['render', 'afterload', 'load', 'afterrender'].forEach(evt => {
        grid.addEventListener(evt, debouncedRefresh);
    });

    const observer = new MutationObserver(() => {
        debouncedRefresh();
    });

    observer.observe(grid, {
        childList: true,
        subtree: true
    });

    setTimeout(refreshAll, 1000);
}

window.addEventListener('DOMContentLoaded', () => {
    initFlashcards();

    const slider = document.getElementById('cardSize');

    if (slider) {
        slider.addEventListener('input', () => {
            setCardSize(slider.value);
        });
    }
});