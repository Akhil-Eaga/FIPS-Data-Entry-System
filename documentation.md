# FIPS DATA ENTRY SYSTEM DOCUMENTATION  

This documentation.md file is written to help the readers to understand the technical workings of the code files in this repository. In this document, you will learn about the importance of every file and their role in the project.  
  
-------------------------
  
## 1. index.html:  
This html file contains the structure of the web page. It uses the latest HTML5 language standards and is structured to use Bootstrap in some places and Google Fonts for all the text content.  

This html file links to the newstyles.css and the script.js files (details of the which are given in later sections).  

This project also use the Icon pack from Ionicons which is free to use for non-commercial purposes.   

This html files is internally divided in sections that are commented with their respective names.   

### Header Section:  
This section contains the main heading and the download button which converts all the input data into a CSV format file for downloading.  
  

### Firefox Alert Section:  
This section is toggled to be visible on when the project is accessed via Firefox browser which has some issues to properly render the date and time fields. This inconsistency is well known, which is why whenever a user accesses the FIPS data entry system via Firefox browser, a warning alert is shown below the main heading to warn the users about the inconsistency.  
  

### Series Start and End Date and Time Section:  
This section contains all the html code required to contain and organize the series start and end, date and time fields. They are organized into columns using css flexbox. The divs that contain the series start and end dates and times have exactly the same structure but slightly different IDs and class names (i.e., HTML ids and classes not the object oriented classes from other languages). All names were carefully chosen to make the code more readable and also well integrated in other code files (like the script.js) file.  
  
Coming to meaning of the data collected through this fields, the series start date and time represent the point in time from when user started tracking your sleep data. And similarly, series end date and time is the point in time when user stopped collecting their sleep data. Filling in these fields is not made mandatory to allow users to add some past data if they happen to be tracking it somewhere else or happen to recollect or just sourced from any other storage method. This means that the users can add data which precedes (in time) the data that is already present. By doing so they have the flexibility to enter sleep data. Hence, the series start and end date and time fields are not required to be filled in for every day data entry. They are only required when the user is satisfied with all the data that is currently stored and wants to save it in the CSV format. The data validation rules that are applied to these fields are that series start date and time can only be before (in time) or equal to the first sleep input start date and time in the system. And similarly, the series end date and time can only be equal to or after (in time) to the last sleep input end date and time. These rules will be checked for when attempting to download the data into a CSV file.  
  
  
### Sleep Data Entry Section:  
This section contains code that is responsible for the data and time fields of the sleep start and sleep end containers. Again the containers are arranged in position using CSS flexbox and the code structure pretty much represents the way the fields are organized within each parent div element. The divs that contain the sleep start and end dates and times have exactly the same structure but slightly different IDs and class names. All names were carefully chosen to make the code more readable and also well integrated in other code files (like the script.js) file. This section also contains the Add Entry button that attempts to add the input data into the system upon checking with data validation rules.  
  
Again, coming to discuss the meaning of these input fields, sleep start date and time represent the starting time of a day at which the user falls asleep and similarly, sleep end date and time represent the time of the day at which the user wakes up from that sleep. Together the sleep start and end, date and time represent one sleep session. Several data validation rules are put in place for these input fields to avoid entering faulty data that does not make sense in real scenario. Some data validation rules are strictly prohibited making it impossible to input such data and some of the data validation rules are implemented just to warn the user just in case they have not realized the potential faults their input data might be having. For example, the sleep start date and time cannot be equal to or after the sleep start date and time as they dont make sense in real life. A sleep session timings cannot overlap partially or fully with any other sleep session. A sleep session duration of less than 1 hr or more than 12 hrs is flagged as abnormally short or long durations by warning the user of the these scenarios and asking for confirmation if they really wish to proceed to add the data into the system. And again, empty values in any of the input fields is not allowed. Duplicate entries are not allowed and the users are warned accordingly of this scenario. Once all these data checks are passed and if the input data is in compliance with all of these, only then the sleep data is added into the system.  
  
