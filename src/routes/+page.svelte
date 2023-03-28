<svelte:head>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Nanum+Gothic&display=swap" rel="stylesheet">
    <style>
        body {
            padding: 0;
            margin: 0;
            font-family: 'Nanum Gothic', sans-serif;
        }
    </style>  
</svelte:head>

<script>
    import { ArrowPathRoundedSquare, ArrowsRightLeft, Backward, Forward, Icon, PauseCircle, PlayCircle} from "svelte-hero-icons";
    import SpotifyLogin from "../components/SpotifyLogin.svelte";
    import { getAccessToken } from "../spotifyUtils"
    let title = "Surfacing"
    let artist = "Aran"
    let artwork = "https://lastfm.freetls.fastly.net/i/u/770x0/961d2c7203bb86f3d083788840e7c785.jpg"
    // let artwork = "https://lastfm.freetls.fastly.net/i/u/770x0/380d533b9e6dc384c78d5e554646ef5f.jpg"
    let albumTitle = "Aphotic Seeker"
    let albumDetails = "Aran · 2020"
    let playing = true
    let percentage = 45;
    let shuffle = false;
    let loop = false;
    function handlePlay() {
        playing = !playing
    }
    function handleShuffle() {
        shuffle = !shuffle
    }
    function handleLoop() {
        loop = !loop
    }

    // auth to spotify
    const authCode = new URLSearchParams(window.location.search).get("code");

    if(authCode) {
        getAccessToken("0833c365ed2e41cdaf8119cfe3f34ff9",authCode) //FIXME: hardcoded client id
        .then((o) => {
            fetch("https://api.spotify.com/v1/me", {
        method: "GET", headers: { Authorization: `Bearer ${o}` }
    }).then((result) => console.log(result.json()))
        })
    }

    function fuck() {
        getAccessToken("0833c365ed2e41cdaf8119cfe3f34ff9",authCode) //FIXME: hardcoded client id
        .then((o) => {
            fetch("https://api.spotify.com/v1/me", {
        method: "GET", headers: { Authorization: `Bearer ${o}` }
    }).then((result) => console.log(result.json()))
        })
    }

</script>


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
        width: 100vw;
        height: 100vh;
        transform: scale(1.2);
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
        right: 3.5rem
    }
    .sideActions button{
        background-color: rgba(140, 142, 240, 0.1);
        border-radius: 3.75rem;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 5rem;
        height: 5rem;
        backdrop-filter: blur(100px) brightness(1.7);
        margin: 1rem;
    }
    .controls {
        display: flex;
        align-items: center;
        justify-content: center;
        bottom: 3rem;
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
    }
    .controls button{
        margin-left: 3rem;
        margin-right: 3rem;
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
    .trackInfo {
        margin: 3rem;
        color: #fbfcfc;
    }
    .title {
        font-size: 3rem;
    }
    .artist {
        font-size: 2rem;
    }
    .progress {
        background-image: linear-gradient(360deg, rgba(255, 255, 255, 0.486), transparent);
        height: 3rem;
        position: absolute;
        bottom: 0;
    }
    .play {
        height: 13vh;
    }
    .side {
        height: 10vh;
    }
</style>

<button on:click={fuck}>fuck</button>


<SpotifyLogin/>

<div class="progress" style="width: {percentage}vw;"></div>
<div class="background"style="background-image: url({artwork})"></div>
<div class="playerContainer" >
    <div class="sideActions">
        <button class="shuffle" on:click={handleShuffle}>
            {#if shuffle}
            <Icon src="{ArrowsRightLeft}" solid size=50 fill="#fbfcfc"/>
            {:else}
            <Icon src="{ArrowsRightLeft}" solid size=50/>
            {/if}
        </button>
        <button class="loop" on:click={handleLoop}>
            {#if loop}
            <Icon src="{ArrowPathRoundedSquare}" solid size=50 fill="#fbfcfc"/>
            {:else}
            <Icon src="{ArrowPathRoundedSquare}" solid size=50/>
            {/if}
        </button>
    </div>
    <!-- <center>
        <img src="{artwork}" alt="" style="width: 70vh">
    </center> -->
    <div class="albumContainer">
        <img src="{artwork}" alt="" class="albumArt">
        <div class="albumInfo">
            <div>{albumTitle}</div>
            <div>{albumDetails}</div>
        </div>
    </div>
    <div class="trackInfo">
        <div class="title">{title}</div>
        <div class="artist">{artist}</div>
    </div>
    <!-- TODO: aria-label for buttons-->
    
    <div class="controls">
        <button class="side"><Icon src="{Backward}" solid size=80 fill="#fbfcfc"/></button>
        <button class="play" on:click={handlePlay}>
            {#if playing} <!-- TODO: https://stackoverflow.com/questions/73278702/correct-way-of-changing-svg-image-in-svelte-->
                <Icon src="{PauseCircle}" solid fill="#fbfcfc" size=100%/>
            {:else}
                <Icon src="{PlayCircle}" solid fill="#fbfcfc" size=100%/>
            {/if} 
        </button>
        
        <button class="side"><Icon src="{Forward}" solid size=80 fill="#fbfcfc"/></button>
    </div>
</div>
