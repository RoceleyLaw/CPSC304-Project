//GLOBAL VARIABLES 
var REALTOR_NUMBER;
var ROUTE_URL = "https://evening-fjord-94245.herokuapp.com";
var GET = "/allRealtors/"; 
var PUT ="/allRealtors/:phoneNumber?";
var accountInfo ={};
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

var ajaxPut = function(url, onSuccess, onError,jsonString){
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

    xhttp.send(jsonString); 
}

function updateInformation(){
    console.log("hello");
    var obj = new Object();
    obj.realtorName = document.getElementById("lg1").value;
    console.log(obj.realtorName);
    obj.phoneNumber = document.getElementById("lg2").value;
    obj.licenseNumber = document.getElementById("lg3").value;
    obj.realtorEmail = document.getElementById("lg4").value;
    //obj.password = document.getElementById("inputPassword").value;
                
    var newJSON = JSON.stringify(obj);
    console.log(newJSON);
    ajaxPut("https://evening-fjord-94245.herokuapp.com/allRealtors/" + REALTOR_NUMBER, function(){
        console.log("POST Success"); 
        location.reload();
    }, 
    function(error){
        console.log("POST ERROR"); 
        console.log(error); 
    }, newJSON);
}

window.onload = function() {
    console.log('Realtor Settings');

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
    
    ajaxGet(ROUTE_URL + GET + REALTOR_NUMBER, 
        function(testObject){
            console.log("GET SUCCESS");            
            console.log(testObject[0].realtorName);
            document.getElementById("lg1").value=testObject[0].realtorName;
            document.getElementById("lg2").value=testObject[0].phoneNumber;
            document.getElementById("lg3").value=testObject[0].licenseNumber;
            document.getElementById("lg4").value=testObject[0].realtorEmail;
            
        },
        function(error){
            console.log("GET ERROR"); 
            console.log(error);
        }); 
}

