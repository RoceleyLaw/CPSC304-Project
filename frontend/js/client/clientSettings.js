//GLOBAL VARIABLES 
var CLIENT_PHONE_NUMBER; 
var ROUTE_URL = "https://evening-fjord-94245.herokuapp.com";
var GET = "/allClients/"; 
var PUT ="/allClients/:phoneNumber?";
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

function updateClientInformation(){
    console.log("hello");
    var obj = new Object();
    obj.clientName = document.getElementById("lg1").value;
    obj.phoneNumber = document.getElementById("lg2").value;
    obj.clientEmail = document.getElementById("lg3").value;
    //obj.password = document.getElementById("inputPassword").value;
                
    var newJSON = JSON.stringify(obj);
    console.log(newJSON);
    ajaxPut("https://evening-fjord-94245.herokuapp.com/allClients/" + CLIENT_PHONE_NUMBER, function(){
        console.log("POST Success"); 
        location.reload();
    }, 
    function(error){
        console.log("POST ERROR"); 
        console.log(error); 
    }, newJSON);
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

    ajaxGet(ROUTE_URL + GET + CLIENT_PHONE_NUMBER, 
        function(testObject){
            console.log("GET SUCCESS");            
            console.log(testObject);
            document.getElementById("lg1").value=testObject[0].clientName;
            document.getElementById("lg2").value=testObject[0].phoneNumber;
            document.getElementById("lg3").value=testObject[0].clientEmail;
            
        },
        function(error){
            console.log("GET ERROR"); 
            console.log(error);
        }); 
}