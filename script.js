// ---------- GLOBAL VARIABLES DECLARATION ----------

// global array to store the data entry elements
var data = [];
// used to temporarily store the data of one sleep cycle entry
var tempData = [];
// lower threshold for sleep duration (in hrs) below which a warning will be shown to the user (the threshold value is not included)
const lowerThresholdSleepDuration = 1;
// upper threshold for sleep duration (in hrs) above which a warning will be shown to the user (the threshold value is not included)
const upperThresholdSleepDuration = 12;
// -------------------------------------------------

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

// displays the sleep data on to the webpage in a tabular format
function displaySleepData() {
    var displayArea = document.querySelector(".display");

    // reset the existing innerHTML to empty string
    displayArea.innerHTML = "";

    var rowEnd = "</tr>";
    var dataStart = "<td>";
    var dataEnd = "</td>";

    var displayString = "";
    var deleteButtonString = '<button class = "delete-entry-button" onclick = "deleteEntry(event)" title = "Deletes this entry from the table."><i class = "ion-trash-a"></i> Delete</button>'
    // rendering the entire data
    for (var i = 0; i < data.length; i++) {
        var rowData = "<td>" + (i + 1) + "</td>";
        for (var j = 0; j < data[i].length; j++) {
            rowData = rowData + dataStart + data[i][j] + dataEnd;
        }
        var row = "<tr class = 'data-instance' id = '" + i + "'>" + rowData + dataStart + deleteButtonString + dataEnd + rowEnd;
        displayString = displayString + row;
    }

    var tableHeader = "<tr><th>S.No</th><th>Sleep Start Date</th> <th>Sleep Start Time</th> <th>Sleep End Date</th> <th>Sleep End Time</th> <th>Actions</th></tr>"
    displayArea.innerHTML = "<table>" + tableHeader + displayString + "</table>";
}

// adds sleep data instane to the front end and localStorage
function addEntry(sleepStartDate, sleepStartTime, sleepEndDate, sleepEndTime) {
    // resetting the temporary data array
    tempData = [];

    // get the sleep data values
    if (typeof (sleepStartDate) === "undefined") {
        // means arguments are not passed to the function
        // so grab them from the date and time fields
        // addEntry function with input values is used by the copyTheLastEntryToNextDay() function
        var sleepStartDate = document.querySelector("#sleep-start-date").value;
        var sleepStartTime = document.querySelector("#sleep-start-time").value;
        var sleepEndDate = document.querySelector("#sleep-end-date").value;
        var sleepEndTime = document.querySelector("#sleep-end-time").value;
    }

    // collecting the data input values into a temp array
    tempData = [sleepStartDate, sleepStartTime, sleepEndDate, sleepEndTime];

    // basic data validation to check if any input is missing
    if (tempData.includes("")) {
        alert("Start and end date and time fields cannot be empty.");
        // toastMessage("Start and end date and time fields cannot be empty.", "negative")
        return;
    }

    // checks if the sleep instance is already present in the database
    if (isDuplicateEntry()) {
        alert("Sleep data already present.\nPlease update your sleep data to make a new entry.");
        // toastMessage("Sleep data already present. Please update your sleep data to make a new entry.", "negative")
        return;
    }

    // checks for validity of sleep start and end date-time
    if (!isEndAfterStart(sleepStartDate, sleepStartTime, sleepEndDate, sleepEndTime)) {
        alert("Start time cannot be after or equal to end time.\nPlease modify the input.");
        return;
    }

    // checks for overlapping sleep durations
    var overlappingWith = isOverlappingWithOther(sleepStartDate, sleepStartTime, sleepEndDate, sleepEndTime);
    if (overlappingWith != -1) {
        // alert("Overlapping sleep duration detected.\nPlease update your sleep data to make a new entry.");

        // added to convert 0 based index to 1 based serial number in the tables
        toastMessage("Overlapping with entry " + (overlappingWith + 1), "negative");
        return;
    }

    // checks for abnormal sleep durations
    var status = isAbnormalSleepDuration(sleepStartDate, sleepStartTime, sleepEndDate, sleepEndTime);
    if (status != 0) {
        var message = (status == 1) ? "Abnormally long duration detected." : "Abnormally short duration detected.";
        message = message + " Do you wish to add this ?";
        // asking the user for confirmation before adding abnormal durations
        if (!confirm(message)) {
            return;
        }
    }

    //--------------------------------------------------------------------
    // program execution reaches here only when all the above checks are passed
    //--------------------------------------------------------------------

    // pushing the temp data array into main data array
    data.push(tempData);

    // data array is sorted in chronological order 
    data.sort();

    // pushing the main data into local storage which has the key name set to "sleepdata"
    localStorage.setItem("sleepdata", JSON.stringify(data));

    // rendering the updated data on the browser in a tabular format
    displaySleepData();

    // displaying toast message to inform the user that addition of entry is successful
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

    // updating the prepopulated date fields upon deletion
    prepopulateDateFields();
}

