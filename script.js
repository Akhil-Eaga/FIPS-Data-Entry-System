// ---------- BROWSER DETECTION -----------
var isFirefox = typeof InstallTrigger !== 'undefined';

// ---------- GLOBAL VARIABLES DECLARATION ----------

// global array to store the data entry elements
var data = [];
// used to temporarily store the data of one sleep cycle entry
var tempData = [];
// lower threshold for sleep duration (in hrs) below which a warning will be shown to the user (the threshold value is not included)
const lowerThresholdSleepDuration = 1;
// upper threshold for sleep duration (in hrs) above which a warning will be shown to the user (the threshold value is not included)
const upperThresholdSleepDuration = 12;

// this code block runs when the webpage window loads in the browser
// acts kind of starting point for the program execution
window.onload = function () {

    setTimeout(function () {
        if (isFirefox) {
            var firefoxAlert = document.querySelector(".hide-firefox-alert");
            firefoxAlert.classList.toggle("hide-firefox-alert");
        }
    }, 2000);


    if (localStorage.getItem("sleepdata") == null) {
        localStorage.setItem("sleepdata", JSON.stringify(data))
    }
    else {
        data = JSON.parse(localStorage.getItem("sleepdata"));
        displaySleepData();
    }
}

// displays the sleep data on to the webpage
// function displaySleepData() {
//     var displayArea = document.querySelector(".display");

//     // reset the existing innerHTML to empty string
//     displayArea.innerHTML = "<div class = 'data-instance'> <div>Sleep Start Date</div> <div>Sleep Start Time</div> <div>Sleep End Date</div> <div>Sleep End Time</div> <div>Actions</div> </div>";

//     // rendering the entire data
//     for (var i = 0; i < data.length; i++) {
//         var displayString = "";
//         var deleteButtonString = '<button class = "delete-entry-button" onclick = "deleteEntry(event)"><i class = "ion-trash-a"></i>Delete</button>'
//         for (var j = 0; j < data[i].length; j++) {
//             displayString += "<div>" + data[i][j] + "</div>" + "&nbsp;&nbsp;&nbsp;";
//         }
//         displayArea.innerHTML += '<div class = "data-instance" id = "' + i + '">' + displayString + deleteButtonString + "</div> <br>";
//     }
// }


