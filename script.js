// ---------- GLOBAL VARIABLES DECLARATION ----------
// global array to store the data entry elements
var data = [];

// used to temporarily store the data of one sleep cycle entry
var tempData = [];

// this code block runs when the webpage window loads in the browser
// acts kind of starting point for the program execution
window.onload = function () {

    if (localStorage.getItem("sleepdata") == null) {
        localStorage.setItem("sleepdata", JSON.stringify(data))
    }
    else {
        data = JSON.parse(localStorage.getItem("sleepdata"));
        displaySleepData();
    }
}

// displays the sleep data on to the webpage
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

// adds sleep data instane to the front end and localStorage
function addEntry() {
    // resetting the temporary data array
    tempData = [];

    // get the sleep data values
    var sleepStartDate = document.querySelector("#sleep-start-date").value;
    var sleepStartTime = document.querySelector("#sleep-start-time").value;
    var sleepEndDate = document.querySelector("#sleep-end-date").value;
    var sleepEndTime = document.querySelector("#sleep-end-time").value;

    // collecting the data input values into a temp array
    tempData = [sleepStartDate, sleepStartTime, sleepEndDate, sleepEndTime];

    // basic data validation to check if any input is missing
    if(tempData.includes("")){
        alert("Please enter dates and times of sleep start and end");
    }
    else if (isDuplicateEntry()){
        alert("Sleep data already present.\nPlease update your sleep data to make an new entry");
    }
    else {
        // pushing the temp data into main data
        data.push(tempData);

        // data array is sorted in chronological order 
        data.sort();

        // pushing the main data into local storage
        localStorage.setItem("sleepdata", JSON.stringify(data));
        
        // rendering the updated data
        displaySleepData();

        // displaying toast message to inform the user
        toastMessage("+ Added", "positive");
    }
}

function isDuplicateEntry(){
    var strTempData = tempData.join(",");
    console.log(strTempData);
    for(var index = 0; index < data.length; index++){
        if(strTempData == data[index].join(",")){
            return true;
        }
    }
    return false;
}

// deletes all the data entries from both front-end and back-end
function deleteAllEntries() {
    if(data.length == 0){
        alert("No entries to delete");
        return;
    }

    if(!confirm("Click OK to delete all.\nOtherwise click Cancel.")){
        return;
    }

    data = [];
    tempData = [];
    localStorage.setItem("sleepdata", JSON.stringify(data));
    displaySleepData();

    // displaying a toast message to inform the user
    toastMessage("- Deleted all entries", "negative");
}

// deletes a specific entry upon clicking delete button of the sleep data instance
function deleteEntry(event) {
    var buttonElement = event.target; // gives the button element
    var dataElement = buttonElement.parentElement; // gets the parent, which is the data entry itself
    var indexToDelete = Number.parseInt(dataElement.id); // gets the id attribute of the data element and casted to integer to be able to use it for deleting the element from the data array
    const numberOfElementsToDelete = 1
    data.splice(indexToDelete, numberOfElementsToDelete);

    localStorage.setItem("sleepdata", JSON.stringify(data));

    displaySleepData();

    // displaying a toast message to inform the user
    toastMessage("- Deleted", "negative");
}

// this function displays a toast message with the message string colored according to the emotion of the message
function toastMessage(messageString, emotion = "neutral"){
    var color;
    var backgroundColor;

    if(emotion == "positive"){
        color = "green";
        backgroundColor = "lightgreen";
    }
    else if (emotion == "negative"){
        color = "red";
        backgroundColor = "rgba(255, 0, 0, 0.3)";
    }
    else{
        // neutral emotion
        color = "rgb(128, 128, 0)"; // dark yellow
        backgroundColor = "rgb(255, 255, 111)"; // light yellow
    }

    var toastMessageElement = document.getElementById("toast-message");
    toastMessageElement.innerText = messageString;
    toastMessageElement.style.backgroundColor = backgroundColor;
    toastMessageElement.style.color = color;

    toastMessageElement.classList.toggle("hidden-message");
    
    window.setTimeout(function(){
        toastMessageElement.classList.toggle("hidden-message");
    }, 1000);
}

// exports the sleep data into csv format
function exportToCSV(){
    seriesDateTimes = getSeriesDateTimes(); 
    
    if(seriesDateTimes.includes("")){
        alert("Please enter date and time values for series start and end");
        return;
    }
    
    var seriesStartDateTime = seriesDateTimes[0] + " " + seriesDateTimes[1] + ":00";
    var seriesEndDateTime = seriesDateTimes[2] + " " + seriesDateTimes[3] + ":00";

    let csvContent = "data:text/csv;charset=utf-8,";

    var columns = ["sleep.start", "sleep.end", "sleep.id","series.start.datetime", "series.stop.datetime"];
    
    // adding column names to csvContent
    csvContent = csvContent + columns.join(",") + "\r\n";

    for(var id = 0; id < data.length; id++){
        var sleepId = id + 1;
        data[id][1] += ":00";
        data[id][3] += ":00";
        var strSleepInstance = data[id][0] + " " + data[id][1] + "," + data[id][2] + " " + data[id][3] + "," + sleepId + "," + seriesStartDateTime + "," + seriesEndDateTime;

        csvContent = csvContent + strSleepInstance + "\r\n";
    }

    var encodedUri = encodeURI(csvContent);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "sleep_data.csv");
    // document.body.appendChild(link);
    link.click();
}

function getSeriesDateTimes(){
    var seriesStartDate = document.getElementById("series-start-date").value;
    var seriesStartTime = document.getElementById("series-start-time").value;
    var seriesEndDate = document.getElementById("series-end-date").value;
    var seriesEndTime = document.getElementById("series-end-time").value;
    
    return [seriesStartDate, seriesStartTime, seriesEndDate, seriesEndTime];
}