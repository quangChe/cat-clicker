window.onload = function() {
// ===================
// Global DOM elements
// ===================

    // Cat display ("Cat Stage")
    var display = document.querySelector('#display');
    var displayName = display.querySelector('h1');
    var displayImg = display.querySelector('img');
    var displayPar = display.querySelector('p');
    var displayIns = display.querySelector('h3');
    var displayScore = display.querySelector('span');

    // Admin features
    var adminBtn = document.querySelector('#admin-btn');
    var adminPanel = document.querySelector('#admin-panel');var submitBtn = adminPanel.querySelector('#submit');
    var cancelBtn = adminPanel.querySelector('#cancel');
    var nameBox = adminPanel.querySelector('#name');
    var imgBox = adminPanel.querySelector('#img');
    var votesBox = adminPanel.querySelector('#votes');

// =====
// MODEL
// =====
    var model = {
        // List of cats
        cats: [],

        // Current cat
        currentCat: null,

        // Fill cats with provided information
        init: function() {
            // Cats' information
            var names = ["Kippers", "Chewie", "Yvonne", "Claire", "Frank"];
            var imgs = ["cat1.jpg", "cat2.jpg", "cat3.jpg", "cat4.jpg", "cat5.jpg"];
            var counters = [0, 0, 0, 0, 0];

            // Occupy cat list with cats
            for (var i= 0; i < names.length; i++) {
                this.cats.push({
                    id: i + 1,
                    name: names[i],
                    img: imgs[i],
                    votes: counters[i]
                });
            }
        }
    };

// =======
// OCTOPUS
// =======
    var octopus = {
        // Initialize model and views
        init: function() {
            model.init();
            catList.init();
            catStage.init();
            adminView.init();
        },

        // Grab all cats from model
        allCats: function() {
            return model.cats;
        },

        // Stage a target cat in the model
        setCurrentCat: function(cat) {
            model.currentCat = cat;
        },

        // Get the targetted staged cat from model
        getCurrentCat: function() {
            return model.currentCat;
        },

        // Vote on a specific cat and update model's vote count
        voteCurrentCat: function() {
            model.currentCat.votes++;
            catStage.update();
        },

        renderAdmin: function() {
            adminView.render(model.currentCat);
        },

        // Update details of specific cat (admin only)
        updateCurrentCat: function(name, img, votes) {
            model.currentCat.name = name;
            model.currentCat.img = img;
            model.currentCat.votes = Number(votes);
            adminView.update();
        }

    };

// =====
// VIEWS
// =====

    // 1. List all cats
    var catList = {
        init: function() {
            // Retrieve the DOM ul (cat list)
            var catList = document.querySelector('ul');

            // Retrieve all cats
            var allCats = octopus.allCats();

            catList.innerHTML = "";

            // List each cat in the array
            for (i = 0; i < allCats.length; i++) {

                // Grab current cat in this for loop
                cat = allCats[i];

                // Create a list item for each cat
                var catItem = document.createElement('li');
                var catImg = document.createElement('img');
                var catName = document.createElement('h3');

                // Fill each list item with info of cat
                catItem.id = cat.id;
                catImg.alt = "Picture of a cat.";
                catImg.src = cat.img;
                catName.className = "name";
                catName.textContent = cat.name;
                catItem.appendChild(catImg);
                catItem.appendChild(catName);
                catList.appendChild(catItem);

                // Click listener for each list item with closure when a cat chosen
                catItem.addEventListener('click', (function(catCopy) {
                    return function() {
                        // Set currentCat on click
                        octopus.setCurrentCat(catCopy);
                        catStage.update();
                    };
                })(cat));
            }
        }
    };


    // 2. Stage cat with voting function for cat's image
    var catStage = {
        // Add click listener for the staged cat's image
        init: function() {
            displayImg.addEventListener('click', function(){
                octopus.voteCurrentCat();
            });

            adminBtn.addEventListener('click', function(){
                adminView.render();
            });

            this.update();

        },
        // Update stage with current cat info
        update: function() {

            // Target cat (clicked cat)
            var currentCat = octopus.getCurrentCat();

            if (currentCat) {
                // Display hidden elements to set stage for cat
                displayPar.classList.remove('hidden');
                displayIns.classList.remove('hidden');
                displayImg.classList.remove('hidden');
                adminBtn.classList.remove('hidden');
                adminPanel.classList.add('hidden');

                // Fill stage with cat's information
                displayImg.id = currentCat.id;
                displayImg.src = currentCat.img;
                displayName.textContent = currentCat.name;
                displayScore.textContent = currentCat.votes;
            }

            else {
                displayName.textContent = "Choose a cat from the list on the right!";
            }
        }
    };


    // 3. Admin controls and functions
    var adminView = {
        init: function () {
            // Click listener for submit button
            submitBtn.addEventListener('click', function() {
                octopus.updateCurrentCat(nameBox.value, imgBox.value, votesBox.value);
            });

            // Click listener for cancel button
            cancelBtn.addEventListener('click', function(){
                adminPanel.classList.add('hidden');
            });

        },

        // Display admin controls with correct cat info
        render: function() {
            var currentCat = octopus.getCurrentCat();

            adminPanel.classList.remove('hidden');
            nameBox.value = currentCat.name;
            imgBox.value = currentCat.img;
            votesBox.value = currentCat.votes;
        },

        // Update info for all cat views;
        update: function() {
            var currentCat = octopus.getCurrentCat();

            // Update the cat's stage with its new info
            displayImg.id = currentCat.id;
            displayImg.src = currentCat.img;
            displayName.textContent = currentCat.name;
            displayScore.textContent = currentCat.votes;

            // Put away admin panel
            adminPanel.classList.add('hidden');

            // Update cat on the list
            catList.init();

        }
    };

    octopus.init();
}
