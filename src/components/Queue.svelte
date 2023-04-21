<script>
    import SongListItem from "./SongListItem.svelte";
    import { queue } from "../spotifyUtils/player";
	import { onMount } from 'svelte';
    import { getQueue } from "../spotifyUtils/playerApi";
    let q = []
    queue.subscribe(value => {
        q = value
    })

	onMount(async () => {
		q = await getQueue()
	});
</script>

{#if q.length > 0} <!-- this is a direct copy from https://svelte.dev/tutorial/readable-stores, might not be the brightest idea-->

    {#each q as song}
        <SongListItem song={song}/>
    {/each}

{:else}

<p>Nothing here yet...</p>

{/if}

