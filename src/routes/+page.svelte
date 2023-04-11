<script>
    import { tweened } from "svelte/motion";
    import { linear } from "svelte/easing";

    import SpotifyLogin from "../components/SpotifyLogin.svelte";
    import { SpotifyAuth, SpotifyPlayer } from "../spotifyUtils";

    import { SvelteToast } from "@zerodevx/svelte-toast";
    import { toast } from "@zerodevx/svelte-toast";

    import { UAParser } from "ua-parser-js";

    let title = "Surfacing";
    let artist = "Aran";
    // let artwork = "https://lastfm.freetls.fastly.net/i/u/770x0/961d2c7203bb86f3d083788840e7c785.jpg"
    let artwork =
        "https://lastfm.freetls.fastly.net/i/u/770x0/380d533b9e6dc384c78d5e554646ef5f.jpg";
    let albumTitle = "Aphotic Seeker";
    let albumDetails = "Aran · 2020";
    let playing = true;
    // let percentage = 0;
    const percentage = tweened(0, {
        duration: 1000, // 1000 because of update interval, and to make the animation smooth even when changing playback device
        easing: linear,
    });
    let duration = 214007;
    let position = 35926;
    let shuffle = false;
    let repeat = false;
    let disallows = {
        pausing: false,
        peeking_next: false,
        peeking_prev: false,
        resuming: false,
        seeking: false,
        skipping_next: false,
        skipping_prev: false,
    };
    let authState = "bad";
    let player = {};
    let deviceId = "";
    function handlePlay() {
        console.log(player);
        if (playing) {
            player.pause().then(() => {
                playing = false;
            });
        } else {
            player.resume().then(() => {
                playing = true;
            });
        }
    }
    function handleShuffle() {
        if (shuffle == true) {
            shuffle = false
            SpotifyPlayer.setShuffle(false, deviceId)
        } else {
            shuffle = true
            SpotifyPlayer.setShuffle(true, deviceId)
        }
    }
    function handlerepeat() {
        if(repeat == 0) {
            repeat = 1
            SpotifyPlayer.setRepeat('context', deviceId)
        } else if (repeat == 1) {
            repeat = 2
            SpotifyPlayer.setRepeat('track', deviceId)
        } else if (repeat = 2) {
            repeat = 0
            SpotifyPlayer.setRepeat('off', deviceId)
        }
    }
    setInterval(updatePosition, 1000); // this is probably bad? I don't actually know but this could pose potential performance issues
    function updatePosition() {
        if (playing) {
            position = position + 1000;
            percentage.set((position * 100) / duration);
        }
    }

    function updatePlayerState(state) {
        title = state.track_window.current_track.name;
        artist = state.track_window.current_track.artists[0].name;
        // artwork = "https://lastfm.freetls.fastly.net/i/u/770x0/961d2c7203bb86f3d083788840e7c785.jpg"
        // TODO: this transition is quite frankly jarring, find a better way to smoothly transition in album art and background
        artwork =
            state.track_window.current_track.album.images[
                findLargestImageIndex(
                    state.track_window.current_track.album.images
                )
            ].url;
        albumTitle = state.track_window.current_track.album.name;
        // albumDetails = "Aran · 2020";
        playing = !state.paused;
        // percentage = 45;
        duration = state.duration;
        position = state.position;
        shuffle = state.shuffle;
        repeat = state.repeat_mode;
        console.log(state);
    }

    function findLargestImageIndex(arr) {
        return arr
            .map((o) => o.height)
            .indexOf(Math.max(...arr.map((o) => o.height)));
    }

    // if (authCode) {
    //     setAccessToken("0833c365ed2e41cdaf8119cfe3f34ff9", authCode) //FIXME: hardcoded client id
    //         .then((o) => {
    //             console.log(o)
    //             fetch("https://api.spotify.com/v1/me", {
    //                 method: "GET",
    //                 headers: { Authorization: `Bearer ${o}` },
    //             }).then((result) => console.log(result.json()));
    //         });
    // }

    function getUserAgent() {
        const uap = UAParser(window.navigator.userAgent);
        console.log(uap);
        // const result = uap.getResult()
        return `${uap.browser.name} · ${uap.os.name}`;
    }
    window.onSpotifyWebPlaybackSDKReady = async function() {
        console.log("sdk ready");
        // auth to spotify
        const authCode = new URLSearchParams(window.location.search).get(
            "code"
        );
        if (authCode) {
            await SpotifyAuth.setAccessToken("0833c365ed2e41cdaf8119cfe3f34ff9", authCode);
            window.history.replaceState({}, document.title);
            authState = "waiting";
        }
        const token = localStorage.getItem("access-token"); // TODO: token callback should check if token is still valid and refresh it
        player = new Spotify.Player({
            name: `CleanPlayer (${getUserAgent()}) `,
            getOAuthToken: (cb) => {
                cb(token);
            },
            volume: 1,
        });
        console.log(player);

        player.addListener("ready", ({ device_id }) => {
            console.log("Ready with Device ID", device_id);
            toast.push(`Ready with Device ID ${device_id}`);
            authState = "good";
            deviceId = device_id;
        });

        player.addListener("not_ready", ({ device_id }) => {
            console.log("Device ID has gone offline", device_id);
            toast.push(`Device ID has gone offline ${device_id}`);
        });

        player.addListener("initialization_error", ({ message }) => {
            console.error(message);
            toast.push(`Spotify initialization error: ${message}`);
        });

        player.addListener("authentication_error", ({ message }) => {
            console.error(message);
            toast.push(`Spotify authentication error: ${message}`);
            authState = "bad";
        });

        player.addListener("account_error", ({ message }) => {
            console.error(message);
            toast.push(`Spotify account error: ${message}`);
            authState = "bad";
        });

        player.connect().then((success) => {
            if (success) {
                console.log(
                    "The Web Playback SDK successfully connected to Spotify!"
                );
                toast.push("Succesfully connected to Spotify");
            }
        });

        player.addListener("player_state_changed", (state) => {
            updatePlayerState(state);
        });
    };
