let showReceived = false;
let search = "";
let jsonData = [];
let tableData = [];

const tableBody = document.getElementById("table-body");
const showReceivedToggle = document.getElementById("showReceivedToggle");
const searchInput = document.getElementById("search-input");

showReceivedToggle.addEventListener("change", (event) => {
  showReceived = event.target.checked;
  fillTable();
});

searchInput.addEventListener("input", (event) => {
  search = event.target.value;
  fillTable();
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
    tableBody.innerHTML += `
    <tr data-index="${index}">
      <td><progress value="${item.priority}" max="10" /></td>
      <td>${
        item.isReceived ? "<span class='badge-received'>Получено</span>" : ""
      }${item.name}</td>
      <td>${item.tags.join(", ")}</td>
      <td>₽${item.price.toLocaleString("en-GB", { timeZone: "UTC" })}</td>
      <td><a href="${item.link}" target="_blank">${item.link}</a></td>
    </tr>
    `;
  }
}

getJsonData();
