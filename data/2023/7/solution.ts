// TYPES 
interface Hand {
  cards: Card[],
  bid: number,
  type: HandType,
}
type Card =  'A' | 'K' | 'Q' | 'J' | 'T' | '9' | '8' | '7' | '6' | '5' | '4' | '3' | '2';
type HandType = 
  'FIVE_OF_A_KIND' |
  'FOUR_OF_A_KIND' |
  'FULL_HOUSE' |
  'THREE_OF_A_KIND' |
  'TWO_PAIR' |
  'ONE_PAIR' |
  'HIGH_CARD';
const CardToValMap = {
  'A': 14,
  'K': 13,
  'Q': 12,
  'J': 11,
  'T': 10,
  '9': 9,
  '8': 8,
  '7': 7,
  '6': 6,
  '5': 5,
  '4': 4,
  '3': 3,
  '2': 2,
}
const CardToValMap2 = {
  ...CardToValMap,
  'J': 1,
}
const HandValues = {
  'FIVE_OF_A_KIND': 6,
  'FOUR_OF_A_KIND': 5,
  'FULL_HOUSE': 4,
  'THREE_OF_A_KIND': 3,
  'TWO_PAIR': 2,
  'ONE_PAIR': 1,
  'HIGH_CARD': 0,
}

// READ THE DATA
const formatDataIntoHands = (data: string[], part: number) => {
  const res: Hand[] = [];
  data.forEach((line: string) => {
    const [hand, bid] = line.trim().split(" ");
    const handAsCards: Card[] = hand.split("") as Card[];
    res.push({
      cards: handAsCards,
      bid: parseInt(bid),
      type: assessOriginalHand(handAsCards, part)
    })
  })
  return res;
}
// USEFUL

// Five of a kind, where all five cards have the same label: AAAAA
// Four of a kind, where four cards have the same label and one card has a different label: AA8AA
// Full house, where three cards have the same label, and the remaining two cards share a different label: 23332
// Three of a kind, where three cards have the same label, and the remaining two cards are each different from any other card in the hand: TTT98
// Two pair, where two cards share one label, two other cards share a second label, and the remaining card has a third label: 23432
// One pair, where two cards share one label, and the other three cards have a different label from the pair and each other: A23A4
// High card, where all cards' labels are distinct: 23456

// So, 33332 and 2AAAA are both four of a kind hands, but 33332 is stronger because its first card is stronger. 
// Similarly, 77888 and 77788 are both a full house, but 77888 is stronger because its third card is stronger 
// (and both hands have the same first and second card).

const getCardMap = (cards: Card[]) => {
  const cardMapping = new Map();
  cards.forEach((card: Card) => {
    cardMapping.has(card) 
      ? cardMapping.set(card, cardMapping.get(card) + 1)
      : cardMapping.set(card, 1)
  })
  return cardMapping;
}

const getSortedCards = (cardMap: Map<string, number>): [string, number][] => {
  const sortedCards: [string, number][] = Array.from(cardMap.entries()).sort((a,b) => {
    if (a[1] > 1 && a[1] < 4 && b[1] > 1 && b[1] < 4) {
      return 0
    }
    return b[1] - a[1];
  });
  return sortedCards;
}

const getHandType = (cards: [string, number][], part: number) => {
  if (part === 1) {
    let handType: HandType;
    let maxCount: number = cards[0][1];
    switch (maxCount) {
      case 5: 
        handType = 'FIVE_OF_A_KIND';
        break;
      case 4: 
        handType = 'FOUR_OF_A_KIND';
        break;
      case 3:
        handType = cards[1][1] === 2
          ? 'FULL_HOUSE'
          : 'THREE_OF_A_KIND';
        break;
      case 2: 
        handType = cards[1][1] === 3
          ? 'FULL_HOUSE'
          : handType = cards[1][1] === 2
            ? 'TWO_PAIR'
            : 'ONE_PAIR';
        break;
      default:
        handType = 'HIGH_CARD';
    }
    return handType;
  } else {
    const jokerCards  = cards.find((c: [string, number]) => c[0] === 'J' ? c[1] : 0);
    const numberOfJOKES: number = jokerCards ? jokerCards[1] : 0;
    if (numberOfJOKES < 1) {
      // if no JOKES just treat it as a part 1 hand
      return getHandType(cards, 1);
    }
    switch (numberOfJOKES) {
      case 5: 
      case 4: 
        return 'FIVE_OF_A_KIND' // 5 jokers, or 4 jokers match 1
      case 3: 
        return cards[1][1] === 2
          ? 'FIVE_OF_A_KIND' // 3 jokers and 2 of another
          : 'FOUR_OF_A_KIND' // 3 jokers and 1 of the others
      case 2:
        if (cards.find((c) => c[0] !== 'J' && c[1] === 3)) return 'FIVE_OF_A_KIND' // 3 of some card, two jokers
        return !!cards.find((c) => c[0] !== 'J' && c[1] === 2) // check if we have any other double
          ? 'FOUR_OF_A_KIND'  // in which case, match it
          : 'THREE_OF_A_KIND' // if not, the jokers will match one of the singles
      case 1:
        if (cards[0][1] === 4) return 'FIVE_OF_A_KIND'
        if (cards[0][1] === 3) return 'FOUR_OF_A_KIND'
        if (cards[0][1] === 2) {
          return cards[1][1] === 2
            ? 'FULL_HOUSE'
            : 'THREE_OF_A_KIND'
        }
      default:
        return 'ONE_PAIR'
    }
  }
}

const assessOriginalHand = (cards: Card[], part: number) => {
  const cardMap: Map<string, number> = getCardMap(cards);
  const sortedCards: [string, number][] = getSortedCards(cardMap);
  return getHandType(sortedCards, part)
}

const rankHands = (unrankedHands: Hand[], part: number) => {
  return unrankedHands.sort((a: Hand, b: Hand) => {
    if (HandValues[a.type] > HandValues[b.type]) {
      return 1; // if a hand type is better
    }
    if (HandValues[a.type] < HandValues[b.type]) {
      return -1 // if b hand type is better
    }
    return compareSameTypeHands(a, b, part); // if same hand type
  })
}

const compareSameTypeHands = (a: Hand, b: Hand, part: number) => {
  for (let i = 0; i < a.cards.length; i++) {
    let winner: number = compareCardValues(a.cards[i], b.cards[i], part);
    if (!!winner) { // if one or the other wins (it'll be 1 or -1 -> true. if tie, 0 -> false)
      return winner;
    }
  }
  return 0;
}

const compareCardValues = (a: Card, b: Card, part: number) => {
  if (part === 1) {
    if (CardToValMap[a] > CardToValMap[b]) return 1;
    if (CardToValMap[a] < CardToValMap[b]) return -1;
  } 
  if (part === 2) {
    if (CardToValMap2[a] > CardToValMap2[b]) return 1;
    if (CardToValMap2[a] < CardToValMap2[b]) return -1;
  }
  return 0;
}


// Data is read into a simple string[] and sent in here to format for specific prompts
export const solve = (
  data: string[], 
  part: number, 
  showLogs: boolean,
) => {
  console.log(":)")
  const unsortedHands: Hand[] = formatDataIntoHands([...data], part);
  const rankedHands: Hand[] = rankHands([...unsortedHands], part);
  // rankedHands.forEach((card) => card.type === 'TWO_PAIR' && console.log(card.cards, card.type));
  rankedHands.forEach((hand) => hand.cards.find((c, i) => c[0] === 'J' && console.log(hand.cards, hand.type)))
  return rankedHands.reduce((a,b, i) => a + b.bid * (i + 1), 0)
}