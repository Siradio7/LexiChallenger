let players
let body = document.body
const playersList = document.getElementById("liste_joueurs")
const inscription = document.getElementById("inscription")
const connexion = document.getElementById("connexion")
const rules = document.getElementById("rules")
const btnStart = document.getElementById("btn_start")

// On met un écouteur sur la liste des joueurs pour savoir quand elle complètement chargée et faire disparaitre le loader
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

    // Récuperation des informations des joueurs dans le fichier players.json
    await fetch("./data/players.json").then(res => {
        res.json().then(res => {
            localStorage.setItem("players", JSON.stringify(res.players))
        })
    })

    // Lancement du jeu
    startGame()
})

function startGame() {
    // Récuperation des utilisateurs dans le localStorage
    players = JSON.parse(localStorage.getItem("players"))

    // Affichage des utilisateurs
    players.map(player => {
        playersList.appendChild(createPlayerInTheDOM(player))
    })

    document.addEventListener("click", (event) => {
        if (event.target.classList.contains("player")) {
            // Afficher la page de connexion pour l'utilisateur selectionné
            const username = event.target.children[1].children[0].innerText
            redirectToLogin(username)
        }
    })
    
    const btnCreateProfile = document.createElement("button")
    btnCreateProfile.classList.add("inline-flex", "items-center", "px-3", "py-2", "text-sm", "font-medium", "text-center", "text-white", "bg-blue-700", "rounded-lg", "hover:bg-blue-800", "focus:ring-4", "focus:outline-none", "focus:ring-blue-300", "dark:bg-blue-600", "dark:hover:bg-blue-700", "dark:focus:ring-blue-800")
    btnCreateProfile.innerText = "Créer un nouveau profil"
    btnCreateProfile.addEventListener("click", () => {
        showCreateProfileForm()
    })
    
    playersList.appendChild(btnCreateProfile)
}

function redirectToLogin(username) {
    playersList.classList.toggle("hidden")
    connexion.classList.toggle("hidden")
    document.getElementById("username_signin").value = username
}

// Afficher la page d'inscription
function showCreateProfileForm() {
    playersList.classList.toggle("hidden")
    inscription.classList.toggle("hidden")
}

// Inscription
document.getElementById("registration").addEventListener("click", () => {
    const username = document.getElementById("username").value
    const password = document.getElementById("password").value


})

// Annuler l'inscription
document.getElementById("cancel_registration").addEventListener("click", () => {
    inscription.classList.toggle("hidden")
    playersList.classList.toggle("hidden")
})

// Créer une div pour chaque utilisateur
function createPlayerInTheDOM(player) {
    const playerItem = document.createElement("div")
    playerItem.classList.add("w-full", "h-16", "py-5", "px-4", "border", "border-gray-600", "hover:bg-gray-900", "hover:shadow", "hover:border-none", "rounded-lg", "flex", "items-center", "gap-5", "cursor-pointer", "transition", "duration-300", "ease-in-out", "player")

    const profile = document.createElement("img")
    profile.setAttribute("src", "images/hello.png")
    profile.setAttribute("alt", "profile")
    profile.classList.add("w-10", "h-10", "rounded-full", "p-1", "ring-2", "ring-gray-300", "dark:ring-gray-500", "cursor-pointer")

    const username = document.createElement("p")
    username.classList.add("font-medium", "text-blue-900", "dark:text-blue-700")
    username.innerText = player.username

    const score = document.createElement("span")
    score.classList.add("text-sm", "text-gray-500", "dark:text-gray-400")
    score.innerText = "Score: ".concat(player.score)

    const infos = document.createElement("div")
    infos.appendChild(username)
    infos.appendChild(score)

    playerItem.appendChild(profile)
    playerItem.appendChild(infos)

    return playerItem
}

// Connexion
document.getElementById("signin").addEventListener("click", () => {
    const username = document.getElementById("username_signin")
    const password = document.getElementById("password_signin")
    let isUserLoggedIn = false

    if (username.value.trim() === "" && password.value.trim() === "") {
        return
    }

    players.map(player => {
        hashPassword(password.value).then(hashedPassword => {
            if (player.username === username.value && player.password === hashedPassword) {
                username.value = ""
                password.value = ""
                isUserLoggedIn = true

                showToast("success", 1000)

                //Ajout de l'utilisateur connecté dans le localStorage
                localStorage.setItem("connectedUser", JSON.stringify(player))
                // Rédirection vers la page d'accueil
                setTimeout(() => {
                    redirectToHomePage()
                }, 1000)
                return
            }
        })
    })

    if (!isUserLoggedIn) {
        showToast("error", 3000)
    }
})

function showToast(toastType, duration) {
    if (toastType === "success") {
        body.classList.toggle("flex-col")
        document.getElementById("toast_success").classList.toggle("hidden")

        setTimeout(() => {
            body.classList.toggle("flex-col")
            document.getElementById("toast_success").classList.toggle("hidden")
        }, duration)
    } else if (toastType === "error") {
        body.classList.toggle("flex-col")
        document.getElementById("toast_error").classList.toggle("hidden")

        setTimeout(() => {
            body.classList.toggle("flex-col")
            document.getElementById("toast_error").classList.toggle("hidden")
        }, duration)
    } else {

    }
}

function redirectToHomePage() {
    window.location.href = "/Devinette/pages/home.html"
}

// Méthode pour hasher le mot de passe
async function hashPassword(password) {
    const encoder = new TextEncoder()
    const data = encoder.encode(password)
    const hashBuffer = await crypto.subtle.digest("SHA-256", data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    
    return hashArray.map(byte => byte.toString(16).padStart(2, "0")).join("")
}