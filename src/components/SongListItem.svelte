<script>
    import { findLargestImageIndex } from "../commonUtils";
    export let song
</script>

<style>
    .card {
        height: 3rem;
        padding: 1rem;
        margin: 0.5rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: #3a3a3a;
        border-radius: 2ch;
    }
    img {
        height: 100%;
    }
</style>

<div class="card">
    <img src="{song.album.images[findLargestImageIndex(song.album.images)].url}" alt=""> <!-- this should not be hq-->
    <div class="name">
        {song.name} · {song.artists[0].name}
    </div>
</div>