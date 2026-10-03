// show-alert
const showAlert = document.querySelector("[show-alert]");

if (showAlert) {
  const time = parseInt(showAlert.getAttribute("data-time"));
  setTimeout(() => {
    showAlert.classList.add("hidden");
  }, time);
}

// preview image
const previewImage = document.querySelector("[preview-image]");
if (previewImage) {
  const preview = document.querySelector("[preview]");

  previewImage.addEventListener("change", () => {
    const [file] = previewImage.files;
    if (file) {
      preview.classList.remove("hidden");
      preview.src = URL.createObjectURL(file);
    }
  });
}
