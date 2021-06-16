// ---------- BROWSER DETECTION -----------
// detects if the page is loaded on firefox
// var isFirefox = typeof InstallTrigger !== 'undefined';

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

    // detecting Mozilla Firefox browser and alerting the user to use Google Chrome
    setTimeout(function () {
        // isFirefox hold a boolean value true if the FIPS webpage is opened on Mozilla Firefox
        var isFirefox = typeof InstallTrigger !== 'undefined';
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

    // auto filling the date fields upon page load
    prepopulateDateFields();
}

// old version of the display method -new version is now implemented
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


// NEW VERSION - COMPLETE - displays the sleep data on to the webpage
function displaySleepData() {
    var displayArea = document.querySelector(".display");

    // reset the existing innerHTML to empty string
    displayArea.innerHTML = "";

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

    // console.log("String is ", displayString);
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
    // program execution reaches here only when all the above checks are passed
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

    // prepopulate the input date and time fields to the next day
    prepopulateDateFields();
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
    var dataElement = buttonElement.parentElement.parentElement; // gets the parent, which is the data entry itself
    console.log(dataElement);
    // gets the id attribute of the data element and cast to integer to use it for deleting the element from array
    var indexToDelete = Number.parseInt(dataElement.id);
    console.log("Index to delete: ", indexToDelete);
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
        color = "rgb(109,174,65)"; // dark green
        backgroundColor = "rgba(109,174,65, 0.2)";
    }
    else if (emotion == "negative") {
        color = "rgb(209,99,56)"; // dark red
        backgroundColor = "rgba(209,99,56, 0.2)"; // light red
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

// check if the series start time is before or equal to the first sleep start date and time
// check if the series end time is before or equal to the last sleep end date and time
// the difference in this method  is that this allows the first sleep date and time to be exactly equal to the series start date and time
// and also it allows the last sleep date and time to be exactly equal to the series end date and time
// this is the only difference between isEndAfterStart() and isEndAfterStartForSeries() methods 
function isEndAfterStartForSeries(startDate, startTime, endDate, endTime) {
    var start = timeInSeconds(startDate, startTime);
    var end = timeInSeconds(endDate, endTime);

    // please pay attention to the equality symbol which allows the series start date time to be equal to first sleep start date time
    // and also allows the last sleep end date time and series end date time
    return end >= start;
}

// checks if the series start is before the first sleep start time
function isValidSeriesStart(seriesStartDate, seriesStartTime, firstSleepDate, firstSleepTime) {
    return isEndAfterStartForSeries(seriesStartDate, seriesStartTime, firstSleepDate, firstSleepTime);
}

// checks if the last sleep time is before the series end time
function isValidSeriesEnd(lastSleepDate, lastSleepTime, seriesEndDate, seriesEndTime) {
    return isEndAfterStartForSeries(lastSleepDate, lastSleepTime, seriesEndDate, seriesEndTime);
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
    // since Date() returns the time in millseconds, the value is divided by 1000 to convert time to seconds
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

// prepopulates the sleep start and end date and time fields to the next day of the last sleep instance
function prepopulateDateFields() {
    //grab the sleep start date and time inputs
    var sleepStartDateField = document.querySelector("#sleep-start-date");
    var sleepEndDateField = document.querySelector("#sleep-end-date");

    var sleepStartTimeField = document.querySelector("#sleep-start-time");
    var sleepEndTimeField = document.querySelector("#sleep-end-time");

    // if there is no data in the local storage then if block will be executed otherwise else block will execute
    if (data.length == 0) {
        // this means the user is new or all the entries are deleted
        // so there is last sleep end date to use for prepopulating date fields
        // to enhance user experience the date values will be prepopulated to today and tomorrow

        // building the date for today in required format
        var today = new Date();
        var year = today.getFullYear();
        var month = today.getMonth() + 1;
        month = (month < 10 ? "0" + month : month);
        var date = today.getDate();
        var todayInRequiredFormat = year + "-" + month + "-" + date;

        // prepopulating the sleep start date to today
        sleepStartDateField.value = todayInRequiredFormat;

        // building the date for tomorrow in required format
        var todayInMilliseconds = today.getTime();
        var milliSecondsInOneDay = 24 * 60 * 60 * 1000;
        var nextDay = new Date(todayInMilliseconds + milliSecondsInOneDay);
        var year = nextDay.getFullYear();
        var month = nextDay.getMonth() + 1;
        month = (month < 10 ? "0" + month : month);
        var date = nextDay.getDate();
        var nextDayInRequiredFormat = year + "-" + month + "-" + date;

        // prepopulating the sleep start date to tomorrow
        sleepEndDateField.value = nextDayInRequiredFormat;
    }

    else {
        // we will use the sleep end date to prepopulate the next sleep start date
        // we will use the sleep end date plus one day to prepopulate the next sleep end date
        var lastSleepInstanceData = data[data.length - 1];
        var lastSleepEndDate = lastSleepInstanceData[2];
        var lastSleepEndTime = lastSleepInstanceData[3];

        // format of lastSleepInstance = [sleepStartDate, sleepStartTime, sleepEndDate, sleepEndTime];
        // format of dates = YYYY-MM-DD and format of times = HH:MM:SS  in 24hr format so no AM and PM info

        console.log("last sleep data is ", lastSleepInstanceData);

        var secondsInOneDay = 86400;
        // converting the last sleep end date plus one more day to be prepopulate the next sleep start date
        var endDateInSeconds = timeInSeconds(lastSleepEndDate, lastSleepEndTime);
        var newEndDateInMilliSeconds = (endDateInSeconds + secondsInOneDay) * 1000;
        var newEndFullDate = new Date(newEndDateInMilliSeconds);

        // extracting year, month and 
        var year = newEndFullDate.getFullYear();
        var month = newEndFullDate.getMonth() + 1;
        month = (month < 10 ? "0" + month : month);
        var date = newEndFullDate.getDate();

        // the conditional in month is just adding a 0 if month is single digit. so june which is 6 get converted to 06
        var newEndDateInRequiredFormat = year + "-" + month + "-" + date;
        console.log(newEndDateInRequiredFormat);

        // prepopulating the sleep start date to the last sleep end date in the database
        sleepStartDateField.value = lastSleepEndDate;
        sleepEndDateField.value = newEndDateInRequiredFormat;

        sleepStartTimeField.value = "";
        sleepEndTimeField.value = "";
    }
}

