export interface dataType {
  list: string[];
  name: string;
}

export interface Voters {
  key: string;
  name: string;
  hasVoted: boolean;
}

export interface Candates {
  key: string;
  name: string;
  votes: number;
}
