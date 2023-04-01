import Cookies from 'cookies';

export type WiaiCookie = {
  round: number,
  score: number,
  playDate: string,
  playedToday: boolean
}

export const dateOptions = {
  timeZone: 'America/Chicago',
}

export function setRoundCookie(req: any, res: any, round: number, score: number, playedToday: boolean, overwrite: boolean = true): void {
  const cookies = new Cookies(req, res);

  const date: Date = new Date();
  date.setTime(date.getTime() + (1*24*60*60*1000));
  // Set round cookie, expires at 2am CST (7:00 UTC)
  cookies.set('wiai', JSON.stringify({round: round, score: score, playDate: (new Date().toLocaleDateString('en-US', dateOptions)), playedToday: playedToday}), {
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