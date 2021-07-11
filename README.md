# FIPS-Data-Entry-System
Repo for the FIPS system code files  

### Link to access the live version of this data entry system: https://akhil-eaga.github.io/FIPS-Data-Entry-System/

## Contributors:
- Luke Strickland - Project Supervisor
- Michael David Wilson - Project Supervisor
- Akhil Eaga - Programmer


## Role of each code file:
1) index.html - Contains the HTML code that renders the front end
2) newstyles.css - This is CSS file used to add a bit of styling and layout to the front end
3) script.js - Adds functionality to the front end FIPS system
4) styles.css - This file contains the old styling css rules (not currently used in the FIPS styling)  

## Features available:
1) Automatic sorting of the sleep data
2) Duplicate data entry detection and prevention
3) Exporting data into a CSV file format
4) Confirmation before deleting all the data
5) Data is stored in the browser (so data storage is persistent)
6) Data validation checks added:  
    a) Series start time cannot be after or equal series end time  
    b) Series start time cannot be after first sleep start time (updated)  
    c) Series end cannot be before last sleep end time (updated)  
    d) For each sleep instance the start time cannot be after or equal to the end time  
    e) Overlapping sleep durations are detected and prevented from being added to the database  
7) Firefox browser is detected and the user will be alerted of non standard date and time input fields behaviour
8) Sleep start and end date fields are automatically filled to enhance user experience  
9) Overlapped instances are highlighted to help the user quickly find the instance that is overlapping with the current input  
10) A copy +24 hrs button has been added to quickly add one day to the last entry in the data table  
11) A modal with instructions on what each button does can be accessed using the info icon next to the main heading  
12) Tooltips with buttons' functionality are added on each button and present themselves when hovered over the buttons  

