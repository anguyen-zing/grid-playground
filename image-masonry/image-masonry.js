let activeCard = null;

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

window.addEventListener('DOMContentLoaded', () => {
    selectedCard();
});