//GLOBAL VARIABLES 
var REALTOR_NUMBER; 
var SELECTED_APPOINTMENT_ID; 

var POST_ROUTE = "https://evening-fjord-94245.herokuapp.com/";

var ROUTE_URL = "https://evening-fjord-94245.herokuapp.com";
var ALL_LISTINGS = "/allUnsoldPosts"
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



var createRealtorAppointment = function(){
    console.log("hello"); 
    var obj = new Object(); 
    var val = document.getElementById("phoneNumberOptions").value;
    var array1 = val.split('- '); 
    obj.licenseNumber = REALTOR_NUMBER; 
    obj.phoneNumber = array1[0]; 
    obj.startTime = document.getElementById("input2").value; 
    obj.endTime = document.getElementById("input3").value; 
    obj.date = document.getElementById("input4").value; 
    obj.location = document.getElementById("input5").value; 
    obj.appointmentID= 90;
    var newJSON = JSON.stringify(obj); 
    console.log(newJSON); 
    console.log("start Post");
    var check1 = obj.startTime
    var array2 = check1.split(':'); 
    var check2 = obj.endTime
    var array3 = check2.split(':'); 

    if((array2[0]<= array3[0]) && (array2[1]< array3[1]) || (array2[0] <= array3[0]) && (array2[1] = array3[1]) ){
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

var populateDropDown = function(element, listings) {
    for(key in listings){
       //add them to element
        var temp = document.createElement("option"); 
        temp.innerHTML = listings[key].listingID;
        element.appendChild(temp); 
    }

}

var createDropDown = function(){
    var options = document.getElementById("listingOptions");
    ajaxGet(ROUTE_URL + ALL_LISTINGS, 
        function(listings){
            populateDropDown(options, listings); 
    },
        function(error){
        console.log("ERROR from create drop down")
        console.log(error); 
    })

}
var populatePhoneNumberDropDown = function(element, phoneNumber) {
    for(key in phoneNumber){
       //add them to element
        var temp = document.createElement("option"); 
        temp.innerHTML = phoneNumber[key].phoneNumber + " - " + phoneNumber[key].clientName;
        element.appendChild(temp); 
    }

}

var createDropDownForPhoneNumber = function(){
    var options = document.getElementById("phoneNumberOptions");
    ajaxGet("https://evening-fjord-94245.herokuapp.com/allClients", 
        function(phoneNumbers){
            populatePhoneNumberDropDown(options, phoneNumbers); 
    },
        function(error){
        console.log("ERROR from create drop down")
        console.log(error); 
    })

}
var createOpenHouse = function(){
    console.log("hello"); 
    var obj = new Object(); 
    obj.listingID = document.getElementById("listingOptions").value;;  
    obj.startTime = document.getElementById("inputStartTime").value; 
    obj.endTime = document.getElementById("inputEndTime").value; 
    obj.date = document.getElementById("inputDate").value;    
    var newJSON = JSON.stringify(obj); 
    console.log(newJSON); 
}

/*
    APPOINTMENT CODE 
*/
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
    td.innerHTML = info[5]; 
    tr.appendChild(td); 

    td = document.createElement('td');
    var deleteButton = document.createElement('button');
    deleteButton.setAttribute("class", "btn btn-danger");
    deleteButton.setAttribute("type", "button"); 
    deleteButton.innerHTML = "Delete"; 
    deleteButton.setAttribute("onclick", "deleteAppointment(" + info[6] + ")");
    var updateButton = document.createElement('button'); 
    updateButton.setAttribute("class", "btn btn-success"); 
    updateButton.setAttribute("data-toggle", "modal");
    updateButton.setAttribute("data-target","#myModal");
    updateButton.setAttribute("type", "button"); 
    updateButton.innerHTML = "Update"; 
    updateButton.setAttribute("onclick", "updateAppointment(" + info[6] + ")"); 
    td.appendChild(deleteButton); 
    td.appendChild(updateButton);
    tr.appendChild(td);  

    element.appendChild(tr); 
}

var getAppointments = function(container){
    while(container.firstChild){
        container.removeChild(container.firstChild); 
    }

    ajaxGet(ROUTE_URL + APPOINTMENTS + "/byrealtor" + "/" + REALTOR_NUMBER, 
            function(appointments){
                listAllAppointments(container, appointments);  
            }, 
            function(error){
                console.log("getting realotr appointments failed"); 
                console.log(error); 
            });
}

var listAllAppointments = function(container, appointments) {

    console.log("list appt")
    for(var key in appointments){
        var obj = appointments[key];
        console.log(obj); 
        var info = []; 
        info.push(obj.clientName); 
        info.push(obj.phoneNumber); 
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
            var smth = document.getElementById("realtorBodyAppointments"); 
            getAppointments(smth); 
        }, 
        function(error){
            console.log("POST ERROR"); 
            console.log(error); 
        });
}

function updateAppointment(id) {
    console.log("UPDATE: " + id); 
    SELECTED_APPOINTMENT_ID = id; 
}

function updateAppointmentClick(){
    var obj = new Object(); 
    obj.id = SELECTED_APPOINTMENT_ID; 
    obj.startTime = document.getElementById("in1").value; 
    obj.endTime = document.getElementById("in2").value; 
    obj.date = document.getElementById("in3").value; 
    obj.location = document.getElementById("in4").value; 

    var check1 = obj.startTime
    var array2 = check1.split(':'); 
    var check2 = obj.endTime
    var array3 = check2.split(':'); 

    if((array2[0]<= array3[0]) && (array2[1]<= array3[1])){
        console.log(obj); 
        ajaxPut(ROUTE_URL + APPOINTMENTS + "/" + obj.id, 
                function(response){
                    console.log(response); 
                    console.log("PUT Success"); 
                    location.reload(); 
                }, 
                function(error){
                    console.log("update appointment error"); 
                    console.log(error); 
                }, 
                obj); 
    }
    else{
        alert("Please Check Start and End Time");
    }

}


window.onload = function() {
    console.log('Realtor Appointment');

    //GET REALTOR NUMBER
    var url_string = window.location.href
    var url = new URL(url_string);
    REALTOR_NUMBER = url.searchParams.get("id");
    console.log("Client phone number: " + REALTOR_NUMBER); 

    //realtorListings
    var url1 = "./realtorListings.html?id=" + REALTOR_NUMBER; 
    var element1 = document.getElementById('menuHeaders1');
    element1.setAttribute("href",url1)

    //soldListings 
    var url2 = "./soldListings.html?id=" + REALTOR_NUMBER; 
    var element2 = document.getElementById('menuHeaders2');
    element2.setAttribute("href",url2);

    //realtorAppointments 
    var url3 = "./realtorAppointments.html?id=" + REALTOR_NUMBER; 
    var element3 = document.getElementById('menuHeaders3');
    element3.setAttribute("href",url3);

    //realorSettings
    var url4 = "./realtorSettings.html?id=" + REALTOR_NUMBER; 
    var element4 = document.getElementById('menuHeaders4');
    element4.setAttribute("href",url4);

    createDropDown(); 
    createDropDownForPhoneNumber();

    var smth = document.getElementById("realtorBodyAppointments"); 
    getAppointments(smth); 


}