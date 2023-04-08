import { toast } from "@zerodevx/svelte-toast"; //optional

export async function redirectToAuthCodeFlow(clientId) {
  const verifier = generateCodeVerifier(128)
  const challenge = await generateCodeChallenge(verifier)

  localStorage.setItem("verifier", verifier)

  const params = new URLSearchParams()
  params.append("client_id", clientId)
  params.append("response_type", "code")
  params.append("redirect_uri", "http://localhost:5173/")
  params.append("scope", "user-read-playback-state user-modify-playback-state user-read-currently-playing app-remote-control streaming playlist-read-private playlist-read-collaborative playlist-modify-private playlist-modify-public user-follow-modify user-follow-read user-read-playback-position user-top-read user-read-recently-played user-library-modify user-library-read user-read-email user-read-private ") //fixme: too much permissions
  params.append("code_challenge_method", "S256")
  params.append("code_challenge", challenge)
  console.log(`https://accounts.spotify.com/authorize?${params.toString()}`)
  document.location = `https://accounts.spotify.com/authorize?${params.toString()}`
}

export async function setAccessToken(clientId, code) {
  const verifier = localStorage.getItem("verifier")

  const params = new URLSearchParams()
  params.append("client_id", clientId)
  params.append("grant_type", "authorization_code")
  params.append("code", code)
  params.append("redirect_uri", "http://localhost:5173/")
  params.append("code_verifier", verifier)

  const result = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params
  }).then(response => {
    if (!response.ok) {
      toast.push('HTTP status ' + response.status);
      // throw new Error('HTTP status ' + response.status);
    }
    return response.json();
  })
    .then(data => {
      localStorage.setItem('access-token', data.access_token);
      toast.push('Logged in!')
      // toast.push('Access token set')
    })
    .catch(error => {
      toast.push('Error:', error);
    });

}

function generateCodeVerifier(length) {
  let text = ""
  let possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  return text
}

async function generateCodeChallenge(codeVerifier) {
  const data = new TextEncoder().encode(codeVerifier)
  const digest = await window.crypto.subtle.digest("SHA-256", data)
  return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "")
}
