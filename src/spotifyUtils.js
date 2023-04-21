import { redirectToAuthCodeFlow, newAccessToken} from './spotifyUtils/auth.js'

import { setRepeat, setShuffle } from './spotifyUtils/playerApi.js'

export const SpotifyAuth = {
  redirectToAuthCodeFlow: redirectToAuthCodeFlow,
  newAccessToken: newAccessToken,
}

export const SpotifyPlayerApi = {
  setRepeat: setRepeat,
  setShuffle: setShuffle
}