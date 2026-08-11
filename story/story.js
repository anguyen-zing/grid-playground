'use strict';

const ART = {
    cottage: "<img src='/images/adventure_story/cottage.png' alt='A cozy cottage'>",
    forest: "<img src='/images/adventure_story/forest.png' alt='A forest trail'>",
    garden: "<img src='/images/adventure_story/garden.png' alt='A colorful garden'>",
    crumb: "<img src='/images/adventure_story/crumb.png' alt='A trail of cookie crumbs'>",
    fountain: "<img src='/images/adventure_story/fountain.png' alt='A garden fountain'>",
    picnic: "<img src='/images/adventure_story/picnic.png' alt='A garden picnic'>",
    willow: "<img src='/images/adventure_story/willow.png' alt='A willow tree near a pond'>",
    gnomes: "<img src='/images/adventure_story/gnomes.png' alt='Garden gnomes'>",
    tea: "<img src='/images/adventure_story/tea.png' alt='A cup of magical tea'>",
    party: "<img src='/images/adventure_story/party.png' alt='A garden tea party'>",
    trail: "<img src='/images/adventure_story/trail.png' alt='A woodland trail leading to a garden'>",
    gathering: "<img src='/images/adventure_story/gathering.png' alt='Woodland creatures gathering'>",
    walk: "<img src='/images/adventure_story/walk.png' alt='A peaceful outdoor walk'>",
    snacks: "<img src='/images/adventure_story/snacks.png' alt='A collection of picnic snacks'>"
};