// deletes a specific entry upon clicking delete button of the sleep data instance
function deleteEntry(event) {
    var buttonElement = event.target; // gives the button element
    var dataElement = buttonElement.parentElement.parentElement; // gets the parent, which is the data entry itself
    // gets the id attribute of the data element and cast to integer to use it for deleting the element from array
    var indexToDelete = Number.parseInt(dataElement.id);
    const numberOfElementsToDelete = 1
    data.splice(indexToDelete, numberOfElementsToDelete);

    localStorage.setItem("sleepdata", JSON.stringify(data));

    displaySleepData();

    // displaying a toast message to inform the user
    toastMessage("- Deleted", "negative");

    // updating the prepopulated date fields upon deletion
    prepopulateDateFields();
}

// displays a toast message with the message string colored according to the emotion of the message
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
    toastMessageElement.innerHTML = messageString;
    toastMessageElement.style.backgroundColor = backgroundColor;
    toastMessageElement.style.color = color;

    toastMessageElement.classList.toggle("hidden-message");

    window.setTimeout(function () {
        toastMessageElement.classList.toggle("hidden-message");
    }, 2000);
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

// checks if the series start time is before or equal to the first sleep start date and time
// checks if the series end time is before or equal to the last sleep end date and time
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
// the lower and upper thresholds to determine abnormally long and short are in the global variables section at the very top
// adjust those values to change the thresholds for abnormal long and short sleep durations
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

// checks if the input parameter sleep duration is overlapping with any existing data
// performs the check in 5 parts
// part 1: checks if any data is already present or not to avoid trivial error cases
// part 2: checks if the lower bound of input duration is falling in between any of the existing sleep ranges
// part 3: checks if the upper bound of input duration is falling in between any of the existing sleep ranges
// part 4: checks if the input ranges overlaps any particular sleep instance entirely
// part 5: checks if both the input duration lower bounds and upper bounds are less than any existing instance start time
// last part avoid unnecessary looping and performs early stopping
// returns -1 to signify no overlap or
// returns index value of the instance that the input sleep duration overlaps with
function isOverlappingWithOther(sleepStartDate, sleepStartTime, sleepEndDate, sleepEndTime) {
    // -1 means not overlapping and also helps in resetting the variable value with each function call
    var overlappingWith = -1;

    if (data.length == 0) {
        // no overlap possible
        return overlappingWith;
    }

    // start and end times of the input instance
    var startTime = timeInSeconds(sleepStartDate, sleepStartTime);
    var endTime = timeInSeconds(sleepEndDate, sleepEndTime);

    for (var i = 0; i < data.length; i++) {
        var instanceStartTime = timeInSeconds(data[i][0], data[i][1]);
        var instanceEndTime = timeInSeconds(data[i][2], data[i][3]);

        // checking if the input start and end are before a particular instance start time to stop early
        if (startTime < instanceStartTime && endTime < instanceStartTime) {
            // there is no need to loop further to check for overlaps
            break;
        }

        // the following 3 conditions can be written in one combined condition
        // but is written this way to enhance code readability

        // condition 1: if startTime is in between the instanceStartTime and instanceEndTime
        if (instanceStartTime <= startTime && startTime <= instanceEndTime) {
            // means the starting time of input parameters is overlapping with ith index sleep instance
            overlappingWith = i;
            break;
        }
        // condition 2: if endTime is in between the instanceStartTime and instanceEndTime
        if (instanceStartTime <= endTime && endTime <= instanceEndTime) {
            // means the ending time of input parameters is overlapping with ith index sleep instance
            overlappingWith = i;
            break;
        }
        // condition 3: if startTime is less than instanceStartTime and endTime is greater than instanceEndTime
        if (startTime <= instanceStartTime && instanceEndTime <= endTime) {
            // means the ith index sleep instance is a subduration of the input parameter
            overlappingWith = i;
            break;
        }
    }

    // highlighting the overlapped entry so the user can quickly find where the overlapped element is
    if (overlappingWith != -1) {
        highlightOverlappedEntry(overlappingWith);
    }

    // returning the final value of overlappingWith variable to the function in addEntry method
    return overlappingWith;
}

