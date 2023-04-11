export async function setRepeat(option) {
    await fetch(`https://api.spotify.com/v1/me/player/repeat?state=${option}`, {
        method: "PUT",
        headers: { "Content-Type": "application/x-www-form-urlencoded", Authorization: `Bearer ${localStorage.getItem("access-token")}` }
      })
}