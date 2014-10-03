//var
timeArray = new Array;

techArray = new Array;

nurseArray = new Array;

var xmlHttpUser, xmlHttpMonth;

currentGroups = 0;
maxGroups = 4;
lastClicked = 0;

// onload

function onload() {

 access = 2;

 getUsers();
 popYears();
 popMonth();
 popTime("time1");
 popTime("time2");
 document.getElementById("add").onclick = add;
 document.getElementById("submit").onclick = submitInput;
 document.getElementById("cancel").onclick = resetDisplay;
}

// create xmlObject
function createXmlHttpRequestObject() {

 var xmlHttp;

 if (window.ActiveXObject) {
  try {
   xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
  } catch (e) {
   xmlHttp = false;
  }
 } else {
  try {
   xmlHttp = new XMLHttpRequest();
  } catch (e) {
   xmlHttp = false;
  }
 }

 if (xmlHttp == null) {
  alert("Could not create XML Object");
 } else {
  return xmlHttp;
 }
}

// populate years selection
function popYears() {

 var year = (new Date()).getFullYear(), select = document
   .getElementById("yearList"), option = null, next_year = null;
 for (var i = -1; i <= 1; i++) {
  option = document.createElement("option");
  next_year = parseInt(year, 10) + i;
  option.value = next_year;
  option.innerHTML = next_year;
  select.appendChild(option);
 }
 select.selectedIndex = 1;
}

// populate month selection
function popMonth() {

 select = document.getElementById("monthList");
 option = null;

 months = [ "January", "February", "March", "April", "May", "June", "July",
   "August", "September", "October", "November", "December" ];

 for (var i = 0; i <= 11; i++) {

  option = document.createElement("option");

  option.value = months[i];
  option.innerHTML = months[i];
  select.appendChild(option);

 }
 select.selectedIndex = 0;
}

// populate time selections
function popTime(id) {

 select = document.getElementById(id);
 option = null;
 next_year = null;

 for (var i = 1; i <= 12; i++) {

  option = document.createElement("option");

  option.value = i;
  option.innerHTML = i + ':00 AM';
  select.appendChild(option);

 }
 
 for (var i = 1; i <= 12; i++) {

  option = document.createElement("option");

  option.value = (12 + i);
  option.innerHTML = i + ':00 PM';
  select.appendChild(option);

 }
 select.selectedIndex = 6;
}

// get users from server.
function getUsers() {

 xmlHttpUser = createXmlHttpRequestObject();

 if (xmlHttpUser.readyState == 0) {
  xmlHttpUser.open("GET", "data/userData.php", true);
  xmlHttpUser.onreadystatechange = handleUserXML;
  xmlHttpUser.send();

 } else {
  setTimeout(getUsers(), 10000);
  alert('Loading');
 }

}

// process xml for users.
function handleUserXML() {
first = true;
 tech = document.getElementById("tech");
 nurse = document.getElementById("nurse");
 name = '';
 role = '';
 id = '';

 if (xmlHttpUser.readyState == 4)

  if (xmlHttpUser.status == 200) {

   xmlResponse = xmlHttpUser.responseXML;
   users = xmlResponse.getElementsByTagName('users');
   
   for (var i = 0; i < users.length; i++) {

    user = users.item(i);

    nodes = user.childNodes;
    
     for (var j = 0; j < nodes.length; j++) {
 
      if (nodes.item(j).nodeName == "name") {
       name = nodes.item(j).firstChild.nodeValue;
      }
      if (nodes.item(j).nodeName == "role") {
       role = nodes.item(j).firstChild.nodeValue;
      }
      if (nodes.item(j).nodeName == "id") {
       id = nodes.item(j).firstChild.nodeValue;
      }
      
     }
    
    option1 = document.createElement("option");
    option2 = document.createElement("option");
    
    next_user = name;
    
    option1.value = id;
    option1.innerHTML = next_user;
    
    option2.value = id;
    option2.innerHTML = next_user;
    
    var isactive = parseInt(user.getAttribute('isactive'));
  
    if (isactive == 1 && role == "tech" || role == "both") {
     
     tech.appendChild(option1);
    }
    if (isactive == 1 && role == "nurse" || role == "both") {
     
     nurse.appendChild(option2);
    }
  
   }
  }
 printMonth();

}

// end onload

// gui
 // add
