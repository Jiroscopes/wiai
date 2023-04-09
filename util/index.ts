import Cookies from 'cookies';

const lsKey: string = 'wiaiGame';

export type WiaiCookie = {
  round: number,
  score: number,
  playDate: string,
  playedToday: boolean,
  roundScores: Array<number>
}

export type WiaiGameLocalStorage = {
  score: number,
  rounds: Array<string>,
  date: String
}

export const dateOptions = {
  timeZone: 'America/Chicago',
}

export function setRoundCookie(req: any, res: any, round: number, score: number, playedToday: boolean, roundScores: Array<number>, overwrite: boolean = true): void {
  const cookies = new Cookies(req, res);

  const date: Date = new Date();
  date.setTime(date.getTime() + (1*24*60*60*1000));
  // Set round cookie, expires at 2am CST (7:00 UTC)
  cookies.set('wiai', JSON.stringify({round: round, score: score, playDate: (new Date().toLocaleDateString('en-US', dateOptions)), playedToday: playedToday, roundScores: roundScores}), {
    httpOnly: true,
    // secure: true,
    expires: date,
    overwrite: overwrite
  });
}

export function clearCookie(req: any, res: any, cookieName: string): void {
  const cookies = new Cookies(req, res);
  // Blank everything deletes the cookie
  cookies.set(cookieName);
}

export function getToday() {
  return (new Date().toLocaleDateString('en-US', dateOptions));
}

export function updateGameResult(selection: string, score: number): void {
  const currentVal: string | null = localStorage.getItem(lsKey);
  let newVal: WiaiGameLocalStorage = {
    score: 0,
    rounds: [],
    date: getToday()
  };

  // If localstorage exists already
  if (currentVal !== null) {
    newVal = JSON.parse(currentVal);
    // If old localStorage
    if (newVal.date !== getToday()) {
      // reset
      newVal = {
        score: 0,
        rounds: [],
        date: getToday()
      }
    }
  }
  
  newVal.rounds = [...newVal.rounds, selection];
  newVal.score = score;

  localStorage.setItem(lsKey, JSON.stringify(newVal));
}

export function getRoundResult(round: number): WiaiGameLocalStorage | null {
  if (typeof window === 'undefined') {return null;}
  const currentVal: string | null = localStorage.getItem(lsKey);

  if (currentVal === null) {
    return null;
  }

  let lsVal: WiaiGameLocalStorage = JSON.parse(currentVal)

  if (lsVal.date !== getToday()) {
    // Clear localstorage
    localStorage.removeItem(lsKey);
    return null;
  }

  return lsVal;
}