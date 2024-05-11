const playersList = document.getElementById("liste_joueurs")
const inscription = document.getElementById("inscription")
const rules = document.getElementById("rules")
const btnStart = document.getElementById("btn_start")

btnStart.addEventListener("click", async () => {
    rules.classList.add("hidden")
    playersList.classList.remove("hidden")

    await fetch("./data/players.json").then(res => {
        res.json().then(res => {
            localStorage.setItem("players", JSON.stringify(res.players))
        })
    })
    
    startGame()
})

function startGame() {
    const players = JSON.parse(localStorage.getItem("players"))

    players.map(player => {
        playersList.appendChild(createPlayerInTheDOM(player))
    })
    
    const btnCreateProfile = document.createElement("button")
    btnCreateProfile.classList.add("bg-slate-800", "rounded-lg", "py-2", "px-6", "hover:bg-slate-500", "text-white")
    btnCreateProfile.innerText = "Créer un nouveau profil"
    btnCreateProfile.addEventListener("click", () => {
        showCreateProfileForm()
    })
    
    playersList.appendChild(btnCreateProfile)
}

function showCreateProfileForm() {
    playersList.classList.add("hidden")
    inscription.classList.remove("hidden")
}

document.getElementById("cancel_registration").addEventListener("click", () => {
    inscription.classList.add("hidden")
    playersList.classList.remove("hidden")
})

function createPlayerInTheDOM(player) {
    const playerItem = document.createElement("div")
    playerItem.classList.add("w-full", "h-16", "py-5", "px-4", "bg-slate-600", "hover:bg-slate-500", "rounded-lg", "flex", "items-center", "gap-5")

    const profile = document.createElement("img")
    profile.setAttribute("src", "hello.png")
    profile.setAttribute("alt", "profile")
    profile.classList.add("w-10", "h-10", "rounded-full")

    const username = document.createElement("p")
    username.classList.add("font-medium")
    username.innerText = player.username

    const score = document.createElement("span")
    score.classList.add("font-light")
    score.innerText = "Score: ".concat(player.score)

    const infos = document.createElement("div")
    infos.appendChild(username)
    infos.appendChild(score)

    playerItem.appendChild(profile)
    playerItem.appendChild(infos)

    return playerItem
}

async function hashPassword(password) {
    const encoder = new TextEncoder()
    const data = encoder.encode(password)
    const hashBuffer = await crypto.subtle.digest("SHA-256", data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    
    return hashArray.map(byte => byte.toString(16).padStart(2, "0")).join("")
}