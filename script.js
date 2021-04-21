// ----- LIST OF FEATURES TO IMPLEMENT -----
// 1) Prepopulate the values in the date and time 
// 2) Add ability to update a specific entry
// 3) Add ability to download the data as CSV
// 4) Add duplicate checking to avoid fat finger errors
// 4.1) Alert users on overlappping sleep durations
// 5) Check for start times that are later than the end times 
// 6) Add data validation to the series start and series end dates and times
// 7) Sort the data instances according to the start date and then display them



// global array to store the data entry elements
var data = [];

// used to temporarily store the data of one sleep cycle entry
var tempData = []

window.onload = function () {

    if (localStorage.getItem("sleepdata") == null) {
        localStorage.setItem("sleepdata", JSON.stringify(data))
    }
    else {
        data = JSON.parse(localStorage.getItem("sleepdata"));
        displaySleepData();
    }
}

function displaySleepData() {
    // var tempArray = JSON.parse(localStorage.getItem("sleepdata"));
    // display the tempArray in the div

    var displayArea = document.querySelector(".display");

    // reset the existing innerHTML to empty string
    displayArea.innerHTML = "";

    // rendering the entire data
    for (var i = 0; i < data.length; i++) {
        var displayString = "";
        var deleteButtonString = '<button class = "delete-entry-button" onclick = "deleteEntry(event)"><i class = "ion-trash-a"></i></button>'
        for (var j = 0; j < data[i].length; j++) {
            displayString += data[i][j] + "&nbsp;&nbsp;&nbsp;";
        }
        displayArea.innerHTML += '<div class = "data-instance" id = "' + i + '">' + displayString + deleteButtonString + "</div> <br>";
    }
}

// adds data entry to the data array
// NEEDS TO CALL A SORTING FUNCTION AFTER INSERTING THE DATA AND THEN CALL THE DISPLAY FUNCTION
// PREPOPULATE THE VALUES IN THE DATE TIME FIELDS AFTER ADDING ONE ENTRY
function addEntry() {
    // resetting the temporary data array
    tempData = [];

    // get the sleep data values
    var sleepStartDate = document.querySelector("#sleep-start-date").value;
    var sleepStartTime = document.querySelector("#sleep-start-time").value;
    var sleepEndDate = document.querySelector("#sleep-end-date").value;
    var sleepEndTime = document.querySelector("#sleep-end-time").value;

    // basic data validation
    if (sleepStartDate == "" || sleepStartTime == "" || sleepEndDate == "" || sleepEndTime == "") {
        alert("Please enter sleep data to add an entry");
    }
    else {
        // collecting the data input values into a temp array
        tempData.push(sleepStartDate);
        tempData.push(sleepStartTime);
        tempData.push(sleepEndDate);
        tempData.push(sleepEndTime);
        // pushing the temp data into main data
        data.push(tempData);

        // data array is sorted in chronological order 
        data.sort();

        // this reverses the order of values to reverse chronological order
        // data.reverse();

        // pushing the main data into local storage
        localStorage.setItem("sleepdata", JSON.stringify(data));
        // render the entire data again
        // entire data is being rendered because later on sorting will be done
        displaySleepData();
    }
}

// deletes all the data entries in the program storage (i.e., the data array) and also in the browser localStorage including the temp array in the program storage
function deleteAllEntries() {
    data = [];
    tempData = [];
    localStorage.setItem("sleepdata", JSON.stringify(data));
    displaySleepData();
}


function deleteEntry(event) {
    var buttonElement = event.target; // gives the button element
    var dataElement = buttonElement.parentElement; // gets the parent, which is the data entry itself
    var indexToDelete = Number.parseInt(dataElement.id); // gets the id attribute of the data element and casted to integer to be able to use it for deleting the element from the data array
    const numberOfElementsToDelete = 1
    data.splice(indexToDelete, numberOfElementsToDelete);

    localStorage.setItem("sleepdata", JSON.stringify(data));

    displaySleepData();

}
