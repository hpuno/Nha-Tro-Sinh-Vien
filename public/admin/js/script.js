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

// form-change-status_rental
const changeStatusRental = document.querySelectorAll("[change-status_rental]");
if (changeStatusRental) {
  const formChangeStatus = document.querySelector("#form-change-status_rental");
  changeStatusRental.forEach((item) => {
    item.addEventListener("click", () => {
      let status = item.getAttribute("status");
      let id = item.getAttribute("id");

      switch (status) {
        case "confirm":
          status = "active";
          break;
        case "active":
          status = "inactive";
          break;
        case "inactive":
          status = "active";
          break;
        default:
          break;
      }

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
      const isconfirm = confirm("Bạn có chắc muốn xóa không");

      if (isconfirm) {
        const id = item.getAttribute("id");
        let path = formDelete.getAttribute("path");
        path += `/${id}?_method=DELETE`;

        formDelete.action = path;
        formDelete.submit();
      }
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

const previewImageCreate = document.querySelector("[preview-image-create]");
if (previewImageCreate) {
  const previewCreate = document.querySelector("[preview-create]");
  previewImageCreate.addEventListener("change", () => {
    const [file] = previewImageCreate.files;
    if (file) {
      previewCreate.src = URL.createObjectURL(file);
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

// export-file
const exportFile = document.querySelector("[export-file ]");
if (exportFile) {
  let path = `${window.location.pathname}/export-file`;
  let url = new URL(path, window.location.origin);
  exportFile.addEventListener("click", () => {
    url.href += window.location.search;
    window.location.href = url.href;
  });
}

// change-price-format
const changePriceFormat = document.querySelector("[change-price-format]");
if (changePriceFormat) {
  changePriceFormat.addEventListener("input", () => {
    let price = changePriceFormat.value.trim();
    price = price.replaceAll(",", "");
    const priceNew = new Intl.NumberFormat("en-US").format(price);
    changePriceFormat.value = priceNew;
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

// format-price-input
const formatPriceUInput = document.querySelectorAll("[format-price-input]");
if (formatPriceUInput) {
  formatPriceUInput.forEach((item) => {
    const price = new Intl.NumberFormat("en-US").format(item.value);
    item.value = price;
  });
}

// #rental-housing
const rentalHousing = document.querySelector("#rental-housing");
if (rentalHousing) {
  let url = new URL(window.location.href);
  rentalHousing.addEventListener("change", () => {
    const value = rentalHousing.value;
    if (value) url.searchParams.set("idHousing", value);
    else url.searchParams.delete("idHousing");
    window.location.href = url.href;
  });
}

// #rental-room
const rentalRoom = document.querySelector("#rental-room");
if (rentalRoom) {
  let url = new URL(window.location.href);
  rentalRoom.addEventListener("change", () => {
    const value = rentalRoom.value;
    if (value) url.searchParams.set("idRoom", value);
    else url.searchParams.delete("idRoom");
    window.location.href = url.href;
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