Once the sleep instance is added. as a common user would want the data to be in chronological order, the data instance is inserted in the appropriate row position within the data table. A copy of the data is saved into the localStorage of the browser. Once the data is added, a toast message with relevant message is shown just above the data table. Once a new sleep session is added to the system then the newly entered data is the most latest data then those values are used to prepopulate the date fields in the sleep start and end fields.   
  
  
### Display of Data Section:  
This section consists of the subheading, a div to populate toast messages and the Delete all entries button which as the name suggests deletes everything from the system upon asking confirmation from the user before doing so.   
  
This section also contains the div with class `display` where the data is populated in the form of a HTML table with relevant column headings and data. The data format in which the data is extracted from the input fields does not match with the project requirements. So some data formatting happens before saving to the localStorage and display in the table.  
  
After the above subsection, another div that contains a button with label `Copy +24 hrs` is present. This button is added to the project to make it easy for the users to add a the same sleep start and end times just like their latest entry button for the next day.  
  
Along with the data, a delete button is added in each input row for deleting that specific entry from the table. 
  
  
### Help Guide Modal Overlay Section:  
This section is used to toggle on and off a modal with helpful instructions to help the user understand the role of each button on the webpage. Scrolling is turned off when the modal is displayed to avoid unnecessary confusion to the user when the modal is turned on accidentally and page is scrolled to do something else. Turning off the scroll helps avoid such confusion to the user. The button to toggle this modal on and off is placed right next to the main heading in a very subtle non-intrusive way using an info style icon. And to close the modal, the user has to use the cross button that is placed towards the top right corner.  
  
-------------------------
  
## 2. newstyles.css:  
This css file contains the code that is used to style the FIPS data entry system from ground up and is written using the CSS3 standard. The styles for each section are grouped together in the sequence they appear in the html file to make it easy for other teammates to find the relevant styles. Common styles like that of the buttons are grouped together where possible and are all placed in the location they were styled for the first time in the code. Global styles that normalize the appearance of the webpage on all browsers are written at the very beginning of the css file. 
  
Best practices for writing the css code are followed unless they interfered the meaning or the development of other code. Mostly class selectors are used to make the styles reusable and the styles that should not be applied more than once are coded through the usage of ID selectors. Colors used are mostly written in the hexadecimal format unless opacity is tweaked in certain cases like that of the modal background overlay where the usage of RGBA format is unavoidable.  
  
Some of the styles that need to be explained are `.hide-overlay` class selector which when added to any html element makes the element invisible by removing it from the document flow. This is used to turn on and off the modal overlay, hence the suitable name. A different css selector `.hide-scroll` is used to turn off the scroll by restricting the overflow css property to hidden. These two css selectors are used simulataneously to display the modal and turn off the scroll and viceversa. These classes are added to and removed from (toggled) the modal related divs using the javascript attached to the html file. Another css selector `.hide-firefox-alert` although does exactly the same work as the `.hide-overlay` but is written separately just for the purpose of ease of reading html code without having to refer to css file often.  
  
The styles that are written for the data table representation depend on their position in the html document. So if some reason, a table is added somewhere above the display table, then the css code needs to be adjusted accordingly. For this precise reason, the table element within the modal caused a minor bug with the styling of overlapped sleep data entries. Since the modal is anyways going to be positioned absolutely, the html div that contained the modal content and the modal table is simply placed at the end of the body element.  

Tooltips were added to each and every button in the html code to give out a simple tip to the user about the buttons' function. These tooltips are not styled in anyway using the css. 
  
At the end of all the section styles, all the media queries are placed to adjust the sizes and positions of fonts and html elements. All the media queries are pretty much self explanatory and only a handful of css properties are modified to make the page usable on iPads and devices of similar sizes. Since the use case for this FIPS data entry system is mostly on big screen devices like that of iPads, laptops and desktops, media queries are written to optimise the webpage appearance for those sizes only.  
  
  
-------------------------
  