</script>

<svelte:head>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
        href="https://fonts.googleapis.com/css2?family=Nanum+Gothic&display=swap"
        rel="stylesheet"
    />
    <style>
        body {
            padding: 0;
            margin: 0;
            font-family: "Nanum Gothic", sans-serif;
            /* font-family: Arial, Helvetica, sans-serif; */
        }
    </style>
    <script src="https://sdk.scdn.co/spotify-player.js"></script>
    <!-- Google icons -->
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,300,0,0" />
    <style>
        .material-symbols-outlined {
          font-variation-settings:
          'FILL' 0,
          'wght' 300,
          'GRAD' 0,
          'opsz' 48
        }
        </style>
</svelte:head>

{#if authState == "bad" || authState == "waiting"}
    <SpotifyLogin {authState} />
{/if}

<SvelteToast />

<div class="unsuportedSizeNotice">
    <h1>This aspect ratio is not yet supported</h1>
    <h3>Please resize the application window</h3>
</div>

<div class="progress" style="width: {$percentage}vw;" />
<div class="background" style="background-image: url({artwork})" />
<div class="playerContainer">
    <div class="sideActions">
        <button class="shuffle" on:click={handleShuffle}>
                <span class="material-symbols-rounded" class:turnedOn="{shuffle}">
                    shuffle
                </span>
        </button>
        <button class="repeat" on:click={handlerepeat}>
            {#if repeat == 0}
            <span class="material-symbols-rounded">
                repeat
            </span>
            {:else if repeat == 1}
            <span class="material-symbols-rounded turnedOn">
                repeat
            </span>
            {:else}
            <span class="material-symbols-rounded turnedOn">
                repeat_one
            </span>
            {/if}
        </button>
    </div>
    <div class="albumContainer">
        <img src={artwork} alt="" class="albumArt" />
        <div class="albumInfo">
            <div>
                <span class="material-symbols-rounded">
                album
            </span>
            {albumTitle}
        </div>
            <!-- <div>{albumDetails}</div> TODO: check if we have another way of accessing it? WebPlaybackTrack doesn't seem to have one -->
        </div>
    </div>
    <div class="trackInfo">
        <div class="title">{title}</div>
        <div class="artist">{artist}</div>
    </div>
    <!-- TODO: aria-label for buttons-->

    <div class="controls">
        <button
            class="side"
            on:click={() => {
                player.previousTrack();
            }}>
            <!-- <Icon src={Backward} solid size="80" fill="#fbfcfc" /> -->
            <span class="material-symbols-rounded">
                skip_previous
            </span>
            </button>
        

        <button class="play" on:click={handlePlay}>
            {#if playing}
                <!-- TODO: https://stackoverflow.com/questions/73278702/correct-way-of-changing-svg-image-in-svelte-->
                <!-- <Icon src={PauseCircle} solid fill="#fbfcfc" size="100%" /> -->
                <span class="material-symbols-rounded">
                    pause_circle
                </span>
                <!-- FIXME: why is this so fucked up when changing witdth of page-->
            {:else}
                <!-- <Icon src={PlayCircle} solid fill="#fbfcfc" size="100%" /> -->
                <span class="material-symbols-rounded">
                    play_circle
                </span>
            {/if}
        </button>

        <button
            class="side"
            on:click={() => {
                player.nextTrack();
            }}>
            <!-- <Icon src={Forward} solid size="80" fill="#fbfcfc" /> -->
            <span class="material-symbols-rounded">
                skip_next
            </span>
            </button>
    </div>
</div>

<style>
    :root {
        --radius: 3ch;
    }
    .background {
        background-color: #9fc9dd;
        background-repeat: no-repeat;
        background-size: cover;
        background-position: center;
        filter: blur(65px) brightness(0.6);
        z-index: -1;
        display: block;
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        transform: scale(1.4);
    }

    .playerContainer {
        top: 5vh;
        height: 95vh;
        width: 100vw;
        text-align: center;
        position: absolute;
    }
    button {
        background: none;
        border: none;
        cursor: pointer;
    }
    img {
        height: 100%;
        border-radius: var(--radius);
    }
    /* .playerContainer {
        text-align: center;
    } */
    .sideActions {
        position: absolute;
        right: 3.5rem;
    }
    .sideActions button {
        background-color: rgba(140, 142, 240, 0.1);
        border-radius: 3.75rem;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 5rem;
        height: 5rem;
        backdrop-filter: blur(100px) brightness(1.5);
        margin: 1rem;
    }
    .sideActions button span {
        font-size: 3rem;
    }
    .sideActions button span.turnedOn {
        color: #fbfcfc;
    }
    .controls {
        display: flex;
        align-items: center;
        justify-content: center;
        bottom: 5vh;
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
    }
    .controls button {
        margin-left: 3rem;
        margin-right: 3rem;
        color: #fcfcfc;
        transition-property: all;
        transition-duration: 120ms;
    }
    .controls button.play span {
        font-size: 7rem;
    }
    .controls button.play {
        border-radius: 4.5rem;
    }
    .controls button span {
        font-size: 5rem;
    }
    .controls button.side {
        border-radius: 2.5rem;
    }
    .controls button:active {
        background-color: rgba(140, 142, 240, 0.1);
    }
    .albumContainer {
        top: 5rem;
        width: 100%;
        height: 60vh;
        display: flex;
        align-items: center;
    }
    .albumArt {
        height: 60vh;
        left: calc(50% - 30vh);
        position: fixed;
    }
    .albumInfo {
        margin-left: 32vh;
        position: absolute;
        left: 50%;
        color: #abafb2;
        text-align: left;
        font-size: 1.5rem;
    }
    .albumInfo span{
        position: relative;
        top: 0.25rem;
        font-size: 1.5rem;
        font-variation-settings: 'opsz' 20;
    }
    .trackInfo {
        margin: 3vh;
        color: #fbfcfc;
    }
    .title {
        font-size: 3rem;
    }
    .artist {
        font-size: 2rem;
    }
    .progress {
        background-color: #fbfcfc;
        height: 1vh;
        position: absolute;
        bottom: 0;
    }
    .play {
        height: 13vh;
    }
    .side {
        height: 10vh;
    }

    .unsuportedSizeNotice {
        display: none;
    }
    @media (orientation: portrait) or (max-width: 63vh) {
    /* TODO: this still misess my phone?*/
    .unsuportedSizeNotice {
        z-index: 100;
        display: block;
        position: absolute;
        text-align: center;
        width: 100vw;
        height: 100vh;
        background-color: #000;
        color: #fff;
    }
    }
</style>
