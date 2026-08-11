

// Each scene's `art` uses an img tag
const ART = {
    cottage: "<img src='/images/adventure_story/cottage.png'>",
    forest: "<img src='/images/adventure_story/forest.png'>",
    garden: "<img src='/images/adventure_story/garden.png'>",
    crumb: "<img src='/images/adventure_story/crumb.png'>",
    fountain: "<img src='/images/adventure_story/fountain.png'>",
    picnic: "<img src='/images/adventure_story/picnic.png'>",
    willow: "<img src='/images/adventure_story/willow.png'>",
    gnomes: "<img src='/images/adventure_story/gnomes.png'>",
    tea: "<img src='/images/adventure_story/tea.png'>",
    party: "<img src='/images/adventure_story/party.png'>",
    trail: "<img src='/images/adventure_story/trail.png'>",
    gathering: "<img src='/images/adventure_story/gathering.png'>",
    walk: "<img src='/images/adventure_story/walk.png'>",
    snacks: "<img src='/images/adventure_story/snacks.png'>"
};


// Story Data with possibilities 
const STORY = {
    A: {
        title: "To the Great Outside",
        art: ART.cottage,
        text: ` On a very nice day, you are bored at home doomscrolling on the couch. 
                You look out the window and notice how sunny and wonderful it is. 
                So you head outside for an adventure. . .`,
        choices: [
            {
                label: "You feel super adventurous and explore the forest nearby you. ",
                next: "B"
            },
            {
                label: "You’ve yet to explore the vast backyard, so you decide to check out the gardens. ",
                next: "C"
            }
        ]
    },

    B: {
        title: "Forest",
        art: ART.forest,
        text: ` The trees grow taller as you walk deeper into the woods. Sunlight shines through the leaves, 
                creating patches of light on the forest floor. Soon, you notice a trail of tiny paw prints 
                in the soft dirt. They disappear between the trees.`,
        choices: [
            {
                label: "Follow the paw prints.",
                next: "M"
            },
            {
                label: "Stay on the main trail.",
                next: "D"
            }
        ]
    },

    C: {
        title: "Garden",
        art: ART.garden,
        text: ` The garden is much bigger than you imagined. Butterflies dance through the air as bees buzz 
                from flower to flower. Intricate marble statues peek out from behind colorful hedges, and 
                elegant fountains trickle peacefully. Near one of the fountains, you notice a trail of cookie 
                crumbs leading away along the stone path.`,
        choices: [
            {
                label: "Follow the cookie crumbs.",
                next: "F"
            },
            {
                label: "Stop and admire the fountain instead.",
                next: "G"
            }
        ]
    },

    D: {
        title: "A Garden Found",
        art: ART.trail,
        text: ` You decide to stay on the main trail for a while. And after sometime, it loops you to the
                unexplored gardens. You decide the garden would be a nice place to have a meal.
                Which area of the garden do you want to have your meal at?`,
        choices: [
            {
                label: "The Gazebo: Enjoy your meal in the shade while surrounded by blooming flowers.",
                next: "H"
            },
            {
                label: "Under the Willow Tree: Find a peaceful spot beneath the tree and feed some geese.",
                next: "I"
            }]
    },

    F: {
        title: "Follow the Cookie Crumb Trail",
        art: ART.crumb,
        text: ` You follow the cookie crumb trail through the winding garden paths. Around a bend, you 
                discover a freshly baked cookie in a cookie jar resting on a mossy stone, as if it had 
                been left just for you.`,
        choices: [
            {
                label: "You open the cookie jar and eat a cookie",
                next: "J"
            },
            {
                label: "You decide to not open the cookie jar and keep exploring",
                next: "G"
            }]
    },

    G: {
        title: "Stop and smell the flowers",
        art: ART.fountain,
        text: ` You stop and admire the fountain, listening to the gentle sound of the water and smell some 
                flowers. After a while, you decide it's the perfect day for a relaxing lunch in the garden. 
                Where would you like to eat at?`,
        choices: [
            {
                label: "The Gazebo: Enjoy your meal in the shade while surrounded by blooming flowers.",
                next: "H"
            },
            {
                label: "Under the Willow Tree: Find a peaceful spot beneath the tree and feed some geese",
                next: "I"
            }]
    },

    H: {
        title: "A Perfect Picnic",
        art: ART.picnic,
        text: ` You carry your lunch to the gazebo, where a gentle breeze keeps the afternoon cool. As you eat, 
                you watch butterflies flutter between the flowers. Time seems to slow down, and you realize 
                you haven't thought about your phone once since you left the house.`,
        ending: true
    },

    I: {
        title: "Willow's Rest",
        art: ART.willow,
        text: ` You finish your lunch beneath the willow tree while watching geese paddle peacefully around
                the pond. It is the perfect way to end a sunny afternoon.`,
        ending: true
    },

    J: {
        title: "The World Gets Bigger",
        art: ART.gnomes,
        text: ` You take a bite... and suddenly the world around you begins to grow! Before you know it, 
                you've shrunk to the size of a mouse. Startled but determined, you continue exploring until 
                you hear cheerful voices nearby. Peeking through the tall blades of grass, you see a group
                of lawn gnomes having tea. What do you do?`,
        choices: [
            {
                label: "Ask for a solution",
                next: "K"
            },
            {
                label: "Have a fun conversation",
                next: "L"
            }]
    },

    K: {
        title: "Back to Normal!",
        art: ART.tea,
        text: ` One of the lawn gnomes has a solution and brews a cup of magical garden tea using mint leaves, 
                flower petals, and a tiny pinch of sparkling pollen. One sip later, you're back to your normal size!.`,
        ending: true
    },

    L: {
        title: "A Little Tea Party",
        art: ART.party,
        text: ` You spend the afternoon chatting, sharing cookies, and laughing with the lawn gnomes. 
                By the time it's time to head home, you discover you've magically returned to your normal size 
                without even noticing.`,
        ending: true
    },

    M: {
        title: "Mysterious Gathering",
        art: ART.gathering,
        text: ` You follow the paw prints and suddenly come across a gathering of woodland creatures having
                a little picnic. You are shocked that you can understand them. Do you approach them?`,
        choices: [
            {
                label: 'No, you leave them be and turn back around. You decide you are also hungry.',
                next: "N"
            },
            {
                label: 'Yes, you are very curious and would like to join in on the party',
                next: "O"
            }]
    },

    N: {
        title: "Time for Lunch!",
        art: ART.walk,
        text: ` Since you are hungry you keep on walking back and want to stop by a nice place for lunch.
                Where do you head to?`,
        choices: [
            {
                label: "The Gazebo: Enjoy your meal in the shade while surrounded by blooming flowers.",
                next: "H"
            },
            {
                label: "Under the Willow Tree: Find a peaceful spot beneath the tree and feed some geese.",
                next: "I"
            }]
    },

    O: {
        title: "Making New Friends",
        art: ART.snacks,
        text: ` You introduce yourself to the woodland creatures. They are warm and inviting to you! They
                insist you join on their party. Excited you join in on the delicious treats and new friends
                you made!`,
        ending: true
    }
};

