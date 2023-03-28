<script>
    // // from https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow
    // function login() {
    //     function generateRandomString(length) {
    //         let text = '';
    //         let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    //         for (let i = 0; i < length; i++) {
    //             text += possible.charAt(Math.floor(Math.random() * possible.length));
    //         }
    //         return text;
    //     }
    //     async function generateCodeChallenge(codeVerifier) {
    //         function base64encode(string) {
    //             return btoa(String.fromCharCode.apply(null, new Uint8Array(string)))
    //                 .replace(/\+/g, '-')
    //                 .replace(/\//g, '_')
    //                 .replace(/=+$/, '');
    //         }

    //         const encoder = new TextEncoder();
    //         const data = encoder.encode(codeVerifier);
    //         const digest = await window.crypto.subtle.digest('SHA-256', data);

    //         return base64encode(digest);
    //     }

    //     const clientId = '0833c365ed2e41cdaf8119cfe3f34ff9';
    //     const redirectUri = 'https://asia-east2-spotify-cli-283006.cloudfunctions.net/auth-redirect';

    //     let codeVerifier = generateRandomString(128);

    //     generateCodeChallenge(codeVerifier).then(codeChallenge => {
    //         let state = generateRandomString(16);
    //         let scope = 'user-read-playback-state user-modify-playback-state user-read-currently-playing app-remote-control'; // TODO: "streaming" if we want to play music

    //         localStorage.setItem('code-verifier', codeVerifier);

    //         let args = new URLSearchParams({
    //             response_type: 'code',
    //             client_id: clientId,
    //             scope: scope,
    //             redirect_uri: redirectUri,
    //             state: state,
    //             code_challenge_method: 'S256',
    //             code_challenge: codeChallenge
    //         });

    //         window.location = 'https://accounts.spotify.com/authorize?' + args;
    //     });
    // }

    // // testing code
    import MenuWindow from "./MenuWindow.svelte";
    import { redirectToAuthCodeFlow } from "../spotifyUtils";

    function login() {
        redirectToAuthCodeFlow("0833c365ed2e41cdaf8119cfe3f34ff9"); //FIXME: hardcoded client id
    } 
    
    // const clientId = "0833c365ed2e41cdaf8119cfe3f34ff9";
    // const params = new URLSearchParams(window.location.search);
    // const code = params.get("code");

    

    // if (!code) {
    //     redirectToAuthCodeFlow(clientId);
    // } else {
    //     getAccessToken(clientId, code)
    //         .then((accessToken) => fetchProfile(accessToken))
    //         .then((profile) => console.log(profile))
    //         .catch((error) => console.error(error));
    // }

    // function fetchProfile(code) {
    //     return fetch("https://api.spotify.com/v1/me", {
    //         method: "GET",
    //         headers: { Authorization: `Bearer ${code}` },
    //     }).then((result) => result.json());
    // }
</script>

<MenuWindow>
    <div class="container">
        <button on:click={login}>Log in with Spotify<img src="./Spotify.png" alt="" /></button>
    </div>
</MenuWindow>

<style>
    button {
        background: none;
        border: white 2px solid;
        border-radius: 3ch;
        cursor: pointer;
        color: #fbfcfc;
        font-size: 3rem;
        padding: 2rem;
    }
    .container {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
    }
    img {
        height: 6rem;
        vertical-align: middle;
        margin-left: 1ch;
    }
</style>