// prepopulates the sleep start and end date and time fields to the next day of the last sleep instance
// if no data is available then the date fields are initialized to today and tomorrow
// if some data is available then the sleep start is set to last sleep end date and sleep end is set to sleep start plus one day
// upon deletion of a single entry this function to called to update the date fields if required
// upon deletion all entries again this function is called
// this method is also called upon window load to prefill the date fields according to the aforementioned scenarios
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
        date = (date < 10 ? "0" + date : date);

        // the conditional in month is just adding a 0 if month is single digit. so june which is 6 get converted to 06
        var newEndDateInRequiredFormat = year + "-" + month + "-" + date;

        // prepopulating the sleep start date to the last sleep end date in the database
        sleepStartDateField.value = lastSleepEndDate;
        sleepEndDateField.value = newEndDateInRequiredFormat;

        sleepStartTimeField.value = "";
        sleepEndTimeField.value = "";
    }
}

// this function highlights the overlapped instance for few seconds to help the user quickly find the overlapping instance
function highlightOverlappedEntry(index) {
    // input parameter "index" is the index of the overlapped instance in the data array
    // adding one will give the serial number in the table
    // adding one more will give the row in the table because heading is counted as one row
    rowNumber = index + 2;

    var row = document.querySelector("tr:nth-child(" + rowNumber.toString() + ")");
    // toggling on the css class to highlight the row
    row.classList.toggle("highlight-table-row");

    // setting an timeout to toggle off the css class to bring back the normal styling
    window.setTimeout(function () {
        row.classList.toggle("highlight-table-row");
    }, 5000);
}

// this function takes the last sleep data and adds 24 hrs to it and then adds the entry to the database table
function copyTheLastEntryToNextDay() {

    if (data.length == 0) {
        toastMessage("Please add atleast one entry to use this functionality", "negative");
        return;
    }

    //grab the sleep start date and time inputs
    var lastSleepStartDate = data[data.length - 1][0];
    var lastSleepStartTime = data[data.length - 1][1];

    var lastSleepEndDate = data[data.length - 1][2];
    var lastSleepEndTime = data[data.length - 1][3];

    var newSleepStartDate = addOneDay(lastSleepStartDate, lastSleepStartTime);
    var newSleepStartTime = lastSleepStartTime;

    var newSleepEndDate = addOneDay(lastSleepEndDate, lastSleepEndTime);
    var newSleepEndTime = lastSleepEndTime;

    // calling the addEntry function with the above values are arguments
    addEntry(newSleepStartDate, newSleepStartTime, newSleepEndDate, newSleepEndTime);

    prepopulateDateFields();
}

// takes inputs as date and time, and returns the next day of the input date
function addOneDay(date, time) {
    var secondsInOneDay = 86400;
    // converting the last sleep end date plus one more day to be prepopulate the next sleep start date
    var dateInSeconds = timeInSeconds(date, time);
    var nextDateInMilliSeconds = (dateInSeconds + secondsInOneDay) * 1000;
    var nextFullDate = new Date(nextDateInMilliSeconds);

    // extracting year, month and 
    var year = nextFullDate.getFullYear();
    var month = nextFullDate.getMonth() + 1;
    month = (month < 10 ? "0" + month : month);
    var date = nextFullDate.getDate();
    date = (date < 10 ? "0" + date : date);

    var result = year + "-" + month + "-" + date;
    return result;
}

function toggleOverlay() {
    document.querySelector(".modal-container").classList.toggle("hide-overlay");
    document.body.classList.toggle("hide-scroll");
}

