<script>
    import SongListItem from "./SongListItem.svelte";
    import { queue } from "../spotifyUtils/player";
    import { getQueue } from "../spotifyUtils/playerApi";
    let q = []
    queue.subscribe(value => {
        q = value
    })

</script>

<style>
    button {
        position: absolute;
        right: 25%;
        transform: translateX(25%);
        top: calc(100% - 5rem);
        height: 3.5rem;
        width: 10rem;
        margin: 0.5rem;
        padding: 0.5rem;
        display: flex;
        justify-content: center;
        align-items: center;
        box-shadow: 0 0 10px 5px rgba(124, 124, 124, 0.26);
    }

    button {
        background-color: hsl(278, 100%, 65%);
        border: none;
        border-radius: 2ch;
        color: #fbfcfc;
        padding: 1rem;
        transition: background-color 0.2s ease-in-out;
    }
    button:hover {
        cursor: pointer;
        background-color: hsl(278, 100%, 50%)    
    }
    span {
        font-size: 2rem;
        position: relative;
        font-variation-settings: 'opsz' 20;
    }
</style>

{#if q != undefined && q?.length > 0 } 

    {#each q as song}
        <SongListItem song={song}/>
    {/each}

    {:else}
    
    <p>Nothing here yet...</p>
    
    {/if}
    
    <!-- <button on:click={getQueue}> TODO: Find a way to get it working
        <span class="material-symbols-rounded">
            refresh
        </span>
        Refresh
    </button> -->
    