//global variable and load the data.
let toDoList;
const localStorageKey = "storage";
let counter = 1;
initData();

function initData() { // initiate the data from local storage.
    if (localStorage.getItem(localStorageKey) === null)
        toDoList = [];
    else
        toDoList = JSON.parse(localStorage.getItem(localStorageKey));

    createDiv();
}

function saveSticky() { // take the note that i made and save it in the Local storage
    let note = getNoteObj();
    extractNoteFromUI(note);
}

function getNoteObj() { // making note 
    let noteText = document.getElementById("stickyText").value;
    let noteDate = document.getElementById("stickyDate").value;
    let noteTime = document.getElementById("stickyTime").value;
    let note = {
        noteText: noteText,
        noteDate: noteDate,
        noteTime: noteTime
    };
    return note;
}

function extractNoteFromUI(note) { // taking the date from the user and doing validation check on them
    let problem = false;
    try {
        validation(note);
    }
    catch (e) {
        problem = true;
        failedData(e)
    }

    if (!problem) {
        saveStickyInLocal(note);
        let curr = toDoList[toDoList.length - 1]
        createMemo("memoNum" + counter, curr.noteText, curr.noteDate, curr.noteTime, toDoList.length - 1);
        counter++;
        resetData()
    }
}

function validation(note) { //checking if there is any problem with the data that the user insert
    let text = note.noteText;
    let date = note.noteDate;

    if (text.trim() == "" && date == "") {
        document.getElementById("stickyText").style.borderColor = "red";
        document.getElementById("stickyDate").style.borderColor = "red";
        throw new Error("Empty Inputs");
    }

    if (text.trim() == "") {
        document.getElementById("stickyText").style.borderColor = "red";
        throw new Error("Empty Text");
    }

    if (date == "") {
        document.getElementById("stickyDate").style.borderColor = "red";
        throw new Error("Empty Date")
    }

    let now = new Date();
    now.setHours(0, 0, 0, 0);
    if (Date.parse(date) < now) {
        document.getElementById("stickyDate").style.borderColor = "red";
        throw new Error("Selected date is in the past");
    }
}

function failedData(e) {
    console.error(e);
}

function resetData() {// reseting the data in the page
    document.getElementById("stickyText").value = "";
    document.getElementById("stickyDate").value = "";
    document.getElementById("stickyTime").value = "";
    document.getElementById("stickyDate").style.borderColor = "";
    document.getElementById("stickyText").style.borderColor = "";
}

function saveStickyInLocal(note) { // save the sticky note in the LocalStorage
    toDoList.push(note);
    localStorage.setItem(localStorageKey, JSON.stringify(toDoList));
}

function clearPage() { // delete all memo from storage and from page
    removeAllNotes()
    toDoList = [];
    localStorage.removeItem(localStorageKey);
}
function createDiv() { // creating the new memo in local storage
    removeAllNotes();
    for (let i = 0; i < toDoList.length; i++) {
        let curr = toDoList[i]
        createMemo("memoNum" + counter, curr.noteText, curr.noteDate, curr.noteTime, i)
        counter++;
    }
}

function createMemo(id, text, date, time, index) { // creating new memo 
    let memo = document.createElement('div');
    let deleteButton = "<button class='btn' onclick= " + "removeNote(" + index + ")" + " >  <i class='fas fa-times-circle'></i></button>";
    let parClass = "<br><p class = 'overflow-auto'>"
    memo.id = id
    memo.className = 'col-sm-2'
    if (time == "") {
        memo.innerHTML = deleteButton + parClass + text + "</p>" + "<br><p class='date'> Date : " + date + "</p>"

    } else {
        memo.innerHTML = deleteButton + parClass + text + "</p>" + "<br><p class = 'date'> Date : " + date + "<br> Time:" + time + "</p>"
    };

    document.getElementById("row1").appendChild(memo);

}

function removeAllNotes() { // remove all notes from storage
    counter = 1;
    let toRemove = document.getElementsByClassName("col-sm-2");
    for (let i = toRemove.length - 1; i >= 0; i--) {
        let index = i + 1;
        deleteMemo("memoNum" + index);
    }
}
function removeNote(i) { // remove note from local storage
    toDoList.splice(i, 1);
    localStorage.setItem(localStorageKey, JSON.stringify(toDoList));
    let index = i + 1;
    deleteMemo("memoNum" + index);
}

function deleteMemo(id) { // I did one fade-in in javascript and one in css because I wanted to see how it works both way
    let memoToDelete = document.getElementById(id);
    memoToDelete.style.opacity = "0";
    setTimeout(function () {
        memoToDelete.parentNode.removeChild(memoToDelete);
    }, 1000)
    counter--;

}