## 3. script.js:  
This file contains all the javascript code that is used to add all the functionality in the data entry system. All the javascript is contained in this file and no script tags are used to add js code within the html file. And the same best practice was followed for the css styling and no inline or internal styling was used. This helped in keeping the content, presentation and functionality separate from each other.  
  
Global variables and constants that are used throughout the script are defined at the top of the script for quick modification of the configuration parameters.  
  
The array variable `data` stores all the sleep instances data in the form of subarrays. All the elements of the subarray are stored in the string format for ease of sorting them later on. The array variable `tempData` is used to temporarily store the data of one sleep instance while all the data validation checks are made and then once all checks are passed, `tempData` is pushed into the `data` and `tempData` will be reset to empty. Two constants are defined, one is `lowerThresholdSleepDuration` and `upperThresholdSleepDuration`. These are currently set to 1 hr and 12 hrs to determine if a sleep duration is abnormally short or abnormally long and subsequently warn the users of this scenario.  
  

### window.onload function:  
The window.onload function is used to do setup several things. First thing that is done when the window loads, the browser in which the webpage is loaded is checked if the browser is firefox. If the browser is Firefox, then a warning message is displayed just below the main heading to warn the users. 
  
Since the sleep data is stored in the localStorage, if some data exists in the localStorage then that data is extracted and the `data` array is filled with existing data upon page load. And once the array is filled with previous data, the data is displayed to the user so that they know what data they have saved previously. After the previously stored data is displayed, a function call to prepopulate the date fields is made. This function invocation is made after the data is filled in the `data` array because the last entry in the data array is used for prepopulating the date fields.  
  
  
### displaySleepData function:  
This function grabs the html element with the class `display` and resets the inner text to empty string. Defines some variables that are used to format the sleep data in to a tabular format. An empty string variable `displayString` is defined and is built using a for loop. A html string that is contains a delete button is defined as `deleteButtonString` and is added to each table row. In the for loop that follows, the `displayString` is built and formatted using all the above mentioned variables and during the loop each data entry is given and id that is equal to the index of the subarrray in the `data` array. The reason for this will be described in the `deleteEntry` function description below. After the loop finishes, table header is prepended to the `displayString` and is inserted into the document node that has the class `display`. This function finishes at this point and displays the data to the user.  
  
  
### addEntry function:  
This function accepts four parameters which are (in sequence) as follows:  
1. `sleepStartDate`  
2. `sleepStartTime`  
3. `sleepEndDate`  
4. `sleepEndTime`  
  
