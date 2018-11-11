//testing request

var ROUTE_URL = "https://evening-fjord-94245.herokuapp.com/allpersons";

var postData = {
    PersonID : 50, 
    LastName : "Sam", 
    FirstName : "Will", 
    DetailAddress : "ws@gmail.com",
    City : "Burnaby"
}

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

var ajaxPost = function(url, onSuccess, onError){
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", url, true);

    xhttp.setRequestHeader("Content-Type", "application/json");
    //xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    xhttp.onreadystatechange = function() { // Call a function when the state changes.
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            // Request finished. Do processing here.
            var products = JSON.parse(xhttp.responseText); //convert payload to object
            onSuccess(products);
        }
    }

    //xhttp.send("foo=bar&lorem=ipsum"); 
    xhttp.send(JSON.stringify(postData)); 
}


window.onload = function() {
    ajaxGet(ROUTE_URL, 
        function(testObject){
            console.log(testObject);
        },
        function(error){
            console.log(error);
        }); 


    //"http://httpbin.org/post"
    ajaxPost("https://evening-fjord-94245.herokuapp.com/new", 
            function(returnObject){
                console.log(returnObject);
            }, 
            function(error){
                console.log(error); 
            }); 
}