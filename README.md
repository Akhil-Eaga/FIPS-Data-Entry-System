# FIPS-Data-Entry-System
Repo for the FIPS system code files  

### Link to access the live version of this data entry system: https://akhil-eaga.github.io/FIPS-Data-Entry-System/

## Contributors:
- Luke Strickland - Project Supervisor
- Michael David Wilson - Project Supervisor
- Akhil Eaga - Programmer


## Role of each code file:
1) index.html - Contains the HTML code that renders the front end
2) styles.css - This is CSS file used to add a bit of styling and layout to the front end
3) script.js - Adds functionality to the front end FIPS system


## Features available:
1) Automatic sorting of the sleep data
2) Duplicate data entry detection and prevention
3) Exporting data into a CSV file format
4) Confirmation before deleting all the data
5) Data is stored in the browser (so data storage is persistent)
6) Data validation checks added:  
    a) Series start time cannot be after or equal series end time  
    b) Series start time cannot be after or equal first sleep start time  
    c) Series end cannot be before or equal last sleep end time  
    d) For each sleep instance the start time cannot be after or equal to the end time  