These variables are self explanatory in what they represent, and this function is called when the `Add Entry` button is clicked after entering some date and time field values. Within the function firstly, the `tempData` array is reset to an empty array. This function is used in two ways. One is by passing the stated parameters and other by passing the stated parameters. If the parameters are not passed which is the usual case when the add entry button is clicked, the function grabs all the required values from the respective date and time fields from the webpage and assigns the values to the exactly same named variables. When discussing about the implementation of the `copyTheLastEntryToNextDay` function we will talk about the `addEntry` function being invoked along with the proper arguments. All the grabbed values are placed in the tempData array and checked for empty values. Once this check is passed, the values are checked with existing data to detect a duplicate entry, and then another check is made to ensure that the end date and time are indeed after the start date and time. Once all the above checks are done, the user entered data is checked for any overlaps with already existing data. Once the data passes this check, it is checked with the threshold limits we have set in the global variables section and a warning alert is shown to the user. Except for the abnormal short and long durations condition, rest all conditions prevent the sleep instance from being added to the localStorage. Once all the conditions are passed, `tempData` is pushed into the actual data array and sort function is invoked on it. Since all the date and time fields are ordered in sequence and are of string type, natural ordering of the strings is sufficient to sort the dat without the need for any comparator. After sorting the data in saved in localStorage by overwriting the previous data. Since the localStorage can only contain the strings as the values, the `data` array is stringified using the JSON.stringify function. A call to the `displaySleepData` is made to reflect the newly added data in the webpage. A toast message is displayed to indicate the user of the successful addition of the data instance. Since the newly added data might be the latest one, another call to `prepopulateDateFields` is made to update the date fields. The implementation of this function will be discussed in detail in later sections. This is the verbal description of the `addEntry` function in the script.js file.  
  
  
### isDuplicate function:  
This function checks if the newly entered data is a duplicate of any of the existing entries. To make this check easier, all the individual elements in the `tempData` array are joined into single string separated by commas. A for loop is executed on the subarrays of the `data` array by again converting each subarray into a string in the same fashion and checking if any existing elements match the new one. And this function returns a boolean value to indicate if the sleep instance is a duplcate or not.  
  
  
### deleteAllEntries function:  
This function is called when the `Delete All` button is clicked. If there are no entries in the localStorage then a simple alert is shown, else a confirmation dialog is presented asking the user for explicit confirmation to delete all entries. Once the user confirms, the `data` and `tempData` arrays are reset to empty arrays. The `sleepdata` key which holds the stringified version of the `data` array is set to the empty `data` array. A call to the `displaySleepData` is made to display the existing data which will update the table on the webpage to show no rows of sleep data. A toast message with relevant message is shown above the table to indicate to the user that the deletion was indeed successful. And since the prepopulation of the date fields depends on the existing sleep data, a call to the `prepopulateDateFields` is made to update the date fields' prefilled values. More on `prepopulateDateFields` later in the section. This is the role of the `deleteAllEntries`.  
  
  
### deleteEntry function:  
This function is called when the `delete` button is clicked in any of the table rows. This function takes in one parameter which is the click event that is passed as an argument by the `onclick` attribute within each table row elements. The event parameter that is passed into this function is used to figure out which table row within the table to be removed. The event.target gives us the button element. If the parent of the parent of the button is extracted, it is essentially the table row element. Then the `id` attribute value of that table row is extracted which was assigned to be the index of that sleep instance within the `data` array. The extracted id values is converted into number. Then the array splice method is used to delete 1 element from that index position. Then the new data array is assigned to the `sleepdata` key value in the localStorage. And as you might have expected, for this deletion operation to show up in the table on the webpage, a call to the `displaySleepData` is made and again a toast message is displayed above the table to indicate to the user that deletion has occurred. Since this change to the data array might affect the prepopulated values in the sleep start and end date values, a call to `prepopulateDateFields` is made. This is the role of `deleteEntry` function.  
  
  
### toastMessage function:  
This function is used to display the toast message that has already been referenced multiple times in the description of other functions. This function accepts two parameters. One is the message to be displayed and the other is the emotion through which the text color and background color of the toast message is adjusted. This emotion parameter has a default value of neutral. According to the passed in value of the emotion (which can take positive, negative and neutral as possible values) the color and background color are set to green, red and yellow respectively. The message string passed into the function is then set as the innerHTML of the element with the id `#toast-message`. Then the toast message is displayed by toggling on the `.hidden-message` class which basically sets the css property `display` to `hidden` and the same class is toggled off after 2000ms (i.e., 2 seconds) using the `window.setTimeout` to make the toast message go away from the webpage. This is the role of `toastMessage` function.  
  
  
### exportToCSV function:  
This function is invoked when the `Download` button is clicked. Upon invocation this function calls `getSeriesDateTimes` which returns an array that contains 4 elements and they represent `seriesStartDate`, `seriesStartTime`, `seriesEndDate` and `seriesEndTime`. Then the `data` array is checked if any elements are present or not. If not then an alert is shown to the user and the function returns. Another check is made to make sure no empty values are present in the series start and end, dates and times. Then another check is made to ensure that the series end date and time is after the series start date and time. Then two more checks are made to ensure that the series start date and time is before or equal to the first (chronologically) sleep session start date and time and also to ensure that the series end date and time is equal to or after the last sleep session end date and time. As per the formatting rules given by "Michael David Wilson", the time values are formatted in the HH:MM:SS format as compared to the HH:MM format that is default to the time fields. Then the document header is configured to interpret data as CSV.
Then the column headings are configured in the form of an array. A for loop is executed to format all the time values in the required format. The string that is built during the loop is appended to the `csvContent` variable which already contains the csv file header information. An empty `<a>` element is created and the href attribute is set to the result of encodedURI function and the download attribute is set to the default file name with which we prompt the user to download the CSV file. And we also simulate the click event by calling the click function on the `<a>` tag so the file gets downloaded when the `exportToCSV` function is invoked by the `Download` button.  
  
  
### getSeriesDateTimes function:  
This function is a helper function for the `exportToCSV` function. When this function is invoked, it grabs the series start and end, date and time values from those respective input fields on the webpage and collate them all into an array to return to the caller function.  
  
  
### isEndAfterStart function:  
This function is another helper function invoked by several functions for example, the `addEntry` function to check if the end date and time are after the start date and time or not. For this function to return true, the end date and time has to be after the start date and time (not even equal) as equal corresponds to zero time and zero duration does not make sense as a sleep duration. This function to perform its role, calls another function by passing the date and time values to get back the time in seconds that are lapsed since 1st January 1970. This time in seconds is extracted for both start date and time, and end date and time. Then they are compared against each other to determine if the end date and time is actually after the start date and time.  
  
  
### isEndAfterStartForSeries function:  
This function is another helper function that is extremely similar to the `isEndAfterStart` function with just one minor difference. The difference is that this function returns true when the end date and time is after or equal to the start date and time. The equality makes more sense in this situation because this function is used to check the series start date and time against the first sleep session start date and time. And similarly, series end date and time is compared against the last sleep session end date and time. As you might have expected this function and the `isEndAfterStart` function both take 4 parameters that represent start date, start time, end date and end time.  
  
  
### isValidSeriesStart function:  
This function is just a wrapper function that makes a call to the `isEndAfterStartSeries` by passing the parameters of series start date, series start time, first sleep start date and first sleep start time so as to check if the series start time is valid or not.  
  
  
### isValidSeriesEnd function:  
This function is just a wrapper function that makes a call to the `isEndAfterStartSeries` by passing the parameters of last sleep end date, last sleep end time, series end date and series end time so as to check if the series end time is valid or not.  
  
  
### timeInSeconds function:  
This function is yet another helper function invoked by several functions to convert the passed date and time into seconds that lapsed since the 1st January 1970. This splits the full date passed in into day, month and year. This also splits the time into hours, minutes and seconds. All this data is used to create a new `Date` object that upon creation returns the number of milliseconds that have elapsed since 1st January 1970. Then those milliseconds are divided by 1000 and floored to get the time in seconds and is returned to the caller function.  
  
  
### isAbnormalSleepDuration function:  
This function takes in 4 parameters which are starting date and time, ending date and time. Then each date and time are converted into seconds and the duration of the sleep is calculated by subtracting the starting time in seconds from the ending time in seconds. Once the duration of the sleep is calculated it is compared against the `lowerThresholdSleepDuration` and the `upperThresholdSleepDuration` after converting them into seconds as well. If the sleep session duration is less than the lower limit, -1 is returned and if sleep duration is greater than the upper limit, 1 is returned. In all other cases 0 is returned. Depending on the return value, addEntry function displayed appropriate info messages. In essence, this function helps in identifying abnormal sleep durations.  
  
  
### isOverlappingWithOther function:  
This function checks if the passed in sleep session info (start date + time and end date + time) is overlapping with any other sleep sessions present in the localStorage. If there is no previously saved data then there is no point of checking for overlaps. Hence -1 is returned. Different scenarios are checked to ensure all types of overlaps are checked for. All the checks are made after converting each date and time into seconds for ease of checking. If the start time and end time both are less than some other instance start time, then there is no need to loop any further and check of overlaps. This helps in early stopping. Next check is if the passed in start date and time is in between the start and end of any other instance. And similarly the next check is if the end time of the passed in date and time is between any other instance's start and end time. Next check is if the passed in instance is encompassing any other instance totally. Here each instance start and end time is checked for being within the range of other input parameters' start and end time. If any check comes out as true, then there is an overlaps and the index of the overlapped entry is recorded. Then a call to `highlightOverlappedEntry` is made by passing in the index recorded to highlight the entry in the table as a visual indication to the user. Then the index with which the input parameter is overlapping is returned so that the caller function `addEntry` can alert the users with appropriate messages.  
  
  
### prepopulateDateFields function:  
This function is used to prepopulate date fields according to the data present in the localStorage. It first grabs the date and time fields from the webpage. If there is no previously saved data, then the sleep start date is prefilled with today's date and the sleep end date is prefilled with tomorrow's date. If some data is already present, then the last sleep end date is used to prefill the sleep start date field and the next day is calculated and prefilled in the sleep end date.  
  
  
### highlightOverlappedEntry function:  
This function accepts one parameter which basically represents the index of the sleep session in the `data` array that is overlapping with the input that was attempted to be added to the system. Since the indexing starts from 0, 1 is added to make it one based indexing and another 1 is added to the index to offset for the header row. And then the appropriate row is grabbed from the table and a class `.highlight-table-row` is added to highlight the row and another window.setTimeout is set to toggle back the `.highlight-table-row` after 5000 milliseconds (i.e., 5 seconds) to remove the highlight.  
  
  
### copyTheLastEntryToNextDay function:  
This function is invoked upon clicking the `Copy +24 hrs` button which basically adds another entry in the table with the same start and end time as the latest entry in the table but adds on day to the start and end dates essentially replicating the same sleep session for the next day. If there is no data present, the above mentioned process cannot be carried out, hence an error alert is shown to inform the user the same. This function basically calculates the next day by making a call to the `addOneDay` function by passing in the current date and getting back the next date. Once this new entry is calculated, the newly calculated date values and the previously grabbed time values for both the start and end of the sleep session are passed to the `addEntry` function. This is the other way of calling the `addEntry` function. Hence, the check for existence of some sensible value within the parameters is made in the addEntry function. And since this addition affects the values that are prefilled in the date fields, another call to `prepopulateDateFields` is made to update the prefilled values in the sleep start and end dates.  
  
  
### addOneDay function:  
This function accepts two parametes, i.e., date and time. Then the date and time are converted into time in seconds using the `timeInSeconds` function. Then time in milliseconds equivalent to 24hrs is added to the previously calculated time in seconds * 1000. And then a new Date object is created with this newly calculate value and then new individual date, month and year are extracted from the returned value. Those values are formatted into the YYYY-MM-DD format and returned to the caller function.  
  
  
### toggleOverlay function:  
This function is used to toggle the overlay to present the modal to the user. This function when called adds the class `.highlight-overlay` if not present already and removes if already present. At the same time, the same is done with `.hide-scroll` class that is toggled on and off for the body element to prevent scrolling when the overlay is on and allow the scroll when the overlay is off.  
  
  
Many explanatory comments were already added in the script.js file but this documentation.md file is there to explain the role of each function within the overall scope and the underlying rationale and thought process that went behind coding up these functions.  

------------------------
  
## 4. styles.css:  
This css file contains the old styles that were used before the newstyles.css. This is just kept within the repo for record and is NOT currently being used in the FIPS Data Entry System.  
  
  

-----------------------
  

Written by,  
Akhil Eaga  
Software Developer at FOWI  

