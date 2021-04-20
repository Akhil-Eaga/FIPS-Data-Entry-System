// global array to store the data entry elements
var data = [];

// used to temporarily store the data of one sleep cycle entry
var tempData = []

window.onload = function(){

    if(localStorage.getItem("sleepdata") == null){
        localStorage.setItem("sleepdata", JSON.stringify(data))
    }
    else{
        data = JSON.parse(localStorage.getItem("sleepdata"));
        displaySleepData();
    }
}

function displaySleepData(){
    // var tempArray = JSON.parse(localStorage.getItem("sleepdata"));
    // display the tempArray in the div

    var displayArea = document.querySelector(".display");

    // reset the existing innerHTML to empty string
    displayArea.innerHTML = "";
    
    // rendering the entire data
    for(var i = 0; i < data.length; i++){
        var displayString = "";
        for(var j = 0; j < data[i].length; j++){
            displayString += data[i][j] + "&nbsp;&nbsp;&nbsp;";
        }
        displayArea.innerHTML += '<div class = "data-instance">' + displayString + "</div>";
    }
}

// adds data entry to the data array
function addEntry(){
    // resetting the temporary data array
    tempData = [];
    
    // get the sleep data values
    var sleepStartDate = document.querySelector("#sleep-start-date").value;
    var sleepStartTime = document.querySelector("#sleep-start-time").value;
    var sleepEndDate = document.querySelector("#sleep-end-date").value;
    var sleepEndTime = document.querySelector("#sleep-end-time").value;

    // basic data validation
    if(sleepStartDate == "" || sleepStartTime == "" || sleepEndDate == "" || sleepEndTime == ""){
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
        // pushing the main data into local storage
        localStorage.setItem("sleepdata", JSON.stringify(data));
        // render the entire data again
        // entire data is being rendered because later on sorting will be done
        displaySleepData();
    }
}

function deleteAll(){
    data = [];
    tempData = [];
    localStorage.setItem("sleepdata", data);
    displaySleepData();
}

