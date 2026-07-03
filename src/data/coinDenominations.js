// US currency denominations in cents
export const COINS = [1, 5, 10, 25, 50, 100];   // penny, nickel, dime, quarter, half-dollar, dollar coin
export const NOTES = [100, 200, 500, 1000];       // $1, $2, $5, $10 (in cents)
export const ALL_DENOMINATIONS = [1, 5, 10, 25, 50, 100, 200, 500, 1000];

// Keep legacy aliases so nothing breaks
export const SG_COINS = COINS;
export const SG_NOTES = [500, 1000];

export const DENOMINATION_INFO = {
  1:    { label: '1¢',  display: '1 cent',      type: 'coin', colour: '#B87333', design: 'Penny',       funFact: 'The penny is copper-coloured and worth 1 cent!' },
  5:    { label: '5¢',  display: '5 cents',     type: 'coin', colour: '#C0C0C0', design: 'Nickel',      funFact: 'Five pennies make one nickel!' },
  10:   { label: '10¢', display: '10 cents',    type: 'coin', colour: '#C0C0C0', design: 'Dime',        funFact: 'The dime is the smallest US coin — but it is worth 10 cents!' },
  25:   { label: '25¢', display: '25 cents',    type: 'coin', colour: '#C0C0C0', design: 'Quarter',     funFact: 'Four quarters make one dollar!' },
  50:   { label: '50¢', display: '50 cents',    type: 'coin', colour: '#C0C0C0', design: 'Half Dollar', funFact: 'Two half dollars make one dollar!' },
  100:  { label: '$1',  display: '1 dollar',    type: 'coin', colour: '#D4AF37', design: 'Dollar Coin', funFact: 'The dollar coin is gold-coloured and worth 100 cents!' },
  200:  { label: '$2',  display: '2 dollars',   type: 'note', colour: '#85bb65', design: '$2 Bill',     funFact: 'The $2 bill is rare and lucky — not many people see one!' },
  500:  { label: '$5',  display: '5 dollars',   type: 'note', colour: '#85bb65', design: '$5 Bill',     funFact: 'The green $5 bill has Abraham Lincoln on the front!' },
  1000: { label: '$10', display: '10 dollars',  type: 'note', colour: '#85bb65', design: '$10 Bill',    funFact: 'The $10 bill features Alexander Hamilton!' },
};

// Coin sets used in the practice questions (exclude $2 note for simpler scenarios)
export const PRACTICE_COINS = [1, 5, 10, 25, 50, 100];
export const PRACTICE_NOTES = [500, 1000];

export function formatAmount(cents) {
  if (cents < 100) return `${cents}¢`;
  if (cents % 100 === 0) return `$${cents / 100}`;
  return `$${(cents / 100).toFixed(2)}`;
}

export function formatAmountFull(cents) {
  if (cents < 100) return `${cents} cent${cents !== 1 ? 's' : ''}`;
  const dollars = Math.floor(cents / 100);
  const remainCents = cents % 100;
  if (remainCents === 0) return `${dollars} dollar${dollars !== 1 ? 's' : ''}`;
  return `$${(cents / 100).toFixed(2)}`;
}
