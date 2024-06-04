const env = "prod"
let players
let body = document.body
const listeJoueurs = document.getElementById("liste_joueurs")
const playersList = document.getElementById("players_list")
const inscription = document.getElementById("inscription")
const connexion = document.getElementById("connexion")
const rules = document.getElementById("rules")
const btnStart = document.getElementById("btn_start")

// On met un écouteur sur la liste des joueurs pour savoir quand elle complètement chargée et faire disparaitre le loader
let config = { childList: true, subtree: true }
let observer = new MutationObserver((mutationsList, observer) => {
    for(let mutation of mutationsList) {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            if (document.querySelector('.player')) {
                document.getElementById("loader").classList.add("hidden")
            }
        }
    }
})

document.addEventListener('DOMContentLoaded', () => {
    const avatars = document.querySelectorAll('#avatar-grid .avatar')

    avatars.forEach(avatar => {
        avatar.addEventListener('click', () => {
            avatars.forEach(img => img.classList.remove('ring-2', 'ring-gray-300', 'dark:ring-blue-700'))
            avatar.classList.add('ring-2', 'ring-gray-300', 'dark:ring-blue-700')
            localStorage.setItem("playerProfileUrl", avatar.src)
        })
    })
})

btnStart.addEventListener("click", async () => {
    rules.classList.add("hidden")
    listeJoueurs.classList.remove("hidden")
    TweenMax.from(listeJoueurs, 1, {
        delay: 0,
        x: 100,
        opacity: 0,
        ease: Expo.easeInOut,
    })

    // Lancement du jeu
    startGame()
})

function startGame() {
    observer.observe(playersList, config)
    // Récuperation des utilisateurs dans le localStorage
    players = getInLocalStorage("players") || []

    // Affichage des utilisateurs
    if (players.length > 0) {
        players.map(player => {
            playersList.appendChild(createPlayerInTheDOM(player))
        })
    } else {
        observer.disconnect()
        document.getElementById("loader").classList.add("hidden")
    }

    document.addEventListener("click", (event) => {
        if (event.target.classList.contains("player")) {
            // Afficher la page de connexion pour l'utilisateur selectionné
            const username = event.target.children[1].children[0].innerText
            redirectToLogin(username)
        }
    })
    
    const btnCreateProfile = document.createElement("button")
    btnCreateProfile.classList.add("w-full", "px-5", "py-2.5", "text-center", "text-sm", "font-medium", "text-white", "bg-blue-700", "rounded-lg", "hover:bg-blue-800", "focus:ring-4", "focus:outline-none", "focus:ring-blue-300", "dark:bg-blue-600", "dark:hover:bg-blue-700", "dark:focus:ring-blue-800")
    btnCreateProfile.innerText = "Créer un nouveau profil"
    btnCreateProfile.addEventListener("click", () => {
        showCreateProfileForm()
    })
    
    listeJoueurs.appendChild(btnCreateProfile)
}

function redirectToLogin(username) {
    listeJoueurs.classList.toggle("hidden")
    connexion.classList.toggle("hidden")
    TweenMax.from(connexion, 1, {
        delay: 0,
        x: 100,
        opacity: 0,
        ease: Expo.easeInOut,
    })
    document.getElementById("username_signin").value = username
}

// Afficher la page d'inscription
function showCreateProfileForm() {
    listeJoueurs.classList.toggle("hidden")
    document.getElementById("avatars").classList.toggle("hidden")
    TweenMax.from("#avatars", 1, {
        delay: 0,
        x: 100,
        opacity: 0,
        ease: Expo.easeInOut,
    })
}

document.getElementById("signin_registration").addEventListener("click", () => {
    connexion.classList.toggle("hidden")
    inscription.classList.toggle("hidden")
    TweenMax.from(inscription, 1, {
        delay: 0,
        x: 100,
        opacity: 0,
        ease: Expo.easeInOut,
    })
})

// Inscription
document.getElementById("registration").addEventListener("click", () => {
    const username = document.getElementById("username")
    const password = document.getElementById("password")

    if ((username.value.trim() === "" && password.value.trim() === "") || findUserName(username.value.trim()) || password.value.trim().length < 8) {
        showToast("error", 2000)
        return
    }

    hashPassword(password.value).then(hashedPassword => {
        const profileUrl = localStorage.getItem("playerProfileUrl") || "/images/hello.png"
        const player = {
            username: username.value,
            password: hashedPassword,
            score: 0,
            profileUrl: profileUrl
        }

        players.push(player)
        localStorage.removeItem("playerProfileUrl")
        saveInLocalStorage("players", players)
        saveInLocalStorage("connectedUser", player)
        showToast("succes", 2000)
        setTimeout(() => {
            redirectToHomePage()
        }, 2000)
    })
})

