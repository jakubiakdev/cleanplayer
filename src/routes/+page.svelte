<script>
    import { ArrowPathRoundedSquare, ArrowsRightLeft, Backward, Forward, Icon, PauseCircle, PlayCircle} from "svelte-hero-icons";
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
</script>

<style>
    :root {
        --radius: 3rem;
    }
    #background {
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

    #playerContainer {
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
    /* #playerContainer {
        text-align: center;
    } */
    #sideActions {
        position: absolute;
        right: 3.5rem
    }
    #sideActions button{
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
    #controls {
        display: flex;
        align-items: center;
        justify-content: center;
        bottom: 3rem;
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
    }
    #controls button{
        margin-left: 3rem;
        margin-right: 3rem;
    }
    #albumContainer {
        top: 5rem;
        width: 100%;
        height: 60vh;
        display: flex;
        align-items: center;
    }
    #albumArt {
        
        height: 60vh;
        left: calc(50% - 30vh);
        position: fixed;
    }
    #albumInfo {
        margin-left: 32vh;
        position: absolute;
        left: 50%;
        color: #abafb2;
        text-align: left;
        font-size: 1.5rem;
    }
    #trackInfo {
        margin: 3rem;
        color: #fbfcfc;
    }
    #title {
        font-size: 3rem;
    }
    #artist {
        font-size: 2rem;
    }
    #progress {
        background-image: linear-gradient(360deg, rgba(255, 255, 255, 0.486), transparent);
        height: 3rem;
        position: absolute;
        bottom: 0;
    }
</style>

<div id="progress" style="width: {percentage}vw;"></div>
<div id="background"style="background-image: url({artwork})"></div>
<div id="playerContainer" >
    <div id="sideActions">
        <button id="shuffle" on:click={handleShuffle}>
            {#if shuffle}
            <Icon src="{ArrowsRightLeft}" solid size=50 fill="#fbfcfc"/>
            {:else}
            <Icon src="{ArrowsRightLeft}" solid size=50/>
            {/if}
        </button>
        <button id="loop" on:click={handleLoop}>
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
    <div id="albumContainer">
        <img src="{artwork}" alt="" id="albumArt">
        <div id="albumInfo">
            <div id="albumTitle">{albumTitle}</div>
            <div id="albumDetails">{albumDetails}</div>
        </div>
    </div>
    <div id="trackInfo">
        <div id="title">{title}</div>
        <div id="artist">{artist}</div>
    </div>
    <!-- TODO: aria-label for buttons-->
    
    <div id="controls">
        <button id="prev"><Icon src="{Backward}" solid size=80 fill="#fbfcfc"/></button>
        <button id="play" on:click={handlePlay}>
            {#if playing} <!-- TODO: https://stackoverflow.com/questions/73278702/correct-way-of-changing-svg-image-in-svelte-->
                <Icon src="{PauseCircle}" solid size=128 fill="#fbfcfc"/>
            {:else}
                <Icon src="{PlayCircle}" solid size=128 fill="#fbfcfc"/>
            {/if} 
        </button>
        
        <button id="next"><Icon src="{Forward}" solid size=80 fill="#fbfcfc"/></button>
    </div>
</div>
