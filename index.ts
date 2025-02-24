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
let playerOneDiscard: Card[] = [];
let playerTwoHand: Card[] = [];
let playerTwoDiscard: Card[] = [];

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
            }
        }, i * 1000);
    }
}

program.command('start-game')
    .description('Start the game')
    .action(() => {
        console.log('Game started');
        shuffleCards();
    });

program.parse();

