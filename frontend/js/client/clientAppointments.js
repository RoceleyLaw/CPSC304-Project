//GLOBAL VARIABLES 
var CLIENT_PHONE_NUMBER; 

var ROUTE_URL = "https://evening-fjord-94245.herokuapp.com";
var ALL_REALTORS = "/allRealtors"
var APPOINTMENTS = "/appointments"; 


var ajaxGet = function(url, onSuccess, onError){
    var xhttp = new XMLHttpRequest();
    xhttp.timeout = 3000; // timeout set to 2 seconds 
    var sendCount = 0; 

    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var products = JSON.parse(xhttp.responseText); //convert payload to object
            onSuccess(products); 
        } else if(this.readyState == 4 && this.status == 500) {
            if(sendCount > 2) {
                onError(xhttp.responseText); 
            } else {
                sendCount++; 
                //send request again 
                xhttp.open("GET", url, true);
                xhttp.send();
            }
        }
    };

    xhttp.ontimeout = function (error) {
        console.log("TIMEOUT");
        console.log(error); 
        if(sendCount > 2) {
            onError("Timeout Occurred"); 
        } else {
            sendCount++; 
            //send request again 
            xhttp.open("GET", url, true);
            xhttp.send();
        }
      };
    
    //send the request for the first time
    xhttp.open("GET", url, true);
    xhttp.send();
}

var ajaxPost = function(url, onSuccess, onError, jsonString){
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", url, true);

    xhttp.setRequestHeader("Content-Type", "application/json");
    //xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    xhttp.onreadystatechange = function() { // Call a function when the state changes.
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            // Request finished. Do processing here.
            var products = JSON.parse(xhttp.responseText); //convert payload to object
            onSuccess(products);
        } else if(this.readyState == 4 && this.status == 500) {
                onError(xhttp.responseText); 
        }
    }

    //xhttp.send("foo=bar&lorem=ipsum"); 
    xhttp.send(jsonString); 
}

var ajaxPut = function(url, onSuccess, onError, putJSON){
    var xhttp = new XMLHttpRequest(); 
    xhttp.open("PUT", url, true); 

    xhttp.setRequestHeader("Content-Type", "application/json"); 

    xhttp.onreadystatechange = function() {
        if(this.readyState == 4 && this.status == 200) {
            var responseObject = JSON.parse(xhttp.responseText); 
            onSuccess(responseObject); 
        } else if (this.readyState == 4 && this.status == 500) {
            onError(xhttp.responseText); 
        }
    }

    xhttp.send(JSON.stringify(putJSON)); 
}

var ajaxDelete = function(url, onSuccess, onError) {
    var xhttp = new XMLHttpRequest(); 
    xhttp.open("DELETE", url, true); 

    xhttp.setRequestHeader("Content-Type", "application/json"); 

    xhttp.onreadystatechange = function() {
        if(this.readyState == 4 && this.status == 200) {
            var responseObject = JSON.parse(xhttp.responseText); 
            onSuccess(responseObject); 
        } else if (this.readyState == 4 && this.status == 500) {
            onError(xhttp.responseText); 
        }
    }

    xhttp.send(null); 
}


var populateDropDown = function(element, realtors) {
    for(key in realtors){
        //add them to element
        var temp = document.createElement("option"); 
        temp.innerHTML = realtors[key].realtorName + " - " + realtors[key].licenseNumber;
        element.appendChild(temp); 
    }

}

var createDropDown = function(){
    var options = document.getElementById("options");
    ajaxGet(ROUTE_URL + ALL_REALTORS, 
        function(realtors){
            populateDropDown(options, realtors); 
    },
        function(error){
        console.log("ERROR from create drop down")
        console.log(error); 
    })

}

var createAppointment = function(){
    var val = document.getElementById("options").value;
    var array = val.split('- '); 

    var obj = new Object(); 
    obj.licenseNumber = array[1]; 
    obj.startTime = document.getElementById("in1").value; 
    obj.endTime = document.getElementById("in2").value; 
    obj.date = document.getElementById("in3").value; 
    obj.locations = document.getElementById("in4").value; 
    obj.phoneNumber = CLIENT_PHONE_NUMBER; 

    var newJSON = JSON.stringify(obj); 
    console.log(newJSON); 

    var check1 = obj.startTime
    var array2 = check1.split(':'); 
    var check2 = obj.endTime
    var array3 = check2.split(':'); 

    if((array2[0]<= array3[0]) && (array2[1]<= array3[1])){
        ajaxPost("https://evening-fjord-94245.herokuapp.com/appointments", function(){
            console.log("POST Success"); 
            location.reload();
        }, 
        function(error){
            console.log("POST ERROR"); 
            console.log(error); 
        }, newJSON);
    }
    else{
        alert("Please Check Start and End Time");
    }

}