function findUserName(username) {
    players.map(player => {
        if (player.username === username) {
            return true
        }
    })

    return false
}

document.getElementById("button_choose_avatar").addEventListener("click", () => {
    document.getElementById("avatars").classList.toggle("hidden")
    inscription.classList.toggle("hidden")
    TweenMax.from(inscription, 1, {
        delay: 0,
        x: 100,
        opacity: 0,
        ease: Expo.easeInOut,
    })
})

// Annuler l'inscription
document.getElementById("cancel_registration").addEventListener("click", () => {
    inscription.classList.toggle("hidden")
    listeJoueurs.classList.toggle("hidden")
    TweenMax.from(listeJoueurs, 1, {
        delay: 0,
        x: 100,
        opacity: 0,
        ease: Expo.easeInOut,
    })
})

// Créer une div pour chaque utilisateur
function createPlayerInTheDOM(player) {
    const playerItem = document.createElement("div")
    playerItem.classList.add("w-full", "h-16", "py-5", "px-4", "border", "border-gray-600", "hover:bg-gray-900", "hover:shadow", "hover:border-none", "rounded-lg", "flex", "items-center", "gap-5", "cursor-pointer", "transition", "duration-300", "ease-in-out", "player")

    const profile = document.createElement("img")
    profile.setAttribute("src", player.profileUrl)
    profile.setAttribute("alt", "pro")
    profile.classList.add("w-10", "h-10", "rounded-full", "p-1", "ring-2", "ring-gray-300", "dark:ring-gray-500", "cursor-pointer")

    const username = document.createElement("p")
    username.classList.add("font-medium", "text-blue-900", "dark:text-blue-700")
    username.innerText = player.username

    const score = document.createElement("span")
    score.classList.add("text-sm", "text-gray-500", "dark:text-gray-400")
    score.innerText = "Score: ".concat(player.score).concat(" XP")

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

    if (username.value.trim() === "" || password.value.trim() === "") {
        showToast("error", 2000)
        return
    }

    players.map(player => {
        hashPassword(password.value).then(hashedPassword => {
            if (player.username === username.value || player.password === hashedPassword) {
                showToast("error", 2000)
                return
            }

            username.value = ""
            password.value = ""

            showToast("success", 1000)

            //Ajout de l'utilisateur connecté dans le localStorage
            saveInLocalStorage("connectedUser", player)
            // Rédirection vers la page d'accueil
            setTimeout(() => {
                redirectToHomePage()
                return
            }, 1000)
        })
    })
})

function showToast(toastType, duration) {
    if (toastType === "success") {
        body.classList.toggle("flex-col")
        document.getElementById("toast_success").classList.toggle("hidden")

        setTimeout(() => {
            body.classList.toggle("flex-col")
            document.getElementById("toast_success").classList.toggle("hidden")
        }, duration)
    }

    if (toastType === "error") {
        body.classList.toggle("flex-col")
        document.getElementById("toast_error").classList.toggle("hidden")

        setTimeout(() => {
            body.classList.toggle("flex-col")
            document.getElementById("toast_error").classList.toggle("hidden")
        }, duration)
    }
}

function redirectToHomePage() {
    window.location.pathname = env === "prod" ? "/pages/home.html" : "/Devinette/pages/home.html"
}

// Méthode pour hasher le mot de passe
async function hashPassword(password) {
    const encoder = new TextEncoder()
    const data = encoder.encode(password)
    const hashBuffer = await crypto.subtle.digest("SHA-256", data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    
    return hashArray.map(byte => byte.toString(16).padStart(2, "0")).join("")
}

function saveInLocalStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value))
}

function getInLocalStorage(key) {
    return JSON.parse(localStorage.getItem(key))
}

// Animtation
TweenMax.from(rules, 1, {
    delay: 0,
    y: 50,
    opacity: 0,
    ease: Expo.easeInOut
})

TweenMax.from(rules.children[0], 1, {
    delay: 0.2,
    x: 20,
    opacity: 0,
    ease: Expo.easeInOut
})

TweenMax.from(rules.children[1], 1, {
    delay: 0.4,
    x: 40,
    opacity: 0,
    ease: Expo.easeInOut
})

TweenMax.from(btnStart, 1, {
    delay: 0.6,
    x: 60,
    opacity: 0,
    ease: Expo.easeInOut
})