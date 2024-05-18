const connectedUser = JSON.parse(localStorage.getItem("connectedUser"))
const buttonLogout = document.getElementById("logout")

document.getElementById("username").innerText = connectedUser.username

buttonLogout.addEventListener("click", () => {
    redirectToUsersPage()
    localStorage.removeItem("connectedUser")
})

function redirectToUsersPage() {
    window.location.href = "/Devinette/index.html"
}