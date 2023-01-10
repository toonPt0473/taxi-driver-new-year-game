export enum Direction {
  UP = 'UP',
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
  DOWN = 'DOWN',
  CENTER = 'CENTER',
}

export interface WordSetType {
  value: Array<string>;
  name: string;
  image: string;
  point?: number;
}
