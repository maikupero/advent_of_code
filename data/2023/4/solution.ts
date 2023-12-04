// FORMATTING DATA
const formatScratchCards = (data: string[]) => {
  const formattedCards: string[][][] = [];
  data.forEach((line: string) => {
    const rawCardData = line.split(":")[1];
    const [left, right] = rawCardData.split("|");
    const winningNumbers: string[] = left.trim().replace(/\s\s+/g, ' ').split(" ");
    const possessedNumbers: string[] = right.trim().replace(/\s\s+/g, ' ').split(" ");
    formattedCards.push([winningNumbers, possessedNumbers]);
  })
  return formattedCards;
}

// PART 1
const formatForPoints = (formattedData: string[][][]) => {
  const cardMaps: Map<string, number>[] = [];
  formattedData.forEach((line: string[][]) => {
    const [winningNumbers, possessedNumbers] = line;

    const cardMap: Map<string, number> = new Map();
    winningNumbers.forEach((number) => {
      cardMap.set(number, 0);
    })
    possessedNumbers.forEach((number) => {
      cardMap.has(number) && cardMap.set(number, 1);
    })
    cardMaps.push(cardMap);
  })
  return cardMaps;
}

const countPoints = (card: Map<string, number>, lineNumber) => {
  let points: number = 0;
  for (let val of card.values()) {
    if (val === 1) {
      if (points === 0) {
        points = 1;
      } else {
        points *= 2;
      }
    }
  }
  return points;
}

// PART 2
interface CardMapWithCount {
  cardMap: Map<string, number>;
  count: number;
}

const formatMapsWithCounts = (cardMaps: Map<string, number>[]): CardMapWithCount[] => {
  let res: CardMapWithCount[] = [];
  cardMaps.forEach((card) => {
    res.push({
      cardMap: card,
      count: 1,
    })
  })
  return res;
}

function countCopies(cards: CardMapWithCount[]): void {
  cards.forEach((card: CardMapWithCount, idx: number) => {
    for (let copies = 0; copies < card.count; copies++) {
      let numberOfWins: number = countWinsOnCard(card.cardMap);
      let nextCardIdx = idx + 1;
      for (let i = nextCardIdx; i < cards.length && i < nextCardIdx + numberOfWins; i++) {
        cards[i].count++;
      }
    }
  })
}

const countWinsOnCard = (card: Map<string, number>): number => {
  let points: number = 0;
  for (let val of card.values()) {
    if (val === 1) {
      points++;
    }
  }
  return points;
}

export const solve = (
  data: string[], 
  part: number, 
  showLogs: boolean,
) => {
  const formattedData: string[][][] = formatScratchCards([...data]);
  const cardMaps: Map<string, number>[] = formatForPoints([...formattedData])
  if (part === 1) {
    let pointSum: number = 0;
    cardMaps.forEach((card: Map<string, number>, i: number) => {
      pointSum += countPoints(card, i);
    });
    return pointSum;
  } 
  const cardMapsWithCounts: CardMapWithCount[] = formatMapsWithCounts([...cardMaps]);
  countCopies(cardMapsWithCounts);
  return cardMapsWithCounts.reduce(
    (a, b) => a + b.count, 
    0
  );
}