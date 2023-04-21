import { UAParser } from "ua-parser-js";
//import svelte store
import { readable } from "svelte/store";
import { getQueue } from "./playerApi";

import { getAccessToken } from "./auth";

let updateState
let updateQueue

function getUserAgent() {
    const uap = UAParser(window.navigator.userAgent);
    console.log(uap);
    // const result = uap.getResult()
    return `${uap.browser.name} · ${uap.os.name}`;
}

export async function createPlayer() {
    player = new Spotify.Player({
        name: `CleanPlayer (${getUserAgent()}) `,
        getOAuthToken: (cb) => {
            cb(getAccessToken()); // TODO: token callback should check if token is still valid and refresh it
        },
        volume: 1,
    });
    player.addListener("player_state_changed", (async () => {
        let q = await getQueue(); // TODO: this stupid ass mf reloads your entire queue when pausing the track lmaoOOOOOO
        console.log('queue updated?', q)
        updateQueue(q);
    }));
}

export let queue = readable([], function start(set) {
    updateQueue = set
    set(queue)
})

export let player