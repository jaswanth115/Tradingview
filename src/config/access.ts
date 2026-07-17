// Casual client-side gate for editing (moving symbols between watchlists).
//
// IMPORTANT: This is NOT real security. A static site ships all of its code
// to the browser, so a determined/technical user can bypass this. It only
// stops casual visitors from rearranging your watchlists.
//
// Change this value to your own secret PIN before deploying.
export const EDIT_PIN = '1999';

// localStorage key that remembers you've unlocked editing on this browser.
export const EDIT_UNLOCK_KEY = 'sp500-edit-unlocked-v1';
