export async function setRepeat(option, device_id) {
    await fetch(`https://api.spotify.com/v1/me/player/repeat?state=${option}&device_id=${device_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/x-www-form-urlencoded", Authorization: `Bearer ${localStorage.getItem("access-token")}` }
      })
}

export async function setShuffle(option, device_id) {
  await fetch(`https://api.spotify.com/v1/me/player/shuffle?state=${option}&device_id=${device_id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/x-www-form-urlencoded", Authorization: `Bearer ${localStorage.getItem("access-token")}` }
  })
}