import { isDigit } from "../../../util.js";

interface Almanac {
  seeds: SeedRange[];
  maps: ConversionMap[];
}
interface SeedRange {
  min: number,
  upperBound: number,
}
interface ConversionMap {
  source: string; // cause it looks nice
  destination: string;
  conversions: ConversionValues[];
}
interface ConversionValues {
  sourceMin: number;
  upperBound: number;
  difference: number;
}

const getInitialConversionMap = (): ConversionMap => {
  return {
    source: "",
    destination: "",
    conversions: [],
  }
}
const getInitialConversionValues = (): ConversionValues => {
  return {
    sourceMin: -1,
    upperBound: -1,
    difference: -1,
  }
}

const formatData = (data: string[], part: number): Almanac => {
  const almanac: Almanac = {
    seeds: [],
    maps: [],
  };

  const seedsToTrack: string[] = data[0].split(": ")[1].split(" ");
  if (part === 1) {
    seedsToTrack.forEach((seed: string) => {
      almanac.seeds.push({
        min: parseInt(seed),
        upperBound: parseInt(seed) + 1,
      });
    })
  }
  if (part === 2) {
    for (let i = 0; i < seedsToTrack.length; i += 2) {
      almanac.seeds.push({
        min: parseInt(seedsToTrack[i]),
        upperBound: parseInt(seedsToTrack[i]) + parseInt(seedsToTrack[i + 1]),
      })
    }
  }

  const restOfData: string[] = data.slice(2);
  let currentConversionMap: ConversionMap = getInitialConversionMap();
  for (let i = 0; i < restOfData.length; i++) {
    let line: string = restOfData[i];
    if (line === "") {
      currentConversionMap = getInitialConversionMap();
    } else if (isDigit(line[0])) {
      const newConversionValues: ConversionValues = getInitialConversionValues();
      const [destinationStart, sourceStart, rangeLength] = line.split(" ");
      newConversionValues.sourceMin = parseInt(sourceStart);
      newConversionValues.upperBound = (parseInt(sourceStart) + parseInt(rangeLength));
      newConversionValues.difference = (parseInt(sourceStart) - parseInt(destinationStart));
      currentConversionMap.conversions.push(newConversionValues);
      if (!restOfData[i + 1] || restOfData[i + 1] === "") {
        almanac.maps.push({...currentConversionMap});
      }
    } else {
      const [source, to, destination] = line.split(" ")[0].split("-");
      currentConversionMap.source = source;
      currentConversionMap.destination = destination;
    }
  }
  
  return almanac;
}

const findLocation = (
  seedRange: SeedRange, 
  locationRanges: SeedRange[], 
  maps: ConversionMap[],
  mapIdx: number,
) => {
  if (mapIdx === maps.length) {
    locationRanges.push(seedRange);
    return;
  } else {
    for (let conversion of maps[mapIdx].conversions) {
      if (
        conversion.sourceMin <= seedRange.min && 
        seedRange.min < conversion.upperBound
      ) {
        let overflow: number = (seedRange.upperBound - seedRange.min) - (conversion.upperBound - seedRange.min);

        // Go next level deeper with what fits into the range
        findLocation(
          {
            min: seedRange.min - conversion.difference,
            upperBound: overflow > 0
              ? conversion.upperBound - conversion.difference
              : seedRange.upperBound - conversion.difference,
          },
          locationRanges,
          maps,
          mapIdx + 1,
        ); 

        // Anything that didn't fit into the range, search the other maps 
        if (overflow > 0) {
          return findLocation(
            {
              min: conversion.upperBound,
              upperBound: conversion.upperBound + overflow,
            },
            locationRanges,
            maps,
            mapIdx,
          )
        } else {
          // No overflow, fit completely into a range, so we're done with checking conversions.
          return;
        }
      }
    }
    // Didn't fit any ranges in the map
    return findLocation(
      {...seedRange},
      locationRanges,
      maps,
      mapIdx + 1,
    )
  }
}

const getLocationRanges = (startingRanges: SeedRange[], maps: ConversionMap[]) => {
  const locationRanges: SeedRange[] = [];
  startingRanges.forEach((seedRange) => {
    findLocation(seedRange, locationRanges, maps, 0);
  })
  return locationRanges;
}

export const solve = (
  data: string[], 
  part: number, 
  showLogs: boolean,
) => {
    const almanac: Almanac = formatData(data, part);
    const ranges: SeedRange[] = getLocationRanges(almanac.seeds, almanac.maps);
    return Math.min(...ranges.map((range: SeedRange): number => range.min));
}