function add() {

 if (currentGroups < maxGroups) {
  
  //element
  time1 = document.getElementById("time1");
  //value to be inserted 7:00 AM as 7 and 7:00 PM as 19 to be inserted into database.
  time1String = time1.options[time1.selectedIndex].value;
  //time to be displayed, 7:00 AM
  time1Display = time1.options[time1.selectedIndex].text;

  time2 = document.getElementById("time2");
  time2String = time2.options[time2.selectedIndex].value;
  time2Diplay = time2.options[time2.selectedIndex].text;

  tech = document.getElementById("tech");
  techString = tech.options[tech.selectedIndex].text;

  nurse = document.getElementById("nurse");
  nurseString = nurse.options[nurse.selectedIndex].text;

  preview = document.getElementById("preview");
  old = preview.innerHTML;

  timeArray.push(time1String + "_" + time2String);
  techArray.push(tech.options[tech.selectedIndex].value);
  nurseArray.push(nurse.options[nurse.selectedIndex].value);
  currentGroups++;

  preview.innerHTML = old + time1Display + " - " + time2Diplay + "<br>"
    + techString + "<br>" + nurseString + "<br><hr><br>";

 } else {
  alert("You've reached the max supported groups.");
 }

}

// submit
function submitInput() {
 
 try{
 
 if (timeArray.length > 0 && techArray.length > 0 && nurseArray.length > 0) {

  insert(formatArray(timeArray), formatArray(techArray),
    formatArray(nurseArray), timeArray.length, lastClicked,
    monthNum(), getYearNum());

  resetDisplay();

 } else {
  alert("Please add groups before submitting");
 }

 }catch(e){alert(e + 'error on insert');}

}

// insert
function insert(time, tech, nurse, groups, day, month, year) {
 
 try {
  xmlHttpInsert = createXmlHttpRequestObject();

  if (xmlHttpInsert.readyState === 0) {
   xmlHttpInsert.open("POST", "data/dataIn.php", true);
   xmlHttpInsert.onreadystatechange = handleInsert;
   xmlHttpInsert.setRequestHeader("Content-type",
     "application/x-www-form-urlencoded");

   xmlHttpInsert.send("tech=" + tech + "&nurse=" + nurse + "&time="
     + time + "&day=" + day + "&month=" + month + "&year="
     + year + "&groups=" + groups);

  } else {
   setTimeout(this, 10000);
   alert('Loading');
  }
 } catch (error) {
  alert(error + "insert format error");
 }

}

// print month after insert
function handleInsert() {

 if (xmlHttpUser.readyState == 4)

  if (xmlHttpUser.status == 200) {
   printMonth();
  }

}

// reset preview div
function resetDisplay() {

 timeArray.clear();
 techArray.clear();
 nurseArray.clear();
 currentGroups = 0;
 document.getElementById('popUpDiv').style.display = "none";
 time1.selectedIndex = 18; 
 time2.selectedIndex = 6;
 preview = document.getElementById("preview").innerHTML = '';
}

// on div click.
function clicked(e) {

 if (access > 0) {
  document.getElementById('popUpDiv').style.display = "block";
  lastClicked = e - getOffset() + 1;

  div = document.getElementById("tableHeader");
  headerString = getMonthName() + " the " + lastClicked
    + getDaySuffix(lastClicked) + " of " + getYearNum();
  div.innerHTML = headerString;
 } else {
  alert('You don\'t have edit permissions');
 }
}

// joins array elements to string seperated by -
function formatArray(array) {

 build = '';

 for (var i = 0; i < array.length; i++) {

  build += array[i];
  if (i < (array.length - 1)) {
   build += "-";
  }

 }
 return build;
}

// print month
function printMonth() {

 currentMonth = document.getElementById("currentMonth");

 currentMonth.innerHTML = "Showing : " + getMonthName() + ' of ' +  getYearNum();

 pointer = newInset = getOffset();

 totalDays = getDays();

 counter = 1;

 for (var i = 1; i <= 42; i++) {
  div = document.getElementById(i);

  div.innerHTML = "";

 }

 while (pointer <= 42 && pointer <= totalDays + newInset) {

  div = document.getElementById(pointer++);

  div.innerHTML = counter++;

 }
 updateMonth();
}

// gets xml from database
function updateMonth() {

 try {
  xmlHttpMonth = createXmlHttpRequestObject();

  if (xmlHttpMonth.readyState === 0) {
   xmlHttpMonth.open("GET", "data/dataData.php?month=" + getMonthNum()
     + "&year=" + getYearNum(), true);
   xmlHttpMonth.onreadystatechange = handleMonthXML;
   xmlHttpMonth.send();

  } else {
   setTimeout(updateMonth(), 10000);
   alert('Loading');
  }
 } catch (error) {
  alert(error + "updatemonth");
 }
}

