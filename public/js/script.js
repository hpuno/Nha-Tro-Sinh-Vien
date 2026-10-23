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

// format-price
const formatPrice = document.querySelectorAll(".format-price");
if (formatPrice) {
  formatPrice.forEach((item) => {
    const priceNew = new Intl.NumberFormat("en-US").format(item.innerHTML);
    item.innerHTML = priceNew;
  });
}

// pagination
const pagination = document.querySelector("[pagination]");
if (pagination) {
  let url = new URL(window.location.href);
  const page = pagination.querySelectorAll("[page]");
  page.forEach((item) => {
    item.addEventListener("click", () => {
      const value = item.getAttribute("page");
      if (value) url.searchParams.set("page", value);
      else url.searchParams.delete("page");
      window.location.href = url.href;
    });
  });
}

const formSearch = document.querySelector("#form-search");
if (formSearch) {
  const searchInp = formSearch.querySelector("#search");
  const url = new URL(window.location.href);
  formSearch.addEventListener("submit", (e) => {
    e.preventDefault();
    const value = searchInp.value;
    if (value) url.searchParams.set("search", value);
    else url.searchParams.delete("search");

    window.location.href = url.href;
  });
}

// filter-housing
const filterStatus = document.querySelector("#filter-housing");
if (filterStatus) {
  let url = new URL(window.location.href);
  filterStatus.addEventListener("change", () => {
    const value = filterStatus.value;
    if (value) url.searchParams.set("housing", value);
    else url.searchParams.delete("housing");
    window.location.href = url.href;
  });
}
