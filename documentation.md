# FIPS DATA ENTRY SYSTEM DOCUMENTATION  

This documentation.md file is written to help the readers to understand the technical workings of the code files in this repository. In this document, you will learn about the importance of every file and their role in the project.  

## FILES:  
  
  
### index.html:  
This html file contains the structure of the web page. It uses the latest HTML5 language standards and is structured to use Bootstrap in some places and Google Fonts for all the text content.  

This html file links to the newstyles.css and the script.js files (details of the which are given in later sections).  

This project also use the Icon pack from Ionicons which is free to use for non-commercial purposes.   

This html files is internally divided in sections that are commented with their respective names.   

__Header Section:__ This section contains the main heading and the download button which converts all the input data into a CSV format file for downloading.  
  

__Firefox Alert Section:__ This section is toggled to be visible on when the project is accessed via Firefox browser which has some issues to properly render the date and time fields. This inconsistency is well known, which is why whenever a user accesses the FIPS data entry system via Firefox browser, a warning alert is shown below the main heading to warn the users about the inconsistency.  
  

__Series Start and End Date and Time Section:__ This section contains all the html code required to contain and organize the series start and end, date and time fields. They are organized into columns using css flexbox. The divs that contain the series start and end dates and times have exactly the same structure but slightly different IDs and class names (i.e., HTML ids and classes not the object oriented classes from other languages). All names were carefully chosen to make the code more readable and also well integrated in other code files (like the script.js) file.  
  
Coming to meaning of the data collected through this fields, the series start date and time represent the point in time from when user started tracking your sleep data. And similarly, series end date and time is the point in time when user stopped collecting their sleep data. Filling in these fields is not made mandatory to allow users to add some past data if they happen to be tracking it somewhere else or happen to recollect or just sourced from any other storage method. This means that the users can add data which precedes (in time) the data that is already present. By doing so they have the flexibility to enter sleep data. Hence, the series start and end date and time fields are not required to be filled in for every day data entry. They are only required when the user is satisfied with all the data that is currently stored and wants to save it in the CSV format. The data validation rules that are applied to these fields are that series start date and time can only be before (in time) or equal to the first sleep input start date and time in the system. And similarly, the series end date and time can only be equal to or after (in time) to the last sleep input end date and time. These rules will be checked for when attempting to download the data into a CSV file.  
  
  
__Sleep Data Entry Section:__ This section contains code that is responsible for the data and time fields of the sleep start and sleep end containers. Again the containers are arranged in position using CSS flexbox and the code structure pretty much represents the way the fields are organized within each parent div element. The divs that contain the sleep start and end dates and times have exactly the same structure but slightly different IDs and class names. All names were carefully chosen to make the code more readable and also well integrated in other code files (like the script.js) file. This section also contains the Add Entry button that attempts to add the input data into the system upon checking with data validation rules.  
  
Again, coming to discuss the meaning of these input fields, sleep start date and time represent the starting time of a day at which the user falls asleep and similarly, sleep end date and time represent the time of the day at which the user wakes up from that sleep. Together the sleep start and end, date and time represent one sleep session. Several data validation rules are put in place for these input fields to avoid entering faulty data that does not make sense in real scenario. Some data validation rules are strictly prohibited making it impossible to input such data and some of the data validation rules are implemented just to warn the user just in case they have not realized the potential faults their input data might be having. For example, the sleep start date and time cannot be equal to or after the sleep start date and time as they dont make sense in real life. A sleep session timings cannot overlap partially or fully with any other sleep session. A sleep session duration of less than 1 hr or more than 12 hrs is flagged as abnormally short or long durations by warning the user of the these scenarios and asking for confirmation if they really wish to proceed to add the data into the system. And again, empty values in any of the input fields is not allowed. Duplicate entries are not allowed and the users are warned accordingly of this scenario. Once all these data checks are passed and if the input data is in compliance with all of these, only then the sleep data is added into the system.  
  
Once the sleep instance is added. as a common user would want the data to be in chronological order, the data instance is inserted in the appropriate row position within the data table. A copy of the data is saved into the localStorage of the browser. Once the data is added, a toast message with relevant message is shown just above the data table. Once a new sleep session is added to the system then the newly entered data is the most latest data then those values are used to prepopulate the date fields in the sleep start and end fields.   
  

__Display of Data Section:__ This section consists of the subheading, a div to populate toast messages and the Delete all entries button which as the name suggests deletes everything from the system upon asking confirmation from the user before doing so.   
  
This section also contains the div with class "display" where the data is populated in the form of a HTML table with relevant column headings and data. The data format in which the data is extracted from the input fields does not match with the project requirements. So some data formatting happens before saving to the localStorage and display in the table.  
  
After the above subsection, another div that contains a button with label "Copy +24 hrs" is present. This button is added to the project to make it easy for the users to add a the same sleep start and end times just like their latest entry button for the next day.  
  
Along with the data, a delete button is added in each input row for deleting that specific entry from the table. 
  
  
__Help Guide Modal Overlay Section:__ This section is used to toggle on and off a modal with helpful instructions to help the user understand the role of each button on the webpage. Scrolling is turned off when the modal is displayed to avoid unnecessary confusion to the user when the modal is turned on accidentally and page is scrolled to do something else. Turning off the scroll helps avoid such confusion to the user. The button to toggle this modal on and off is placed right next to the main heading in a very subtle non-intrusive way using an info style icon. And to close the modal, the user has to use the cross button that is placed towards the top right corner.  