//GLOBAL VARIABLES 
var REALTOR_NUMBER; 

var POST_ROUTE = "https://evening-fjord-94245.herokuapp.com/";

var ROUTE_URL = "https://evening-fjord-94245.herokuapp.com";
var ALL_LISTINGS = "/allUnsoldPosts"



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

    if((array2[0]<= array3[0]) && (array2[1]< array3[1])){
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


}