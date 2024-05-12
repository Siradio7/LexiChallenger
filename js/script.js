const playersList = document.getElementById("liste_joueurs")
const inscription = document.getElementById("inscription")
const rules = document.getElementById("rules")
const btnStart = document.getElementById("btn_start")

// On met un écouteur sur la liste des joueurs pour savoir quand elle complètement chargée
let config = { childList: true, subtree: true };
let observer = new MutationObserver((mutationsList, observer) => {
    for(let mutation of mutationsList) {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            if (document.querySelector('.player')) {
                document.getElementById("loader").classList.add("hidden")
            }
        }
    }
})

observer.observe(playersList, config)

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
    btnCreateProfile.classList.add("inline-flex", "items-center", "px-3", "py-2", "text-sm", "font-medium", "text-center", "text-white", "bg-blue-700", "rounded-lg", "hover:bg-blue-800", "focus:ring-4", "focus:outline-none", "focus:ring-blue-300", "dark:bg-blue-600", "dark:hover:bg-blue-700", "dark:focus:ring-blue-800")
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
    playerItem.classList.add("w-full", "h-16", "py-5", "px-4", "border", "border-gray-600", "hover:bg-gray-700", "hover:border-none", "rounded-lg", "flex", "items-center", "gap-5", "cursor-pointer", "transition", "duration-300", "ease-in-out", "player")

    const profile = document.createElement("img")
    profile.setAttribute("src", "images/hello.png")
    profile.setAttribute("alt", "profile")
    profile.classList.add("w-10", "h-10", "rounded-full")

    const username = document.createElement("p")
    username.classList.add("font-medium", "text-blue-900", "dark:text-blue-700")
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