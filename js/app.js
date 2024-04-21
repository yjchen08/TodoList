let section = document.querySelector("section");
let addItem = document.querySelector("form .addBtn");
addItem.addEventListener("click", (e) => {
  // get the input values
  let form = e.target.parentElement;
  let todoText = form.children[0].value;
  let todoMonth = form.children[1].value;
  let todoDate = form.children[2].value;

  if (todoText === "") {
    alert("Please Enter some Text.");
    return;
  }

  if (todoMonth === "" || todoDate === "") {
    alert("Please Enter the Date.");
    return;
  }

  createTodo(todoText, todoMonth, todoDate, false);

  // 添加完todo, clear the input
  form.children[0].value = "";
  form.children[1].value = "";
  form.children[2].value = "";

  // Create an object
  let myTodo = {
    todoText: todoText,
    todoMonth: todoMonth,
    todoDate: todoDate,
    todoDone: false,
  };
  // store data into an array of objects
  let myList = localStorage.getItem("list");
  if (myList == null) {
    localStorage.setItem("list", JSON.stringify([myTodo]));
  } else {
    let myListArray = JSON.parse(myList);
    myListArray.push(myTodo);
    localStorage.setItem("list", JSON.stringify(myListArray));
  }
});

function createTodo(todoText, todoMonth, todoDate, todoDone) {
  // create a todo
  let todo = document.createElement("div");
  todo.classList.add("list");

  let check = document.createElement("input");
  check.setAttribute("type", "checkbox");
  check.classList.add("checkBtn");
  check.addEventListener("click", () => {
    text.classList.toggle("done");

    // 若Todo為done, todoDone = true
    let myList = localStorage.getItem("list");
    let myListArray = JSON.parse(myList);
    if (check.checked) {
      myListArray.forEach((item) => {
        if (text.innerText == item.todoText) {
          item.todoDone = true;
          localStorage.setItem("list", JSON.stringify(myListArray));
        }
      });
    } else {
      myListArray.forEach((item) => {
        if (text.innerText == item.todoText) {
          item.todoDone = false;
          localStorage.setItem("list", JSON.stringify(myListArray));
        }
      });
    }
  });

  let text = document.createElement("p");
  text.classList.add("text");
  text.innerText = todoText;
  // 載入時,todoDone為true,將該todo加上class "done",並把checked設為true
  if (todoDone) {
    text.classList.add("done");
    check.setAttribute("checked", true);
  }

  let time = document.createElement("p");
  time.classList.add("time");
  time.innerText = todoMonth + " / " + todoDate;

  let delBtn = document.createElement("span");
  delBtn.classList.add("material-symbols-outlined");
  delBtn.textContent = " close ";
  delBtn.addEventListener("click", (e) => {
    let todoItem = e.target.parentElement;
    // animation結束時, remove the todoItem
    todoItem.addEventListener("animationend", () => {
      // remove the todo item from localStorage
      let text = todoItem.children[1].innerText;
      let myListArray = JSON.parse(localStorage.getItem("list"));
      myListArray.forEach((item, i) => {
        if (item.todoText == text) {
          myListArray.splice(i, 1);
          localStorage.setItem("list", JSON.stringify(myListArray));
        }
      });

      todoItem.remove();
    });
    // 移除todo時的animation
    todoItem.style.animation = "scaleDown 0.5s forwards";
  });

  // 添加todo時的animation
  todo.style.animation = "scaleUp 0.5s forwards";

  todo.appendChild(check);
  todo.appendChild(text);
  todo.appendChild(time);
  todo.appendChild(delBtn);
  section.appendChild(todo);
}

loadData();
function loadData() {
  // 載入時,把localStorage的list在頁面重新create
  let myList = localStorage.getItem("list");
  if (myList !== null) {
    let myListArray = JSON.parse(myList);
    myListArray.forEach((item) => {
      createTodo(item.todoText, item.todoMonth, item.todoDate, item.todoDone);
    });
  }
}

// merge sort
function mergeTime(arr1, arr2) {
  let result = [];
  let i = 0;
  let j = 0;

  while (i < arr1.length && j < arr2.length) {
    if (Number(arr1[i].todoMonth) > Number(arr2[j].todoMonth)) {
      result.push(arr2[j]);
      j++;
    } else if (Number(arr1[i].todoMonth) < Number(arr2[j].todoMonth)) {
      result.push(arr1[i]);
      i++;
    } else if (Number(arr1[i].todoMonth) == Number(arr2[j].todoMonth)) {
      if (Number(arr1[i].todoDate) > Number(arr2[j].todoDate)) {
        result.push(arr2[j]);
        j++;
      } else {
        result.push(arr1[i]);
        i++;
      }
    }
  }

  while (i < arr1.length) {
    result.push(arr1[i]);
    i++;
  }

  while (j < arr2.length) {
    result.push(arr2[j]);
    j++;
  }

  return result;
}

function mergeSort(arr) {
  if (arr.length === 1) {
    return arr;
  } else {
    let middle = Math.floor(arr.length / 2);
    let left = arr.slice(0, middle);
    let right = arr.slice(middle, arr.length);
    return mergeTime(mergeSort(left), mergeSort(right));
  }
}

// sort the todo item by time
let sortBtn = document.querySelector("div.sort button");
sortBtn.addEventListener("click", () => {
  // sort data
  let sortedArray = mergeSort(JSON.parse(localStorage.getItem("list")));
  localStorage.setItem("list", JSON.stringify(sortedArray));

  // remove data
  let len = section.children.length;
  for (let i = 0; i < len; i++) {
    section.children[0].remove();
  }

  // load data
  loadData();
});