// handles month xml
function handleMonthXML() {

 if (xmlHttpMonth.readyState === 4 && xmlHttpMonth != null)

  if (xmlHttpMonth.status === 200) {

   try {
  first = true;
    xmlResponse = xmlHttpMonth.responseXML;
    days = xmlResponse.getElementsByTagName('day');

    if (days.length > 0 && days != null) {

     for (var i = 0; i < days.length; i++) {

      day = days.item(i);

      dayNum = parseInt(day.getAttribute('day')) - 1;
      dayDiv = document.getElementById(dayNum + getOffset());

      groups = parseInt(day.getAttribute('groups'));

      nodes = day.childNodes;

      for (var j = 0; j < nodes.length; j++) {

       if (nodes.item(j).nodeName == "tech") {
        tech = nodes.item(j).hasChildNodes() ?
        
         tech = nodes.item(j).firstChild.nodeValue : tech = '';
       }
       if (nodes.item(j).nodeName == "nurse") {
        nurse = nodes.item(j).hasChildNodes() ?
        
         nurse = nodes.item(j).firstChild.nodeValue : nurse = '';
       }
       if (nodes.item(j).nodeName == "time") {
        time = nodes.item(j).hasChildNodes() ?
        
         time = nodes.item(j).firstChild.nodeValue : time = '';
       }
       
       if (nodes.item(j).nodeName == "holiday") {
        holiday = nodes.item(j).hasChildNodes() ?
        
         holiday = nodes.item(j).firstChild.nodeValue : holiday = '';
   
       }

      }

      dayDiv.innerHTML = day.getAttribute('day') + "<br>" + holiday + "<br>";

      arrayTime = time.split('-');
      arrayTech = tech.split('-');
      arrayNurse = nurse.split('-');

      for (var l = 0; l < groups; l++) {

       old = dayDiv.innerHTML;

       dayDiv.innerHTML = old + "<br>" + formatTimeDisplay(arrayTime[l])
         + "<br>" + arrayTech[l]
         + "<br>" + arrayNurse[l];

      }
     }
    }

   } catch (e) {
    alert(e + 'month');

   }
  }
}

// GETTERS

// get offset of month IE if month dosen't start on sunday.
function getOffset() {

 year = getYearNum();
 change = 0;
 leap = false;

 if ((year % 4) == 1) {
  change = 1;
 } else if ((year % 4) == 2) {
  change = 2;
 } else if ((year % 4) == 3) {
  change = 3;
 } else if (((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0)) {
  leap = true;
 }

 // based off of "year / 4 == .25", a year after a new year.

 inset = [ 1, 4, 4, 0, 2, 5, 0, 3, -1, 1, 4, -1 ];
 // j , f m a m j j a s o n d

 for (var i = 0; i < inset.length; i++) {

  if (!leap) {
   inset[i] += change;
  } else {

   inset[0] = 0;
   inset[1] = 3;
   inset[8] = 0;
   inset[11] = 0;

  }
 }

 return inset[monthNum() - 1] + 1;
}

// get number of days in a month
function getDays() {

 year = getYearNum();

 var days = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];

 if (((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0)) {
  days[1] += 1;
 }

 return days[monthNum() - 1] - 1;

}

//takes time from database as 19_7 to 7:00 PM - 7:00 AM
function formatTimeDisplay(time){
 
 timeEx = time.split('_');
 
 start = parseInt(timeEx[0]);
 
 end = parseInt(timeEx[1]);
 
 if((start - 12) > 0){start = (start - 12) + ':00 PM';}else{start = start + ':00 AM';}
 if((end - 12) > 0){end = (end - 12) + ':00 PM';}else{end = end + ':00 AM';}
 
   return start + ' - ' + end;
 
 }

// get month number via select box.
function monthNum() {

 var monthList = document.getElementById("monthList");

 monthNumString = '';

 switch (monthList.options[monthList.selectedIndex].text) {

 case "January":
  monthNumString = 1;
  break;
 case "February":
  monthNumString = 2;
  break;
 case "March":
  monthNumString = 3;
  break;
 case "April":
  monthNumString = 4;
  break;
 case "May":
  monthNumString = 5;
  break;
 case "June":
  monthNumString = 6;
  break;
 case "July":
  monthNumString = 7;
  break;
 case "August":
  monthNumString = 8;
  break;
 case "September":
  monthNumString = 9;
  break;
 case "October":
  monthNumString = 10;
  break;
 case "November":
  monthNumString = 11;
  break;
 case "December":
  monthNumString = 12;
 }

 return monthNumString;

}

// get selected year
function getYearNum() {

 var yearList = document.getElementById("yearList");

 return yearList.options[yearList.selectedIndex].text;

}

// get month name
function getMonthName() {
 var monthList = document.getElementById("monthList");
 return monthList.options[monthList.selectedIndex].text;
}

// get month as number IE 1-12
function getMonthNum() {
 try {
  var monthList = document.getElementById("monthList");
  return monthList.selectedIndex + 1;
 } catch (err) {
  alert(err);
 }
}

// append ending for date. IE 9th, 2nd
Array.prototype.clear = function() {
 var i;
 for (i = 0; i < this.length; i++) {
  this.pop();

 }
 this.length = 0;
};

function getDaySuffix(num) {
 var array = ("" + num).split("").reverse(); // E.g. 123 = array("3","2","1")

 if (array[1] != "1") { // Number is in the teens
  switch (array[0]) {
  case "1":

   return "st";
  case "2":
   return "nd";
  case "3":
   return "rd";
  }
 }

 return "th";
}