let path = ["A"];
const grid = document.getElementById('storyGrid');
const chapterTemplate = document.getElementById('chapter-template');
const logbook = document.getElementById('logbook');

function buildPathData(pathArray) {
    const pathData = [];

    for (let index = 0; index < pathArray.length; index = index + 1) {
        const sceneId = pathArray[index];
        const scene = STORY[sceneId];

        if (scene === undefined) {
            continue;
        }

        const sceneData = {
            id: sceneId,
            title: scene.title,
            art: scene.art,
            text: scene.text,
            choices: scene.choices,
            ending: scene.ending
        };

        pathData.push(sceneData);
    }

    return pathData;
}

function buildTrailHtml(pathArray) {
    let html = '';

    for (let index = 0; index < pathArray.length; index = index + 1) {
        if (index > 0) {
            html = html + '<span class="rope"></span>';
        }

        let currentClass = '';
        if (index === pathArray.length - 1) {
            currentClass = ' current';
        }

        html = html + '<span class="waypoint' + currentClass + '">' + (index + 1) + '</span>';
    }

    return html;
}

function buildChoicesMarkup(scene, chapterElement) {
    const choicesContainer = chapterElement.querySelector('.choices');

    if (scene.choices === undefined) {
        choicesContainer.innerHTML = '<div class="ending-tag">— The End —</div>';
        return;
    }

    const fragment = document.createDocumentFragment();

    for (let index = 0; index < scene.choices.length; index = index + 1) {
        const choice = scene.choices[index];
        const button = document.createElement('button');
        button.className = 'choice-btn';
        button.setAttribute('data-next', choice.next);
        button.innerHTML = '<span class="seal"></span>' + choice.label;
        fragment.appendChild(button);
    }

    choicesContainer.innerHTML = '';
    choicesContainer.appendChild(fragment);
}

function buildLogbook(pathArray) {
    const logbook = document.getElementById('logbook');
    logbook.innerHTML = '';

    for (let index = 0; index < pathArray.length; index = index + 1) {
        const sceneId = pathArray[index];
        const scene = STORY[sceneId];
        const isCurrent = index === pathArray.length - 1;
        const chapterElement = document.importNode(chapterTemplate.content, true);
        const article = chapterElement.querySelector('.chapter');

        if (isCurrent === false) {
            article.classList.add('read');
        }

        article.querySelector('.chapter-art').innerHTML = scene.art || '';
        article.querySelector('.chapter-num').textContent = 'Chapter ' + (index + 1);
        article.querySelector('.chapter-title').textContent = scene.title;
        article.querySelector('.chapter-text').textContent = scene.text;

        if (isCurrent === true) {
            buildChoicesMarkup(scene, article);
        }

        logbook.appendChild(chapterElement);
    }
}

function render() {
    const pathData = buildPathData(path);

    // The grid's own data is the single source of truth for what's
    // "unlocked" — this is the filter/branching mechanic: rows not on
    // the chosen path are never in grid.data at all.
    grid.data = pathData;
    grid.columns = [
        { field: 'title', header: 'Chapter' },
        { field: 'text', header: 'Summary' }
    ];

    // Trail of waypoints: numbering here is literal path order, not decoration.
    const trail = document.getElementById('trail');
    trail.innerHTML = buildTrailHtml(path);

    // Logbook view is kept as a lightweight fallback and summary view.
    buildLogbook(path);

    const choiceButtons = document.querySelectorAll('.choice-btn');

    for (let index = 0; index < choiceButtons.length; index = index + 1) {
        const button = choiceButtons[index];
        button.addEventListener('click', function () {
            const nextSceneId = button.getAttribute('data-next');

            if (nextSceneId !== null) {
                path.push(nextSceneId);
                render();
                window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
            }
        });
    }
}

// ZingGrid wiring: activated whenever a row's detail panel opens.
// Every scene auto-opens as it's added.
grid.addEventListener('row:detailsopen', function (event) {
    console.log('Scene revealed via ZingGrid row:detailsopen ->', event.detail);
});

document.getElementById('restartBtn').addEventListener('click', function () {
    path = ['A'];
    render();
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

render();
