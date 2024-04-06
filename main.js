const data = require('./words.json').words;
const rl = require('readline-sync');

const gameState = {
    lowerBoundWord: "",
    upperBoundWord: "",
    lowerBound: 50,
    upperBound: 50,
    madeAGuess: false
}

function main() {
    console.log("Welcome to the betweenle-solver! ");
    let word = rl.question("Did you already start a game? (y/n) ");
    console.log(word);
    if (word === "y" || word === "Y") {
        console.log("Great! Get your current game state ");
        gameState.madeAGuess = true;
        getUserGameState();
    } else {
        console.log("Let's start a new game! ");
        gameState.lowerBoundWord = data[0];
        gameState.upperBoundWord = data[data.length - 1];
    }

    while (true) {
        const validWords = getWordsBetween(gameState.lowerBoundWord, gameState.upperBoundWord);

        let range = gameState.lowerBound + gameState.upperBound;

        if (gameState.lowerBound === gameState.upperBound && validWords.length > 2000) {
            range += (Math.random() - 0.5) * 25;
        }

        const mappedValue = mapValueToRange(gameState.lowerBound, 0, range);
        let index = Math.floor(validWords.length * (mappedValue / 100));
        //console.log("Greedy Guess " + validWords[Math.floor(index)]);

        // Get a better lower bound to eliminate a lot of valid words
        if (validWords.length > 25 && index > 25 && gameState.lowerBound > gameState.upperBound) {
            //console.log("attempting to get a better lower bound");
            index -= 15;
        }

        // Get a better upper bound to eliminate a lot of valid words
        if (validWords.length > 25 && index < validWords.length - 25 && gameState.lowerBound < gameState.upperBound) {
            //console.log("attempting to get a better upper bound");
            index += 15;
        }

        if (validWords.length < 25 && validWords.length > 10) {
            //console.log("cutting down the number of valid words");
            index = Math.floor(validWords.length / 2);
        }

        const guess = validWords[Math.floor(index)];

        console.log("\nTry this guess " + guess);

        input = rl.question("Was that the top or bottom word? (t/b). Or was it the correct guess? (y) ", {limit: ['t', 'b', 'y']});
        if (input === "t") {
            gameState.lowerBoundWord = guess;
            gameState.lowerBound = rl.questionFloat("What is the new top value? ");
        } else if (input === "b") {
            gameState.upperBoundWord = guess;
            gameState.upperBound = rl.questionFloat("What is the new bottom value? ");
        } else if (input === "y") {
            console.log("\nYay!");
            process.exit(0);
        }

        if (!gameState.madeAGuess) {
            if (input === "t") {
                gameState.upperBound = rl.questionFloat("What is the new bottom value? ");
            } else {
                gameState.lowerBound = rl.questionFloat("What is the new top value? ");
            }
        }

       gameState.madeAGuess = true;
    }
}

function getUserGameState() {
    gameState.lowerBoundWord = rl.question("What is the top word? If none enter none. ");
    if (gameState.lowerBoundWord.length !== 5) {
        gameState.lowerBoundWord = data[0];
    }

    gameState.upperBoundWord = rl.question("What is the bottom word? ");
    if (gameState.upperBoundWord.length !== 5) {
        gameState.upperBoundWord = data[data.length - 1];
    }

    gameState.lowerBound = Number(rl.question("What is the top number? "));

    gameState.upperBound = Number(rl.question("What is the bottom number? "));
}

// Function to get the words between the lower and upper bounds
const getWordsBetween = (lowerBound, upperBound) => {
    const lowerIndex = data.indexOf(lowerBound);
    const upperIndex = data.indexOf(upperBound);

    if (lowerIndex === -1 || upperIndex === -1) {
        console.error("One or both of the words are not in the list");
        process.exit(1);
    }

    return data.slice(lowerIndex + 1, upperIndex);
};

function mapValueToRange(inputValue, minValue, maxValue) {
    return ((inputValue - minValue) / (maxValue - minValue)) * 100;
}

main();
