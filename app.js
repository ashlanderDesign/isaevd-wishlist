let showReceived = false;
let showMobileSearch = false;
let search = "";
let jsonData = [];
let jsonGroups = [];
let activeGroup = "general";

const tableBody = document.getElementById("table-body");
const groupsBody = document.getElementById("groups");
const groupDescrBody = document.getElementById("group-description");
const tableFooter = document.getElementById("table-footer");
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

  fetch("./data/groups.json")
    .then((res) => res.json())
    .then((data) => {
      jsonGroups = data;
      fillGroups();
    });
}

function fillGroups() {
  groupsBody.innerHTML = "";

  jsonGroups.forEach((item) => {
    const button = document.createElement("button");
    if (item.name !== activeGroup) {
      button.classList.add("outline", "secondary");
    } else {
      groupDescrBody.innerText = item.description;
    }
    button.appendChild(text(item.title));
    button.addEventListener("click", (e) => {
      activeGroup = item.name;
      fillGroups();
      fillTable();
    });
    groupsBody.appendChild(button);
  });
}

function fillTable() {
  tableBody.innerHTML = "";
  const data = jsonData
    .filter(
      (x) =>
        (showReceived || !x.isReceived) &&
        (!search || x.name.toLowerCase().includes(search.toLowerCase())) &&
        x.groups.includes(activeGroup)
    )
    .sort((a, b) => b.priority - a.priority || b.price - a.price);

  data.forEach((item, index) => {
    const tagsMarkup = item.tags
      .map((tag) => `<span class='badge'>${tag}</span>`)
      .join("");

    tableBody.innerHTML += `
        <tr data-index="${index}">
          <td><progress class="priority-progress" value="${
            item.priority
          }" max="10" title="${item.priority} из 10"/></td>
          <td>${item.isReceived ? '<span class="badge">Получено</span>' : ""}${
      item.name
    }</td>
          <td>${tagsMarkup}</td>
          <td>${item.price.toLocaleString("ru-RU", {
            style: "currency",
            currency: "RUB",
          })}</td>
          <td><a href="${item.link}" target="_blank">${item.link}</a></td>
        </tr>
      `;
  });

  const priceSum = data.reduce((sum, item) => sum + item.price, 0);

  const footerRow = `
  <tr>
    <th>Итого</th>
    <th>Позиций: ${data.length}</th>
    <th></th>
    <th>${priceSum.toLocaleString("ru-RU", {
      style: "currency",
      currency: "RUB",
    })}</th>
    <th></th>
  </tr>`;

  tableFooter.innerHTML = footerRow;
}

function text(value) {
  return document.createTextNode(value);
}

getJsonData();
