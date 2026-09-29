// show-alert
const showAlert = document.querySelector("[show-alert]");
console.log("showAlert =", showAlert);

if (showAlert) {
  console.log("co chay vao day");
  const time = parseInt(showAlert.getAttribute("data-time"));
  setTimeout(() => {
    showAlert.classList.add("hidden");
  }, time);
}
