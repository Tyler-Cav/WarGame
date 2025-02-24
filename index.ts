import { Command } from 'commander';
const program = new Command();

program
  .name('index')
  .description('Creating wargame in CLI')
  .version('0.8.0');

interface Card {
    suit: string;
    value: number;
    name: string;
}

let playerOneHand: Card[] = [];
let playerOneDiscardPile: Card[] = [];
let playerTwoHand: Card[] = [];
let playerTwoDiscardPile: Card[] = [];

function buildDeck() {
    const cards: Card[] = [];
    const suits: string[] = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
    for (const suit of suits) {
        for (let i = 2; i <= 14; i++) {
            let name = i.toString();
            if (i === 11) {
                name = 'Jack';
            } else if (i === 12) {
                name = 'Queen';
            } else if (i === 13) {
                name = 'King';
            } else if (i === 14) {
                name = 'Ace';
            }
            cards.push({
                suit,
                value: (i === 11 || i === 12 || i === 13) ? 10 : i,
                name,
            });
        }
    }
    return cards;
}

let standardCardDeck: Card[] = buildDeck();

function splitCardDeck() {
    let deckSize = 52
    for (let i = 0; i < 52; i++) {
        let randomSelection: number = Math.floor(Math.random() * deckSize);
        if (i % 2 === 0) {
            playerOneHand.push(standardCardDeck[randomSelection]);
            standardCardDeck = standardCardDeck.filter(function( obj ) {
                return !(obj.name === standardCardDeck[randomSelection].name && obj.suit === standardCardDeck[randomSelection].suit);
              });
        } else {
            playerTwoHand.push(standardCardDeck[randomSelection]);
            standardCardDeck = standardCardDeck.filter(function( obj ) {
                return !(obj.name === standardCardDeck[randomSelection].name && obj.suit === standardCardDeck[randomSelection].suit);
              });
        }
        deckSize--;
    }
    console.log("PlayerOneHand");
    console.log(playerOneHand);
    console.log("PlayerTwoHand")
    console.log(playerTwoHand);
}

function shuffleCards() {
    let counter = 0;
    console.log('')
    console.log('Shuffling Cards');
    for (let i = 0; i < 3; i++) {
        setTimeout(() => {
            console.log('.');
            counter++;
            if (counter === 3) {
                splitCardDeck();
                fight()
            }
        }, i * 1000);
    }
}

function playerShouldShuffleCheck() {
    if (playerOneHand.length === 0) {
        let discardSize = playerOneDiscardPile.length
        for (let i = 0; i < discardSize; i++) {
            let randomSelection: number = Math.floor(Math.random() * discardSize);
                playerOneHand.push(playerOneDiscardPile[randomSelection]);
                playerOneDiscardPile = playerOneDiscardPile.filter(function( obj ) {
                    return !(obj.name === playerOneDiscardPile[randomSelection].name && obj.suit === playerOneDiscardPile[randomSelection].suit);
                  });
                discardSize--
        }
    } else if (playerTwoHand.length === 0) {
        let discardSize = playerTwoDiscardPile.length
        for (let i = 0; i < discardSize; i++) {
            let randomSelection: number = Math.floor(Math.random() * discardSize);
                playerTwoHand.push(playerTwoDiscardPile[randomSelection]);
                playerTwoDiscardPile = playerTwoDiscardPile.filter(function( obj ) {
                    return !(obj.name === playerTwoDiscardPile[randomSelection].name && obj.suit === playerTwoDiscardPile[randomSelection].suit);
                  });
                discardSize--
        }
    }
}

function winnerCheck() {
    if (playerOneHand.length === 0 && playerOneDiscardPile.length === 0) {
        console.log("Player 2 Wins!")
        return true
    } else if (playerTwoHand.length === 0 && playerTwoDiscardPile.length === 0) {
        console.log("Player One Wins!")
        return true
    }
    return false
}

function fight() {
    if (winnerCheck()) {
        return "End of Game"
    } else {
        playerShouldShuffleCheck()
    }
    let playerOnePlayedCard: Card | undefined = playerOneHand.pop();
    let playerTwoPlayedCard: Card | undefined = playerTwoHand.pop();
    if (playerOnePlayedCard !== undefined && playerTwoPlayedCard !== undefined) {
        //NEED TO FIGURE OUT HOW TO KNOW WHEN IT'S A FACE CARD
        if (playerOnePlayedCard.value > playerTwoPlayedCard.value) {
            playerOneDiscardPile.push(playerOnePlayedCard)
            playerTwoDiscardPile.push(playerTwoPlayedCard)
        } else if (playerOnePlayedCard.value < playerTwoPlayedCard.value) {
            playerTwoDiscardPile.push(playerOnePlayedCard)
            playerTwoDiscardPile.push(playerTwoPlayedCard)
        } else {
            // Need to array pop 4 total cards per player (and store 3 for each)
            // Need something to store the 3 cards drawn for each player when it's a tie
            // Also need logic if the player only has 3 or less cards and must play before all three
        }
    }   
}

program.command('start-game')
    .description('Start the game')
    .action(() => {
        console.log('Game started');
        shuffleCards();
    });

program.parse();

