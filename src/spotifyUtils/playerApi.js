import { toast } from "@zerodevx/svelte-toast"

export async function setRepeat(option, device_id) {
    await fetch(`https://api.spotify.com/v1/me/player/repeat?state=${option}&device_id=${device_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/x-www-form-urlencoded", Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
      }).then(() => {
        return true
      })
}

export async function setShuffle(option, device_id) {
  await fetch(`https://api.spotify.com/v1/me/player/shuffle?state=${option}&device_id=${device_id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/x-www-form-urlencoded", Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
  }).then(() => {
    return true
  })
}

export async function getQueue() {
  return fetch(`https://api.spotify.com/v1/me/player/queue`, {
      method: "GET",
      headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` } 
}).then(response => {
    if (!response.ok) {
      console.error("Couldn't get queue from api!");
    }
    return response.json();
  }).then(data => {
    return data.queue // thank you chatgpt after like 30 minutes it works
    })
}

export async function handoff(device_id) {
  await fetch("https://api.spotify.com/v1/me/player", {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
    body: `{ "device_ids": ["${device_id}"], "play": false }`
  }).then((res) => {
    if(res.status == 200 || res.status == 202) {
      return true
    } else {
      toast.push("Device handoff might not have succeded. You might have do it from another client using Spotify connect and choosing this device")
    }
  })
}