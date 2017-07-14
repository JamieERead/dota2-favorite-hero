export const AUTH_CONFIG = {
  domain: 'dota2fav.eu.auth0.com',
  clientId: 'OVaIwkj63Of2enYqCKl0y1vi5Y6vVYTV',
  callbackUrl: process.env.NODE_ENV === 'production' ? 'https://dota2-favourite-hero.herokuapp.com/callback' : 'http://app.local:3000/callback'
}
