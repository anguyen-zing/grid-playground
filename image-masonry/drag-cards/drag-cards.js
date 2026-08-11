let activeCard = null;

let draggedIndex = null;
let dropTargetRow = null;
let dropPosition = null;

/**
* Adds an event listener to the ZingGrid masonry layout that listens for a record click event
* When a card is clicked, it resets all cards to inactive and sets the clicked card to active.
* It also toggles the preview panel based on the active state of the clicked card.
*/
function selectedCard() {
    const zgRef = document.querySelector('zing-grid.masonry');

    zgRef.addEventListener('record:click', (e) => {
        const { ZGTarget, ZGData } = e.detail; // ZGTarget = the actual zg-row DOM element clicked

        if (activeCard !== null) {
            activeCard.setAttribute('data-selected', 'inactive');
        }

        // reset all cards — ZGTarget still lives in whatever shadow root it's in,
        // so use getRootNode() to query siblings from the correct scope
        const root = ZGTarget.getRootNode();
        root.querySelectorAll('zg-row[layout="card"]').forEach((row) => {
            row.setAttribute('data-selected', 'inactive');
        });

        ZGTarget.setAttribute('data-selected', 'active');
        activeCard = ZGTarget;

        const checkActive = ZGTarget.getAttribute('data-selected');

        togglePreviewPanel(checkActive);
        updatePreviewPanel(ZGData.data);
    });
}

/**
* Toggles the preview panel based on the active state.
* @param {*} isActive
*              a boolean value indicating whether the preview panel should be
*              active or inactive based on if the clicked card is selected or not
*/
function togglePreviewPanel(isActive) {
    const galleryWrap = document.querySelector('.gallery-wrap');
    const preview = document.querySelector('zing-grid.preview');

    if (isActive === 'active') {
        galleryWrap.setAttribute('data-selected', 'active');
        console.log('active');
    }
    else {
        galleryWrap.setAttribute('data-selected', 'inactive');
        console.log('inactive');
    }

    if (preview.getAttribute('data-close-listener') !== 'true') {
        preview.setAttribute('data-close-listener', 'true');

        preview.addEventListener('cell:click', function (event) {
            const ZGData = event.detail.ZGData;

            if (ZGData.fieldIndex === 'close') {
                galleryWrap.setAttribute('data-selected', 'inactive');

                if (activeCard !== null) {
                    activeCard.setAttribute('data-selected', 'inactive');
                    activeCard = null;
                }
            }
        });
    }
}

/**
 * Updates and sets the data for the preview panel based on the clicked card's data.
 * @param {*} data 
 *              data object from masonry that contains the image, title, caption, 
 *              description, and link of the clicked card
 */
function updatePreviewPanel(data) {
    const preview = document.querySelector('zing-grid.preview');

    preview.setData([
        {
            close: 'x',
            image: data.imagePath,
            previewTitle: data.title,
            previewCaption: data.caption,
            previewDescription: data.description,
            previewLink: data.link || ''
        }
    ]);
}

/**
 * Updates and sets the data for the preview panel based on the clicked card's data.
 * @param {*} data 
 *              data object from masonry that contains the image, title, caption, 
 *              description, and link of the clicked card
 */
function updatePreviewPanel(data) {
    const preview = document.querySelector('zing-grid.preview');

    preview.setData([
        {
            close: 'x',
            image: data.imagePath,
            previewTitle: data.title,
            previewCaption: data.caption,
            previewDescription: data.description,
            previewLink: data.link || ''
        }
    ]);
}

/**
 * Enables reordering of masonry cards via native HTML5 drag and drop.
 * A card can be dropped before/after any other card, or into empty space
 * below the last card to send it to the end.
 */
function enableCardDragging() {
    const zgRef = document.querySelector('zing-grid.masonry');

    const prepRows = () => {
        zgRef.querySelectorAll('zg-row[layout="card"]').forEach((row) => {
            row.setAttribute('draggable', 'true');
            row.querySelectorAll('img').forEach((img) => { img.draggable = false; });
        });
    };

    zgRef.addEventListener('grid:render', prepRows);
    zgRef.addEventListener('data:load', prepRows);
    prepRows();

    const getRows = () => Array.from(zgRef.querySelectorAll('zg-row[layout="card"]'));
    const getRowIndex = (row) => getRows().indexOf(row);

    // Finds the closest card to the pointer by distance to its center,
    // rather than relying on the pointer being directly over a card's DOM
    // element — this covers gaps between columns and gives consistent
    // results across the whole grid area.
    const findNearestRow = (clientX, clientY) => {
        let closest = null;
        let closestDist = Infinity;

        getRows().forEach((row) => {
            if (row.getAttribute('data-dragging') === 'true') return; // skip the dragged card itself

            const rect = row.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            const dist = Math.hypot(clientX - cx, clientY - cy);

            if (dist < closestDist) {
                closestDist = dist;
                closest = row;
            }
        });

        return closest;
    };

    const clearDropIndicator = () => {
        zgRef.querySelectorAll('zg-row[data-drop-hover]').forEach((row) => {
            row.removeAttribute('data-drop-hover');
        });
    };

    zgRef.addEventListener('dragstart', (e) => {
        const row = e.target.closest('zg-row[layout="card"]');
        if (!row) return;

        draggedIndex = getRowIndex(row);
        row.setAttribute('data-dragging', 'true');
        e.dataTransfer.effectAllowed = 'move';
    });

    zgRef.addEventListener('dragover', (e) => {
        if (draggedIndex === null) return;
        e.preventDefault();

        const row = findNearestRow(e.clientX, e.clientY);
        clearDropIndicator();

        if (row) {
            const rect = row.getBoundingClientRect();
            dropTargetRow = row;
            dropPosition = e.clientY < rect.top + rect.height / 2 ? 'before' : 'after';
            row.setAttribute('data-drop-hover', dropPosition);
        } else {
            dropTargetRow = null;
            dropPosition = null;
        }
    });

    zgRef.addEventListener('drop', (e) => {
        if (draggedIndex === null) return;
        e.preventDefault();
        clearDropIndicator();

        const data = zgRef.getData();
        const [moved] = data.splice(draggedIndex, 1);

        if (dropTargetRow) {
            const dropIndex = getRowIndex(dropTargetRow);
            let insertAt = dropPosition === 'before' ? dropIndex : dropIndex + 1;
            if (draggedIndex < insertAt) insertAt -= 1;
            data.splice(insertAt, 0, moved);
        } else {
            data.push(moved);
        }

        if (activeCard !== null) {
            activeCard = null;
            togglePreviewPanel('inactive');
        }

        zgRef.setData(data);
    });

    zgRef.addEventListener('dragend', () => {
        zgRef.querySelectorAll('zg-row[data-dragging="true"]').forEach((row) => {
            row.removeAttribute('data-dragging');
        });
        clearDropIndicator();
        draggedIndex = null;
        dropTargetRow = null;
        dropPosition = null;
    });
}

window.addEventListener('DOMContentLoaded', () => {
    selectedCard();
    enableCardDragging();
});