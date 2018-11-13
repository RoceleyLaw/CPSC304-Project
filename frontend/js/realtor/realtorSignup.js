
var ROUTE_URL = "https://evening-fjord-94245.herokuapp.com";
var POSTS = "/allRealtors"; 
var dummy= function(){
    console.log("dummy");
}

var ajaxPost = function(url, onSuccess, onError, jsonString){
    console.log("in ajax");
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

function createNewRealtorAccount(){
    console.log("hello");
    var obj = new Object();
    obj.name = document.getElementById("inputName").value;
    obj.phoneNumber = document.getElementById("inputPhoneNumber").value;
    obj.realtorLicenseNumber = document.getElementById("inputRealtorLicenseNumber").value;
    obj.email = document.getElementById("inputEmail").value;
    obj.password = document.getElementById("inputPassword").value;
                
    var newJSON = JSON.stringify(obj);
    console.log("dummy");
    dummy();

    ajaxPost("https://evening-fjord-94245.herokuapp.com/allRealtors", 
    function(){
        console.log("POST Success"); 
        window.location.assign("../../index.html");
    }, 
    function(error){
        console.log("POST ERROR"); 
        console.log(error); 
    }, newJSON);
    console.log("after");
}
