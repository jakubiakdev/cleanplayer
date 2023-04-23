import { persisted } from 'svelte-local-storage-store'
import { writable } from 'svelte/store'

export let settings = persisted('settings', {
    roundedCorners: false,
    volume: 1
})

export let playerActivated = writable(false)