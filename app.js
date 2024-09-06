let showReceived = false;
let showMobileSearch = false;
let search = "";
let jsonData = [];
let tableData = [];

const tableBody = document.getElementById("table-body");
const showReceivedToggle = document.getElementById("showReceivedToggle");
const searchInput = document.getElementById("search-input");
const toggleLight = document.getElementById("toggle-light");
const toggleDark = document.getElementById("toggle-dark");
const searchToggle = document.getElementById("mobile-search-toggle");
const mobileSearch = document.getElementById("mobile-search");
const mobileSearchInput = document.getElementById("mobile-search-input");

showReceivedToggle.addEventListener("change", (event) => {
  showReceived = event.target.checked;
  fillTable();
});

searchToggle.addEventListener("click", (event) => {
  event.preventDefault();
  mobileSearch.classList.toggle("hidden");
  mobileSearchInput.focus();
});

searchInput.addEventListener("input", (event) => {
  search = event.target.value;
  fillTable();
});

mobileSearchInput.addEventListener("input", (event) => {
  search = event.target.value;
  fillTable();
});

mobileSearchInput.addEventListener("focusout", (event) => {
  if (event.target.value.length === 0) {
    mobileSearch.classList.toggle("hidden");
  }
});

toggleLight.addEventListener("click", (event) => {
  event.preventDefault();
  document.getElementsByTagName("html")[0].dataset.theme = "dark";
});

toggleDark.addEventListener("click", (event) => {
  event.preventDefault();
  document.getElementsByTagName("html")[0].dataset.theme = "light";
});

function getJsonData() {
  fetch("./data/table.json")
    .then((res) => res.json())
    .then((data) => {
      jsonData = data;
      fillTable();
    });
}

function fillTable() {
  tableBody.innerHTML = "";
  const data = jsonData
    .filter((x) => {
      // (showReceived ? true : x.isReceived === false)
      let byReceived = showReceived ? true : x.isReceived === false;
      let bySearch =
        search.length > 0 ? x.name.toLowerCase().includes(search) : true;

      return byReceived && bySearch;
    })
    .sort((a, b) => b.priority - a.priority || b.price - a.price);

  for (let index = 0; index < data.length; index++) {
    const item = data[index];
    let tagsMarkup = "";
    for (const tag of item.tags) {
      tagsMarkup += `<span class='badge'>${tag}</span>`;
    }
    tableBody.innerHTML += `
    <tr data-index="${index}">
      <td><progress class="priority-progress" value="${
        item.priority
      }" max="10" title="${item.priority} из 10"/>
      </td>
      <td>${item.isReceived ? "<span class='badge'>Получено</span>" : ""}${
      item.name
    }</td>
      <td>${tagsMarkup}</td>
      <td>₽${item.price.toLocaleString("en-GB", { timeZone: "UTC" })}</td>
      <td><a href="${item.link}" target="_blank">${item.link}</a></td>
    </tr>
    `;
  }
}

getJsonData();
