// show-alert
const showAlert = document.querySelector("[show-alert]");
if (showAlert) {
  const time = parseInt(showAlert.getAttribute("data-time"));
  setTimeout(() => {
    showAlert.classList.add("hidden");
  }, time);
}

// change-status
const changeStatus = document.querySelectorAll("[change-status]");
if (changeStatus) {
  let url = new URL(window.location.href);
  const formChangeStatus = document.querySelector("#form-change-status");
  changeStatus.forEach((item) => {
    item.addEventListener("click", () => {
      let status = item.getAttribute("status");
      let id = item.getAttribute("id");
      status = status == "active" ? "inactive" : "active";

      let path = formChangeStatus.getAttribute("path");
      path += `/${status}/${id}?_method=PATCH`;

      formChangeStatus.action = path;
      formChangeStatus.submit();
    });
  });
}

// delete
const buttonDelete = document.querySelectorAll("[button-delete]");
if (buttonDelete) {
  const formDelete = document.querySelector("#form-delete");
  buttonDelete.forEach((item) => {
    item.addEventListener("click", () => {
      const id = item.getAttribute("id");
      let path = formDelete.getAttribute("path");
      path += `/${id}?_method=DELETE`;

      formDelete.action = path;
      formDelete.submit();
    });
  });
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

// form-search
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

// filter-status
const filterStatus = document.querySelector("#filter-status");
if (filterStatus) {
  let url = new URL(window.location.href);
  filterStatus.addEventListener("change", () => {
    const value = filterStatus.value;
    if (value) url.searchParams.set("status", value);
    else url.searchParams.delete("status");
    window.location.href = url.href;
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
