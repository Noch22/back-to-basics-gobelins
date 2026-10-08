export default function setupUI() {
  const loginButton = document.getElementById("login-content-button");
  const playerButton = document.getElementById("player-logo-button");

  document.addEventListener("DOMContentLoaded", () => {
    const myWindow = document.getElementById("#myWindow");
  });

  loginButton?.addEventListener("click", () => {
    switchView();
  });

  playerButton?.addEventListener("click", () => {
    playerButton.style.backgroundColor = "blue";
  });

  playerButton?.addEventListener("dblclick", () => {
    console.log("Double click detected on player button");
    if (myWindow) {
      myWindow.classList.toggle("hidden");
    }
  });

  function switchView() {
    const loginView = document.getElementById("login-view");
    const mainView = document.getElementById("main-view");

    if (loginView && mainView) {
      loginView.classList.add("hidden");
      mainView.classList.remove("hidden");
    }
    console.log("Switching view to main view");
  }

  function makeDraggable(element) {
    let currentPosX = 0,
      currentPosY = 0,
      previousPosX = 0,
      previousPosY = 0;

    if (element.querySelector(".window-top")) {
      element.querySelector(".window-top").onmousedown = dragMouseDown;
    } else {
      element.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
      e.preventDefault();
      previousPosX = e.clientX;
      previousPosY = e.clientY;
      document.onmouseup = closeDragElement;
      document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
      e.preventDefault();
      currentPosX = previousPosX - e.clientX;
      currentPosY = previousPosY - e.clientY;
      previousPosX = e.clientX;
      previousPosY = e.clientY;
      element.style.top = element.offsetTop - currentPosY + "px";
      element.style.left = element.offsetLeft - currentPosX + "px";
    }

    function closeDragElement() {
      document.onmouseup = null;
      document.onmousemove = null;
    }
  }

  makeDraggable(document.querySelector("#myWindow"));

  document.addEventListener("click", (e) => {
    if (e.target.closest(".round.red")) {
      e.target.closest(".window").classList.add("hidden");
    }
  });
}
