/*
 * NEXA demo authentication contract.
 *
 * This file intentionally contains no UI mutations. It defines the stable
 * cross-frame message names used when the authentication layer is connected
 * to the embedded matching experience.
 */
(() => {
  'use strict';

  const CONTRACT = Object.freeze({
    channel: 'nexa-demo-auth',
    events: Object.freeze({
      state: 'auth:state',
      signedIn: 'auth:signed-in',
      signedOut: 'auth:signed-out'
    }),
    storageKey: 'nexa.session.credential'
  });

  if (typeof window !== 'undefined') {
    window.NEXA_DEMO_AUTH_CONTRACT = CONTRACT;
  }
})();
