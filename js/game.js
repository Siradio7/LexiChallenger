const connectedUser = JSON.parse(localStorage.getItem("connectedUser"))
const gameModal = document.getElementById("game_modal")
const resultModal = document.getElementById("result_modal")
const gamePages = document.getElementById("game_pages")
const buttonLogout = document.getElementById("logout")
const buttonPause = document.getElementById("button_pause")
const buttonGuess = document.getElementById("button_guess")
const buttonRestart = document.getElementById("button_restart")
const spanNbTry = document.getElementById("nb_try")
const spanScore = document.getElementById("score")
const ranking = document.getElementById("ranking")
const words = ["apprendre", "programmation", "rassemblement", "ensemble", "pouvoir", "programme", "folie", "confinement", "maladie", "phase", "compilation", "football", "navigation", "navigateur", "philosophie", "histoire", "ordinateur", "film", "montre", "valeur", "hopital", "joueur", "routeur", "chaise", "climatiseur", "tableau", "ecran"]
let wordToBeGuess, guessedWord, index, score = 0, nbAttempts = 0, nbError = 0, pas = 1
const generatedIndex = []

document.addEventListener("DOMContentLoaded", () => {
    // Affichage du nom de la personne connecté sur le header
    document.getElementById("username").innerText = connectedUser.username
    loadUsers()
    displayGameModal()
    buttonGuess.addEventListener("click", validate)
})

buttonRestart.addEventListener("click", displayGameModal)

function displayGameModal() {
    if (gamePages.classList.contains("hidden")) {
        gamePages.classList.toggle("hidden")
        resultModal.classList.toggle("hidden")
    }

    spanScore.innerText = "Score: ".concat(score).concat(" XP")
    spanNbTry.innerText = "Tentative: ".concat(nbError).concat("/5")

    nextWord()
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
/*
function hideLetters(word) {
    let hiddenWord = word.replace(word.substring(0, 3), "***")
    hiddenWord = hiddenWord.replace(hiddenWord.substring(hiddenWord.length - 1, hiddenWord.length), "*")

    return hiddenWord
}
*/

function hideLetters(word) {
    return word.replace(/[aeiouAEIOU]/g, "*");
}


function nextWord() {
    do {
        index = Math.floor(Math.random() * words.length -1)
    } while (findGeneratedValue(index) || index > words.length || index < 0)

    generatedIndex.push(index)
    wordToBeGuess = words[index]
    document.getElementById("word_to_be_guessed").innerText = hideLetters(wordToBeGuess)
}

function validate() {
    guessedWord = document.getElementById("guessed_word").value.trim()
    document.getElementById("guessed_word").value = ""

    if (wordToBeGuess == guessedWord) {
        score += pas
        nbError = 0
        nbAttempts++

        if (nbAttempts == 5) {
            pas += score == 5 ? 10-pas : 10
            nbAttempts = 0
        }

        // On passe au prochain mot
        nextWord()
    } else {
        nbAttempts = 0
        nbError++

        if (nbError == 3) {
            score -= Math.floor(score / 5)

            if (score < 0) {
                score = 0
            }
        }

        if (nbError == 5) {
            // Fin du jeu
            endGame()
            return
        }

        nextWord()
    }

    spanScore.innerText = "Score: ".concat(score).concat(" XP")
    spanNbTry.innerText = "Tentative: ".concat(nbError).concat("/5")
    document.getElementById("guessed_word").focus()
    refreshUsersRanking()
}

function endGame() {
    gamePages.classList.toggle("hidden")
    resultModal.classList.toggle("hidden")
    score = 0
    pas = 1
    nbAttempts = 0
    nbError = 0

}

// Chargement des joueurs au niveau du classement
function loadUsers() {
    const players = JSON.parse(localStorage.getItem("players"))

    // Trie des joueurs en fonction du score par ordre décroissant
   /* const playersSorted = players.sort((a, b) => {
        return b.score > a.score
    })*/
    // Trie des joueurs en fonction du score par ordre décroissant
    const playersSorted = players.sort((a, b) => b.score - a.score)

    ranking.innerHTML = ""; // Clear existing content

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
    const players = JSON.parse(localStorage.getItem("players")) || []

    // Mise à jour du score du joueur connecté
    const updatedPlayers = players.map(player => {
        if (player.username === connectedUser.username) {
            return { ...player, score: score }
        }
        return player
    })

    // Sauvegarde de la liste mise à jour dans le localStorage
    localStorage.setItem("players", JSON.stringify(updatedPlayers))

    // Recharger les utilisateurs pour refléter les changements
    loadUsers()
}

buttonLogout.addEventListener("click", () => {
    redirectToUsersPage()
    localStorage.removeItem("connectedUser")
})

function redirectToUsersPage() {
    window.location.href = "/Devinette/index.html"
}