const STORY = {
    A: {
        title: 'To the Great Outside',
        art: ART.cottage,
        text: `
            On a very nice day, you are bored at home doomscrolling on the couch.

            You look out the window and notice how sunny and wonderful it is.
            So you head outside for an adventure...
        `,
        choices: [
            {
                label: 'You feel super adventurous and explore the forest nearby.',
                next: 'B'
            },
            {
                label: 'You have yet to explore the vast backyard, so you check out the gardens.',
                next: 'C'
            }
        ]
    },

    B: {
        title: 'Forest',
        art: ART.forest,
        text: `
            The trees grow taller as you walk deeper into the woods. Sunlight
            shines through the leaves, creating patches of light on the forest
            floor.

            Soon, you notice a trail of tiny paw prints in the soft dirt. They
            disappear between the trees.
        `,
        choices: [
            {
                label: 'Follow the paw prints.',
                next: 'M'
            },
            {
                label: 'Stay on the main trail.',
                next: 'D'
            }
        ]
    },

    C: {
        title: 'Garden',
        art: ART.garden,
        text: `
            The garden is much bigger than you imagined. Butterflies dance
            through the air as bees buzz from flower to flower.

            Intricate marble statues peek out from behind colorful hedges, and
            elegant fountains trickle peacefully. Near one of the fountains,
            you notice a trail of cookie crumbs leading away along the stone
            path.
        `,
        choices: [
            {
                label: 'Follow the cookie crumbs.',
                next: 'F'
            },
            {
                label: 'Stop and admire the fountain instead.',
                next: 'G'
            }
        ]
    },

    D: {
        title: 'A Garden Found',
        art: ART.trail,
        text: `
            You decide to stay on the main trail for a while. After some time,
            it loops around and leads you to the unexplored gardens.

            You decide the garden would be a nice place to have a meal. Which
            area of the garden would you like to visit?
        `,
        choices: [
            {
                label: 'The Gazebo: Enjoy your meal in the shade while surrounded by blooming flowers.',
                next: 'H'
            },
            {
                label: 'Under the Willow Tree: Find a peaceful spot beneath the tree and feed some geese.',
                next: 'I'
            }
        ]
    },

    F: {
        title: 'Follow the Cookie Crumb Trail',
        art: ART.crumb,
        text: `
            You follow the cookie crumb trail through the winding garden paths.

            Around a bend, you discover a freshly baked cookie in a cookie jar
            resting on a mossy stone, as though it had been left just for you.
        `,
        choices: [
            {
                label: 'Open the cookie jar and eat a cookie.',
                next: 'J'
            },
            {
                label: 'Leave the cookie jar alone and continue exploring.',
                next: 'G'
            }
        ]
    },

    G: {
        title: 'Stop and Smell the Flowers',
        art: ART.fountain,
        text: `
            You stop and admire the fountain, listening to the gentle sound of
            the water while smelling the flowers.

            After a while, you decide it is the perfect day for a relaxing lunch
            in the garden. Where would you like to eat?
        `,
        choices: [
            {
                label: 'The Gazebo: Enjoy your meal in the shade while surrounded by blooming flowers.',
                next: 'H'
            },
            {
                label: 'Under the Willow Tree: Find a peaceful spot beneath the tree and feed some geese.',
                next: 'I'
            }
        ]
    },

    H: {
        title: 'A Perfect Picnic',
        art: ART.picnic,
        text: `
            You carry your lunch to the gazebo, where a gentle breeze keeps the
            afternoon cool.

            As you eat, you watch butterflies flutter between the flowers. Time
            seems to slow down, and you realize you have not thought about your
            phone once since leaving the house.
        `,
        ending: true
    },

    I: {
        title: "Willow's Rest",
        art: ART.willow,
        text: `
            You finish your lunch beneath the willow tree while watching geese
            paddle peacefully around the pond.

            It is the perfect way to end a sunny afternoon.
        `,
        ending: true
    },

    J: {
        title: 'The World Gets Bigger',
        art: ART.gnomes,
        text: `
            You take a bite, and suddenly the world around you begins to grow!

            Before you know it, you have shrunk to the size of a mouse.
            Startled but determined, you continue exploring until you hear
            cheerful voices nearby.

            Peeking through the tall blades of grass, you see a group of lawn
            gnomes having tea. What do you do?
        `,
        choices: [
            {
                label: 'Ask the gnomes for a solution.',
                next: 'K'
            },
            {
                label: 'Stay and have a fun conversation.',
                next: 'L'
            }
        ]
    },

    K: {
        title: 'Back to Normal!',
        art: ART.tea,
        text: `
            One of the lawn gnomes has a solution. They brew a cup of magical
            garden tea using mint leaves, flower petals, and a tiny pinch of
            sparkling pollen.

            One sip later, you are back to your normal size!
        `,
        ending: true
    },

    L: {
        title: 'A Little Tea Party',
        art: ART.party,
        text: `
            You spend the afternoon chatting, sharing cookies, and laughing
            with the lawn gnomes.

            By the time it is time to head home, you discover you have
            magically returned to your normal size without even noticing.
        `,
        ending: true
    },

    M: {
        title: 'Mysterious Gathering',
        art: ART.gathering,
        text: `
            You follow the paw prints and suddenly come across a gathering of
            woodland creatures having a little picnic.

            You are shocked to discover that you can understand them. Do you
            approach the gathering?
        `,
        choices: [
            {
                label: 'No. Leave them alone, turn around, and find somewhere to eat.',
                next: 'N'
            },
            {
                label: 'Yes. You are curious and would like to join the party.',
                next: 'O'
            }
        ]
    },

    N: {
        title: 'Time for Lunch!',
        art: ART.walk,
        text: `
            Since you are hungry, you begin walking back and decide to find a
            nice place for lunch.

            Where would you like to go?
        `,
        choices: [
            {
                label: 'The Gazebo: Enjoy your meal in the shade while surrounded by blooming flowers.',
                next: 'H'
            },
            {
                label: 'Under the Willow Tree: Find a peaceful spot beneath the tree and feed some geese.',
                next: 'I'
            }
        ]
    },

    O: {
        title: 'Making New Friends',
        art: ART.snacks,
        text: `
            You introduce yourself to the woodland creatures. They are warm and
            welcoming, and they insist that you join their party.

            Excitedly, you enjoy delicious treats and spend the afternoon with
            your new friends.
        `,
        ending: true
    }
};

let path = ['A'];

const grid = document.getElementById('storyGrid');
const trail = document.getElementById('trail');
const restartButton = document.getElementById('restartBtn');

