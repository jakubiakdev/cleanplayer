import { toast } from "@zerodevx/svelte-toast";

export async function getAccessToken(clientId) {
    if(localStorage.getItem('accessToken') == undefined || localStorage.getItem('refreshToken') == undefined) {
        return false
    }
    let expiryTime = localStorage.getItem('expiryTime')
    let tokenGenerationTime = localStorage.getItem('tokenGenerationTime')
    let currentTime = Date.now()
    if ((currentTime - tokenGenerationTime) > expiryTime * 1000) {
        let body = new URLSearchParams()
        body.append("grant_type", "refresh_token")
        body.append("refresh_token", localStorage.getItem('refresh-token'))
        body.append("client_id", "0833c365ed2e41cdaf8119cfe3f34ff9") //TODO: hardcoded client id

        await fetch(`https://accounts.spotify.com/api/token`, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: body
        }).then(response => {
            if (!response.ok) {
                toast.push('Error refreshing token');
            }
            return response.json();
        }).then (data => {
            localStorage.setItem('expiryTime', data.expires_in)
            localStorage.setItem("tokenGenerationTime", Date.now())
            localStorage.setItem('accessToken', data.access_token);
            localStorage.setItem('refreshToken', data.refresh_token);
            toast.push("Regenerated access token")
        })
    } else {
        return localStorage.getItem('accessToken')
    }
}

export async function redirectToAuthCodeFlow(clientId) {
    const verifier = generateCodeVerifier(128)
    const challenge = await generateCodeChallenge(verifier)

    localStorage.setItem("verifier", verifier)

    const params = new URLSearchParams()
    params.append("client_id", clientId)
    params.append("response_type", "code")
    params.append("redirect_uri", window.location.href.split(/[?#]/)[0])
    params.append("scope", "user-read-playback-state user-modify-playback-state user-read-currently-playing streaming playlist-read-private playlist-read-collaborative user-library-modify user-library-read user-follow-read user-read-private user-read-email") //fixme: too much permissions

    params.append("code_challenge_method", "S256")
    params.append("code_challenge", challenge)
    console.log(`https://accounts.spotify.com/authorize?${params.toString()}`)
    document.location = `https://accounts.spotify.com/authorize?${params.toString()}`
}

export async function newAccessToken(clientId, code) {
    const verifier = localStorage.getItem("verifier")

    const params = new URLSearchParams()
    params.append("client_id", clientId)
    params.append("grant_type", "authorization_code")
    params.append("code", code)
    params.append("redirect_uri", window.location.href.split(/[?#]/)[0])
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
            localStorage.setItem('expiryTime', data.expires_in)
            localStorage.setItem("tokenGenerationTime", Date.now())
            localStorage.setItem('accessToken', data.access_token);
            localStorage.setItem('refreshToken', data.refresh_token);
            toast.push('Logged in!')
            return true
            // toast.push('Access token set')
        })
        .catch(error => {
            toast.push('Error:', error);
        });

}

export function logOut() {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('expiryTime')
    localStorage.removeItem('tokenGenerationTime')
    localStorage.removeItem('verifier')
    toast.push('Logged out!')
    setTimeout(() => {
        window.location.reload();
    }, 1000);
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