var createNewAppointment = function(element, info) {
    var tr = document.createElement("tr"); 

    var td; 

    td = document.createElement('td'); 
    td.innerHTML = info[0];
    tr.appendChild(td);  

    td = document.createElement('td'); 
    td.innerHTML = info[1];
    tr.appendChild(td); 

    td = document.createElement('td'); 
    td.innerHTML = info[2];
    tr.appendChild(td); 

    td = document.createElement('td'); 
    td.innerHTML = info[3]; //"10-9-2018";
    tr.appendChild(td); 

    td = document.createElement('td'); 
    td.innerHTML = info[4]; //"UBC";
    tr.appendChild(td); 

    td = document.createElement('td');
    var deleteButton = document.createElement('button');
    deleteButton.setAttribute("class", "btn btn-danger");
    deleteButton.setAttribute("type", "button"); 
    deleteButton.innerHTML = "Delete"; 
    deleteButton.setAttribute("onclick", "deleteAppointment(" + info[5] + ")");
    var updateButton = document.createElement('button'); 
    updateButton.setAttribute("class", "btn btn-success"); 
    updateButton.setAttribute("data-toggle", "modal");
    updateButton.setAttribute("data-target","#myModal");
    updateButton.setAttribute("type", "button"); 
    updateButton.innerHTML = "Update"; 
    updateButton.setAttribute("onclick", "updateAppointment(" + info[5] + ")"); 
    td.appendChild(deleteButton); 
    td.appendChild(updateButton);
    tr.appendChild(td);  

    element.appendChild(tr); 
}

var getAppointments = function(container){
    while(container.firstChild){
        container.removeChild(container.firstChild); 
    }

    ajaxGet(ROUTE_URL + APPOINTMENTS + "/" + CLIENT_PHONE_NUMBER, 
            function(appointments){
                listAllAppointments(container, appointments);  
            }, 
            function(error){
                console.log("getting client appointments failed"); 
                console.log(error); 
            });
}

var listAllAppointments = function(container, appointments) {

    console.log("list appt")
    for(var key in appointments){
        var obj = appointments[key];
        console.log(obj); 
        var info = []; 
        info.push(obj.realtorName); 
        info.push(obj.startTime); 
        info.push(obj.endTime); 
        info.push(obj.date); 
        info.push(obj.location);
        info.push(obj.appointmentID);  

        createNewAppointment(container, info);
    }
}

function deleteAppointment(id){
    console.log(id); 

    ajaxDelete(ROUTE_URL + APPOINTMENTS + "/" + id, 
        function(returnObject){
            console.log("DELETE SUCCESS"); 
            console.log(returnObject);
            var smth = document.getElementById("tBodyAppointments"); 
            getAppointments(smth); 
        }, 
        function(error){
            console.log("POST ERROR"); 
            console.log(error); 
        });
}

function updateAppointment(id) {
    console.log("UPDATE: " + id); 
}

window.onload = function() {
    console.log('Hello')

    var url_string = window.location.href
    var url = new URL(url_string);
    CLIENT_PHONE_NUMBER = url.searchParams.get("id");
    console.log("Client phone number: " + CLIENT_PHONE_NUMBER); 

    //listings
    var url1 = "./listings.html?id=" + CLIENT_PHONE_NUMBER; 
    var element1 = document.getElementById('menuHeaders1');
    element1.setAttribute("href",url1)

    //appointments 
    var url2 = "./appointments.html?id=" + CLIENT_PHONE_NUMBER; 
    var element2 = document.getElementById('menuHeaders2');
    element2.setAttribute("href",url2);

    //clientSettings
    var url3 = "./clientSettings.html?id=" + CLIENT_PHONE_NUMBER; 
    var element3 = document.getElementById('menuHeaders3');
    element3.setAttribute("href",url3);

    createDropDown(); //puts all the realtors in the dropdown 

    //adds all the clients appointments in 
    var smth = document.getElementById("tBodyAppointments"); 
    getAppointments(smth); 
}