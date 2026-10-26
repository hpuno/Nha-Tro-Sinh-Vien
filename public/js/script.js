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
const filterHousing = document.querySelectorAll("[name='filter-housing']");
if (filterHousing.length > 0) {
  filterHousing.forEach((item) => {
    item.addEventListener("change", () => {
      const url = new URL(window.location.href);

      url.searchParams.delete("housing");

      const checkedHousing = document.querySelectorAll(
        "[name='filter-housing']:checked",
      );

      checkedHousing.forEach((checkbox) => {
        url.searchParams.append("housing", checkbox.value);
      });

      window.location.href = url.href;
    });
  });
}

// filter-price
const priceRoom = document.querySelectorAll("[name='price-room']");
if (priceRoom) {
  priceRoom.forEach((item) => {
    item.addEventListener("change", () => {
      let url = new URL(window.location.href);
      if (item.value) url.searchParams.set("price", item.value);
      else url.searchParams.delete("price");

      window.location.href = url.href;
    });
  });
}

// clear-filter
const clearFilter = document.querySelector("#clear-filter");
if (clearFilter) {
  clearFilter.addEventListener("click", () => {
    window.location.href = new URL("/room", window.location.origin);
  });
}

// TP_NGAY_KETTHUC
const select_TP_NGAY_KETTHUC = document.querySelector("select#TP_NGAY_KETTHUC");
if (select_TP_NGAY_KETTHUC) {
  select_TP_NGAY_KETTHUC.addEventListener("change", () => {
    const inp_TP_NGAY_KETTHUC = document.querySelector(
      "[name='TP_NGAY_KETTHUC']",
    );

    const TP_NGAYTHUE = document.querySelector("#TP_NGAYTHUE").value;
    let value = select_TP_NGAY_KETTHUC.value;

    if (value != "") {
      value = parseFloat(value) * 12;
      const ngayKT = new Date(TP_NGAYTHUE);

      ngayKT.setMonth(ngayKT.getMonth() + value);
      inp_TP_NGAY_KETTHUC.value = `${ngayKT.getFullYear()}-${String(ngayKT.getMonth() + 1).padStart(2, "0")}-${String(ngayKT.getDate()).padStart(2, "0")}`;
    } else inp_TP_NGAY_KETTHUC.value = null;
  });
}
