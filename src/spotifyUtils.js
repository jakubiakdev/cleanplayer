import { redirectToAuthCodeFlow, setAccessToken} from './spotifyUtils/auth.js'

import { setRepeat, setShuffle } from './spotifyUtils/player.js'

export const SpotifyAuth = {
  redirectToAuthCodeFlow: redirectToAuthCodeFlow,
  setAccessToken: setAccessToken,
}

export const SpotifyPlayer = {
  setRepeat: setRepeat,
  setShuffle: setShuffle
}