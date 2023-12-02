export interface DayType {
  title: string,
  exampleData: string,
  gistA: string,
  answerA: string,
  gistB: string,
  answerB: string,
  answerDetails: DetailsType,
};

export interface DetailsType {
  dataCharCount: number,
  dataLineCount: number,
  dataMinValue: number,
  dataMaxValue: number
}