function escapeHtml(value = '') {
    const temporaryElement = document.createElement('div');
    temporaryElement.textContent = String(value);

    return temporaryElement.innerHTML;
}

function cleanText(value = '') {
    return String(value)
        .split('\n')
        .map((line) => line.trim())
        .join('\n')
        .trim();
}

/*  Converts the current path into records for ZingGrid. */
function getPathData() {
    return path
        .map((sceneId, index) => {
            const scene = STORY[sceneId];

            if (!scene) {
                return null;
            }

            return {
                id: sceneId,
                chapter: `Chapter ${index + 1}`,
                chapterNumber: index + 1,
                title: scene.title,
                art: scene.art ?? '',
                text: cleanText(scene.text),
                choices: scene.choices ?? [],
                ending: scene.ending === true,
                current: index === path.length - 1
            };
        })
        .filter((scene) => scene !== null);
}


function renderChoices(record) {
    if (!record.current) {
        return '';
    }

    if (record.ending || record.choices.length === 0) {
        return `
            <div class="ending-tag">
                — The End —
            </div>
        `;
    }

    return record.choices
        .map((choice) => {
            return `
                <button
                    class="choice-btn"
                    type="button"
                    data-next="${escapeHtml(choice.next)}"
                >
                    <span
                        class="seal"
                        aria-hidden="true"
                    ></span>

                    ${escapeHtml(choice.label)}
                </button>
            `;
        })
        .join('');
}

window.renderChapter = function renderChapter(record) {
    const stateClass = record.current ? 'current' : 'read';

    return `
        <article
            class="chapter ${stateClass}"
            data-scene-id="${escapeHtml(record.id)}"
        >
            <div class="chapter-art">
                ${record.art}
            </div>

            <div class="chapter-num">
                ${escapeHtml(record.chapter)}
            </div>

            <div class="chapter-title">
                ${escapeHtml(record.title)}
            </div>

            <div class="chapter-text">
                ${escapeHtml(record.text)}
            </div>

            <div class="choices">
                ${renderChoices(record)}
            </div>
        </article>
    `;
};

function renderTrail() {
    trail.innerHTML = path
        .map((sceneId, index) => {
            const scene = STORY[sceneId];
            const isCurrent = index === path.length - 1;

            const ropeMarkup = index > 0
                ? '<span class="rope" aria-hidden="true"></span>'
                : '';

            return `
                ${ropeMarkup}

                <span
                    class="waypoint ${isCurrent ? 'current' : ''}"
                    title="${escapeHtml(scene?.title ?? '')}"
                >
                    ${index + 1}
                </span>
            `;
        })
        .join('');
}

function openAllChapterDetails() {
    const rows = grid.querySelectorAll('zg-row');

    rows.forEach((row) => {
        if (typeof row.openDetails === 'function') {
            row.openDetails();
        }
    });
}

/*  Sends the current story path to ZingGrid. */
function renderStory() {
    renderTrail();

    grid.setData(getPathData());

    /*
     * Allow ZingGrid to finish creating its rows before opening details.
     */
    requestAnimationFrame(() => {
        openAllChapterDetails();
    });
}

/*
 * Uses one delegated click listener instead of creating a separate listener
 * for every choice button after every render.
 */
grid.addEventListener('click', (event) => {
    const eventPath = event.composedPath();

    const choiceButton = eventPath.find((element) => {
        return element?.classList?.contains('choice-btn');
    });

    if (!choiceButton) {
        return;
    }

    const nextSceneId = choiceButton.dataset.next;

    if (!nextSceneId || !STORY[nextSceneId]) {
        console.warn(`The story scene "${nextSceneId}" does not exist.`);
        return;
    }

    path.push(nextSceneId);
    renderStory();

    requestAnimationFrame(() => {
        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: 'smooth'
        });
    });
});

grid.addEventListener('grid:rendered', () => {
    openAllChapterDetails();
});

restartButton.addEventListener('click', () => {
    path = ['A'];

    renderStory();

    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

grid.executeOnLoad(() => {
    renderStory();
});