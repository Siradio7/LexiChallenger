const connectedUser = JSON.parse(localStorage.getItem("connectedUser"))
const buttonLogout = document.getElementById("logout")
const buttonPause = document.getElementById("button_pause")
const ranking = document.getElementById("ranking")
const words = ["Apprendre", "Programmation", "Rassemblement", "Ensemble", "Pouvoir", "Programme", "Folie", "Confinement", "Maladie", "Phase", "Compilation"]
let wordToBeGuess, wordGuessed, index, score = 0, nbAttempts = 0, nbLimit = 10
const generatedIndex = []

document.addEventListener("DOMContentLoaded", () => {
    // Affichage du nom de la personne connecté sur le header
    document.getElementById("username").innerText = connectedUser.username
    loadUsers()
    displayGameModal()
})

function displayGameModal() {
    const gameModal = document.getElementById("game_modal")

}

// Fonction pour rechercher l'indice généré dans le tableau des anciens indices
function findGeneratedValue(value) {
    for (let i = 0; i < generatedIndex.length; i++) {
        if (generatedIndex[i] === value) {
            return true
        }
    }

    return false
}

// Fonction pour cacher les lettres
function hideLetters(word) {
    let hiddenWord = word.replace(word.substring(0, 3), "***")
    hiddenWord = hiddenWord.replace(hiddenWord.substring(hiddenWord.length - 1, hiddenWord.length), "*")

    return hiddenWord
}

function nextWord() {
    do {
        index = Math.floor(Math.random() * words.length -1)
    } while (findGeneratedValue(index))

    generatedIndex.push(index)
    wordToBeGuess = words[index]
    // Appel de la fonction hideLetters

}

function validate() {

}

// Chargement des joueurs au niveau du classement
function loadUsers() {
    const players = JSON.parse(localStorage.getItem("players"))

    // Trie des joueurs en fonction du score par ordre décroissant
    const playersSorted = players.sort((a, b) => {
        return b.score > a.score
    })

    // Affichage des joueurs
    playersSorted.map(player => {
        const playerItem = document.createElement("div")
        playerItem.classList.add("flex", "items-center", "gap-4", "cursor-pointer", "hover:bg-gray-900", "hover:shadow", "py-2", "px-3", "rounded-lg", "transition", "duration-300", "ease-in-out")

        const profile = document.createElement("img")
        profile.setAttribute("src", "../images/hello.png")
        profile.setAttribute("alt", "profile")
        profile.classList.add("w-10", "h-10", "p-1", "rounded-full", "ring-2", "ring-gray-300", "dark:ring-gray-500", "cursor-pointer")

        const username = document.createElement("div")
        username.innerText = player.username

        const score = document.createElement("span")
        score.classList.add("text-sm", "text-gray-500", "dark:text-gray-400")
        score.innerText =  player.score + " XP"

        const infos = document.createElement("div")
        infos.classList.add("font-medium", "dark:text-white")
        infos.appendChild(username)
        infos.appendChild(score)

        playerItem.appendChild(profile)
        playerItem.appendChild(infos)

        const separator = document.createElement("hr")
        separator.classList.add("my-2")

        ranking.appendChild(playerItem)
        ranking.appendChild(separator)
    })
}

// Fonction pour rafraichir le classement des joueurs en fonction du score du joueur actuel
function refreshUsersRanking() {

}

buttonLogout.addEventListener("click", () => {
    redirectToUsersPage()
    localStorage.removeItem("connectedUser")
})

function redirectToUsersPage() {
    window.location.href = "/Devinette/index.html"
}