// // NEW VERSION - UNDER PROGRESS - displays the sleep data on to the webpage
function displaySleepData() {
    var displayArea = document.querySelector(".display");

    // reset the existing innerHTML to empty string
    displayArea.innerHTML = "";

    var rowStart = "<tr>";
    var rowEnd = "</tr>";
    var dataStart = "<td>";
    var dataEnd = "</td>";

    var displayString = "";
    var deleteButtonString = '<button class = "delete-entry-button" onclick = "deleteEntry(event)"><i class = "ion-trash-a"></i> Delete</button>'
    // rendering the entire data
    for (var i = 0; i < data.length; i++) {
        var rowData = "";
        for (var j = 0; j < data[i].length; j++) {
            rowData = rowData + dataStart + data[i][j] + dataEnd;
        }
        var row = "<tr class = 'data-instance' id = '" + i + "'>" + rowData + dataStart + deleteButtonString + dataEnd + rowEnd;
        displayString = displayString + row;
    }

    console.log("String is ", displayString);
    var tableHeader = "<tr><th>Sleep Start Date</th> <th>Sleep Start Time</th> <th>Sleep End Date</th> <th>Sleep End Time</th> <th>Actions</th></tr>"
    displayArea.innerHTML = "<table>" + tableHeader + displayString + "</table>";
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
    if (tempData.includes("")) {
        alert("Start and end date and time fields cannot be empty.");
        return;
    }
    // checks if the sleep instance is already present in the database
    if (isDuplicateEntry()) {
        alert("Sleep data already present.\nPlease update your sleep data to make an new entry.");
        return;
    }
    // checks for validity of sleep start and end date-time
    if (!isEndAfterStart(sleepStartDate, sleepStartTime, sleepEndDate, sleepEndTime)) {
        alert("Start time cannot be after or equal to end time.\nPlease modify the input.");
        return;
    }
    // checks for abnormal sleep durations
    if (isAbnormalSleepDuration(sleepStartDate, sleepStartTime, sleepEndDate, sleepEndTime) != 0) {
        const status = isAbnormalSleepDuration(sleepStartDate, sleepStartTime, sleepEndDate, sleepEndTime);
        var message = status == 1 ? "Abnormally long duration detected." : "Abnormally short duration detected.";
        message = message + " Do you wish to add this ?";
        if (!confirm(message)) {
            return;
        }
    }

    //--------------------------------------------------------------------
    // program execution reaches here when all the above checks are passed
    //--------------------------------------------------------------------

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

// returns boolean true if the new instance is a duplicate, else returns false
function isDuplicateEntry() {
    var strTempData = tempData.join(",");
    for (var index = 0; index < data.length; index++) {
        if (strTempData == data[index].join(",")) {
            return true;
        }
    }
    return false;
}

// deletes all the data entries from both front-end and back-end
function deleteAllEntries() {
    if (data.length == 0) {
        alert("No entries to delete.");
        return;
    }

    if (!confirm("Click \"OK\" to delete all. Otherwise click \"Cancel\".")) {
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
function toastMessage(messageString, emotion = "neutral") {
    var color;
    var backgroundColor;

    if (emotion == "positive") {
        color = "green";
        backgroundColor = "lightgreen";
    }
    else if (emotion == "negative") {
        color = "red";
        backgroundColor = "rgba(255, 0, 0, 0.3)";
    }
    else {
        // neutral emotion
        color = "rgb(128, 128, 0)"; // dark yellow
        backgroundColor = "rgb(255, 255, 111)"; // light yellow
    }

    var toastMessageElement = document.getElementById("toast-message");
    toastMessageElement.innerText = messageString;
    toastMessageElement.style.backgroundColor = backgroundColor;
    toastMessageElement.style.color = color;

    toastMessageElement.classList.toggle("hidden-message");

    window.setTimeout(function () {
        toastMessageElement.classList.toggle("hidden-message");
    }, 1000);
}

// exports the sleep data into csv format
function exportToCSV() {
    seriesDateTimes = getSeriesDateTimes();
    // seriesDateTimes has the format of [seriesStartDate, seriesStartTime, seriesEndDate, seriesEndTime];

    // checking if any data is present in the store for exporting
    if (data.length == 0) {
        alert("No data to export.\nPlease add some sleep instances to use this feature");
        return; // preventing program execution ahead
    }
    // checking and preventing empty series date and time fields
    if (seriesDateTimes.includes("")) {
        alert("Please enter date and time values for series start and end");
        return; // preventing program execution ahead
    }
    // checking if series start is after series end
    if (!isEndAfterStart(seriesDateTimes[0], seriesDateTimes[1], seriesDateTimes[2], seriesDateTimes[3])) {
        alert("Series start cannot be after or equal to series end.\nPlease modify the input.");
        return;
    }
    // checking if series start is before the first sleep start
    if (!isValidSeriesStart(seriesDateTimes[0], seriesDateTimes[1], data[0][0], data[0][1])) {
        alert("Series start cannot be after or equal to the first sleep start time.\nPlease modify your series start.");
        return; // preventing export to CSV
    }
    // checking if series end is after the last sleep end
    if (!isValidSeriesEnd(data[data.length - 1][2], data[data.length - 1][3], seriesDateTimes[2], seriesDateTimes[3])) {
        alert("Series end cannot be before or equal to the last sleep end time.\nPlease modify your series end.");
        return; // preventing export to CSV
    }

    var seriesStartDateTime = seriesDateTimes[0] + " " + seriesDateTimes[1] + ":00";
    var seriesEndDateTime = seriesDateTimes[2] + " " + seriesDateTimes[3] + ":00";

    let csvContent = "data:text/csv;charset=utf-8,";

    var columns = ["sleep.start", "sleep.end", "sleep.id", "series.start.datetime", "series.stop.datetime"];

    // adding column names to csvContent
    csvContent = csvContent + columns.join(",") + "\r\n";

    for (var id = 0; id < data.length; id++) {
        var sleepId = id + 1;
        var modifiedStartTime = data[id][1] + ":00";
        var modifiedEndTime = data[id][3] + ":00";

        var strSleepInstance = data[id][0] + " " + modifiedStartTime + "," + data[id][2] + " " + modifiedEndTime + "," + sleepId + "," + seriesStartDateTime + "," + seriesEndDateTime;

        csvContent = csvContent + strSleepInstance + "\r\n";
    }

    var encodedUri = encodeURI(csvContent);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "sleep_data.csv");
    // document.body.appendChild(link);
    link.click();
}

// extracts the series start and end dates and times
function getSeriesDateTimes() {
    var seriesStartDate = document.getElementById("series-start-date").value;
    var seriesStartTime = document.getElementById("series-start-time").value;
    var seriesEndDate = document.getElementById("series-end-date").value;
    var seriesEndTime = document.getElementById("series-end-time").value;

    return [seriesStartDate, seriesStartTime, seriesEndDate, seriesEndTime];
}

// checks if the end time is after the start time or not
function isEndAfterStart(startDate, startTime, endDate, endTime) {
    var start = timeInSeconds(startDate, startTime);
    var end = timeInSeconds(endDate, endTime);

    return end > start;
}

// checks if the series start is before the first sleep start time
function isValidSeriesStart(seriesStartDate, seriesStartTime, firstSleepDate, firstSleepTime) {
    return isEndAfterStart(seriesStartDate, seriesStartTime, firstSleepDate, firstSleepTime);
}

// checks if the last sleep time is before the series end time
function isValidSeriesEnd(lastSleepDate, lastSleepTime, seriesEndDate, seriesEndTime) {
    console.log(lastSleepDate);
    console.log(lastSleepTime);
    console.log(seriesEndDate);
    console.log(seriesEndTime);
    return isEndAfterStart(lastSleepDate, lastSleepTime, seriesEndDate, seriesEndTime);
}

// returns the number of seconds elapsed since epoch till the given date and time
function timeInSeconds(date, time) {
    var dateInfo = date.split("-");
    var year = Number.parseInt(dateInfo[0]);
    var month = Number.parseInt(dateInfo[1]) - 1;
    var day = Number.parseInt(dateInfo[2]);

    var timeInfo = time.split(":");
    var hours = Number.parseInt(timeInfo[0]);
    var minutes = Number.parseInt(timeInfo[1]);
    var seconds = 0;
    var d = new Date(year, month, day, hours, minutes, seconds);
    // since Math.floor returns the time in millseconds, the value is divided by 1000
    return Math.floor(d / 1000);
}

// returns 1 for abnormally long duration, -1 for abnormally short duration and 0 for valid sleep duration
function isAbnormalSleepDuration(sleepStartDate, sleepStartTime, sleepEndDate, sleepEndTime) {
    var duration = timeInSeconds(sleepEndDate, sleepEndTime) - timeInSeconds(sleepStartDate, sleepStartTime);

    const lowerThresholdInSeconds = lowerThresholdSleepDuration * 3600;
    const upperThresholdInSeconds = upperThresholdSleepDuration * 3600;
    if (duration < lowerThresholdInSeconds) {
        return - 1; // represents abnormally short duration
    }
    else if (duration > upperThresholdInSeconds) {
        return 1; // represents abnormally long duration
    }
    else {
        return 0; // represents valid duration
    }
}

