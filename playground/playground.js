window.addEventListener('DOMContentLoaded', () => {

    const html = document.documentElement;

    const lowButton = document.getElementById('low');
    const mediumButton = document.getElementById('medium');
    const highButton = document.getElementById('high');

    lowButton.addEventListener('click', () => {
        html.dataset.theme = 'low';
    });

    mediumButton.addEventListener('click', () => {
        html.dataset.theme = 'med';
    });

    highButton.addEventListener('click', () => {
        html.dataset.theme = 'high';
    });

})