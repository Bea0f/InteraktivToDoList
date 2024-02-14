
import "../scss/style.scss";
import { Item } from "./Items";

let toDoList = [
  new Item("Handla", false),
  new Item("Laga mat", false),
  new Item("Städa", false),
  new Item("Plugga", false),
];

let doneList = [];

const toDoListContainer = document.getElementById("toDoContainer");
const doneListContainer = document.getElementById("doneContainer");

const toDo = document.createElement("ul");
const done = document.createElement("ul");
toDoListContainer.appendChild(toDo);
doneListContainer.appendChild(done);

const toDoForm = document.querySelector(".addForm");
toDoForm.addEventListener("submit", (e) => {
  e.preventDefault();
  newItem();
});

const select = document.getElementById("filter");
const option = select.querySelectorAll("option");

select.addEventListener("change", (e) => {
  const choice = e.target.value;
  localStorage.setItem("sortChoice", choice);
  sortList(choice);
});

window.addEventListener("load", () => {
  getFromToDoStorage();
  getFromDoneStorage();
  updateSort();
  showToDoList();
  showDoneItems();
});

function showToDoList() {
  toDo.innerHTML = "";
  for (let i = 0; i < toDoList.length; i++) {
    const li = document.createElement("li");
    li.innerHTML = toDoList[i].itemName;
    toDo.appendChild(li);
    createCloseBtn(li);

    li.addEventListener("click", () => {
      moveItem(i);
      updateSort();
    });
  }
}

// User add new Item
function newItem() {
  let userInput = document.getElementById("userInput").value;
  userInput = userInput.charAt(0).toUpperCase() + userInput.slice(1);

  if (userInput === "") {
    alert("Du måste skriva något!");
  } else {
    toDoList.push(new Item(userInput, false));
    addToDoStorage(toDoList);
  }
  document.getElementById("userInput").value = "";
}

// Create close button
function createCloseBtn(li) {
  if (li.classList.contains("close") === false) {
    const span = document.createElement("span");
    const txt = document.createTextNode("\u00D7");
    span.className = "close";
    span.appendChild(txt);
    li.appendChild(span);
    span.addEventListener("click", removeItem);
  }
}

// Remove item
function removeItem(event) {
  event.stopPropagation();
  const rm = event.currentTarget.parentElement;
  const valueToRemove = rm.textContent.slice(0, -1);

  const indexTodoList = toDoList.findIndex(
    (item) => item.itemName === valueToRemove,
  );
  if (indexTodoList !== -1) {
    toDoList.splice(indexTodoList, 1);
    addToDoStorage(toDoList);
  }

  const indexDoneList = doneList.findIndex(
    (item) => item.itemName === valueToRemove,
  );
  if (indexDoneList !== -1) {
    doneList.splice(indexDoneList, 1);
    addDoneStorage(doneList);
  }

  rm.remove();
}

function moveItem(i) {
  doneList.push(toDoList[i]);
  toDoList[i].done = true;
  toDoList.splice(i, 1);
  addDoneStorage(doneList);
  addToDoStorage(toDoList);
}

function showDoneItems() {
  done.innerHTML = "";
  for (let i = 0; i < doneList.length; i++) {
    const li = document.createElement("li");
    li.innerHTML = doneList[i].itemName;
    done.appendChild(li);
    createCloseBtn(li);
    li.setAttribute("style", "text-decoration: line-through;");
    li.addEventListener("click", () => {
      putItemBack(i);
      updateSort();
    });
  }
}
// Ta bort punkt och flytta till to-do listan
function putItemBack(i) {
  toDoList.push(doneList[i]);
  doneList[i].done = false;
  doneList.splice(i, 1);
  addToDoStorage(toDoList);
  addDoneStorage(doneList);
}

function updateSort() {
  const sortChoice = localStorage.getItem("sortChoice") || option[0].value;
  select.value = sortChoice;
  sortList(sortChoice);
}

function sortList(value) {
  if (value === option[1].value) {
    toDoList.sort(
      (a, b) => a.itemName.toLowerCase() > b.itemName.toLowerCase(),
    );
  } else if (value === option[2].value) {
    toDoList.sort(
      (a, b) => a.itemName.toLowerCase() < b.itemName.toLowerCase(),
    );
  }
  showToDoList();
}

function addToDoStorage(todos) {
  localStorage.setItem("todos", JSON.stringify(todos));
  showToDoList();
}

function addDoneStorage(done) {
  localStorage.setItem("done", JSON.stringify(done));
  showDoneItems();
}

function getFromToDoStorage() {
  const items = localStorage.getItem("todos");
  if (items) {
    toDoList = JSON.parse(items);
  }
}

function getFromDoneStorage() {
  const items = localStorage.getItem("done");
  if (items) {
    doneList = JSON.parse(items);
  }
}
