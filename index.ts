import { Command } from 'commander';
const program = new Command();

program
  .name('index')
  .description('Creating wargame in CLI')
  .version('0.8.0');

// function shuffleCards() {
//     const cards = [];
//     for (let i = 0; i < 52; i++) {
//         cards.push(i);
//     }
//     for (let i = 0; i < 52; i++) {
//         const j = Math.floor(Math.random() * 52);
//         const temp = cards[i];
//         cards[i] = cards[j];
//         cards[j] = temp;
//     }
//     return cards;
// }

interface Card {
    suit: string;
    value: number;
    name: string;
}

const cards: object[] = [];
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
            value: i === (11 || 12 || 13) ? 10 : i,
            name,
        });
    }
}

function shuffleCards() {
    let counter = 0;
    for (let i = 0; i < 3; i++) {
        setTimeout(() => {
            console.log('.');
            counter++;
            if (counter === 3) {
                console.log('Shuffling Cards');
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

program.command('split')
.description('Split a string into substrings and display as an array')
.argument('<string>', 'string to split')
.option('--first', 'display just the first substring')
.option('-s, --separator <char>', 'separator character', ',')
.action((str, options) => {
const limit = options.first ? 1 : undefined;
console.log(str.split(options.separator, limit));
});

program.parse();

