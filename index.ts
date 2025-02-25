import { Command } from 'commander';
import asciiArray from './asciisymbols.js';
const program = new Command();

program
  .name('index')
  .description('Creating wargame in CLI')
  .version('0.8.0');

interface Card {
    suit: string;
    value: number;
    name: string;
    asciiText: string;
}

let playerOneHand: Card[] = [];
let playerOneDiscardPile: Card[] = [];
let playerTwoHand: Card[] = [];
let playerTwoDiscardPile: Card[] = [];

function buildDeck() {
    let asciiTextCounter: number = 0
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
                value: i,
                name,
                asciiText: asciiArray[asciiTextCounter]
            });
            asciiTextCounter++
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

function playerShouldShuffleCheck(playerOneTieLessThanFour: boolean = false, playerTwoTieLessThanFour: boolean = false) {
    if (playerOneHand.length === 0 || playerOneTieLessThanFour) {
        let discardSize = playerOneDiscardPile.length
        for (let i = 0; i < discardSize; i++) {
            let randomSelection: number = Math.floor(Math.random() * discardSize);
                playerOneHand.push(playerOneDiscardPile[randomSelection]);
                playerOneDiscardPile = playerOneDiscardPile.filter(function( obj ) {
                    return !(obj.name === playerOneDiscardPile[randomSelection].name && obj.suit === playerOneDiscardPile[randomSelection].suit);
                  });
                discardSize--
        }
    } else if (playerTwoHand.length === 0 || playerTwoTieLessThanFour) {
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
        if (playerOnePlayedCard.value > playerTwoPlayedCard.value) {
            console.log("PLAYER ONE PLAYED CARD")
            console.log(playerOnePlayedCard.asciiText)
            console.log("PLAYER TWO PLAYED CARD")
            console.log(playerTwoPlayedCard.asciiText)
            console.log("Player One Wins Round")
            playerOneDiscardPile.push(playerOnePlayedCard)
            playerOneDiscardPile.push(playerTwoPlayedCard)
            console.log(`Player One has ${playerOneHand.length + playerOneDiscardPile.length} cards left`)
            console.log(`Player Two has ${playerTwoHand.length + playerTwoDiscardPile.length} cards left`)
        } else if (playerOnePlayedCard.value < playerTwoPlayedCard.value) {
            console.log("PLAYER ONE PLAYED CARD")
            console.log(playerOnePlayedCard.asciiText)
            console.log("PLAYER TWO PLAYED CARD")
            console.log(playerTwoPlayedCard.asciiText)
            console.log("Player Two Wins Round")
            playerTwoDiscardPile.push(playerOnePlayedCard)
            playerTwoDiscardPile.push(playerTwoPlayedCard)
            console.log(`Player One has ${playerOneHand.length + playerOneDiscardPile.length} cards left`)
            console.log(`Player Two has ${playerTwoHand.length + playerTwoDiscardPile.length} cards left`)
        } else {
            //THIS IS TOO MESSY, NEED TO MAKE A SEPARATE FUNCTION FOR TIED LOGIC
            let tempCardStorage: Card[] = []
            if (playerOneHand.length >= 4 && playerTwoHand.length >= 4) {
                for (let i: number = 0; i < 4; i++) {
                    let playerOneAdditionalPlayedCards = playerOneHand.pop()
                    let playerTwoAdditionalPlayedCards = playerTwoHand.pop()
                    tempCardStorage.push(playerOneAdditionalPlayedCards)
                    tempCardStorage.push(playerTwoAdditionalPlayedCards)
                }
                if (playerOnePlayedCard.value > playerTwoPlayedCard.value) {
                    // Need to push both cards to PlayerOne plus tempCardStorage cards
                } else if (playerOnePlayedCard.value < playerTwoPlayedCard.value) {
                    // Need to push both cards to PlayerTwo plus tempCardStorage cards
                }
            }
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

