var startButton = document.querySelector("#start-button");
var instructions = document.querySelector("#instructions");
var container = document.querySelector("#container");
var timeLeft;
var myWord;
var check;
var winCount = 0;
var lossCount = 0;



// Function to fetch random word from API
function fetchWord() {
    // fetch random words from API
    let word = fetch('https://random-word-api.herokuapp.com/word')
    .then(response => response.json())
    .then(data => data[0].toUpperCase());

    // wait for asynchronous function
    const randWord = () => {
        word.then((a) => {
           myWord = a;
        });
      };
      randWord();
}



// This function initializes the game
function gameInit() {

    // Remove start button
    startButton.style.display = "none";

    // creates instructions paragraph
    instructions.textContent = "Press a key to guess a letter.  Wrong guesses will subtract 10 seconds!";

    // Create div elements with each letter in div container
    for (i=0; i<myWord.length; i++) {
        const h2 = document.createElement("h2");
        h2.setAttribute("data-index", i);
        h2.setAttribute("data-letter", myWord[i]);
        h2.setAttribute("id", "letter");
        h2.style.borderBottom = "thick solid #000000";
        // appends the h2 element in container
        container.appendChild(h2);
    }
}

// Timer function
function timer() {
    timeLeft = 120;
    const timerEl = document.createElement("h1");
    document.body.appendChild(timerEl);
    var timeInterval = setInterval(function () {

        if (timeLeft > 0 && check !== myWord){
            timerEl.textContent = `${timeLeft} seconds left.`;
            timeLeft--;
        }
        
        // winning case
        else if (check === myWord) {
            // update win count and display
            winCount++;
            document.getElementById("win-span").textContent = winCount;
            check = '';
            clearInterval(timeInterval);
            // remove timer content
            timerEl.remove();
            // display button again
            startButton.style.display = "block";
            // delete div container content
            const h2El = document.querySelectorAll("#letter");
            for (i=0; i<h2El.length; i++) {
                h2El[i].remove();
            }
            // Change instructions to winning congrats
            instructions.textContent = "YOU'VE WON!!!";
            // Generate new word
            fetchWord();
        }

        // Losing Case
        else {
            // update loss count and display
            lossCount++;
            document.getElementById("loss-span").textContent = lossCount;
            // remove timer content
            timerEl.remove();
            clearInterval(timeInterval);
            // display button again
            startButton.style.display = "block";
            // delete div container content
            const h2El = document.querySelectorAll("#letter");
            for (i=0; i<h2El.length; i++) {
                h2El[i].remove();
            }
            // delete instructions text content and display word
            instructions.textContent = `The word was ${myWord}`;
            // generate new word
            fetchWord();
        }
    },1000);
}



// Start button will initialize game
startButton.addEventListener("click", function(event) {
    // make sure the start button is target of event with if statement
    var element = event.target;
    if (element.matches("button") === true) {
        // Call functions to initialize game and timer
        gameInit();
        timer();
    }
})

// Event listener for keypresses to play game
addEventListener("keydown", function(keypress) {
    let guess = keypress.key.toUpperCase();
    check = '';
    // Check if the guess is in the word string
    if (myWord.includes(guess)) {

        // This checks each h2 letter data to see which ones are a match
        for (i=0; i<myWord.length; i++) {
            let h2El = document.querySelector("#container").children[i];
            if (h2El.dataset.letter === guess) {
                h2El.textContent = h2El.dataset.letter;
            }
            check = check + h2El.textContent;
            console.log(check);
        }
    }
    // subtracts time for wrong guess
    else {
        timeLeft -= 5;
    }
    
});

// fetch word on page load
fetchWord();