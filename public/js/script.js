// show-alert
const showAlert = document.querySelector("[show-alert]");

if (showAlert) {

  const time = parseInt(showAlert.getAttribute("data-time"));
  setTimeout(() => {
    showAlert.classList.add("hidden");
  }, time);
}
