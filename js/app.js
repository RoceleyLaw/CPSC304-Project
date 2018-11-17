//ROUTES 
var ROUTE_URL = "https://evening-fjord-94245.herokuapp.com";
var ALL_PERSONS = "/allpersons"; 
var ALL_POSTS = "/allposts"; 


//TESTING SERVERS (NOT FOR THIS PROJECT)
var TEST_POST = "http://httpbin.org/post"; 
var TEST_PUT = "http://httpbin.org/put";
var TEST_DELETE = "http://httpbin.org/delete";  

//TEST DATA TO POST AND PUT
var postData = {
    PersonID : 50, 
    LastName : "Sam", 
    FirstName : "Will", 
    DetailAddress : "ws@gmail.com",
    City : "Burnaby"
}
var putData = {
    listingID: "68717",
    listedPrice: 1607638,
    postalCode: "01129",
    pictureURL: "http://dummyimage.com/236x226.jpg/5fa2dd/ffffff",
    bedroom: 100,
    bathroom: 1,
    licenseNumber: "9737702"
}

/*
    GET 
*/
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

/*
    POST
*/
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
        } else if(this.readyState == 4 && this.status == 500) {
                onError(xhttp.responseText); 
        }
    }

    //xhttp.send("foo=bar&lorem=ipsum"); 
    xhttp.send(JSON.stringify(postData)); 
}

/*
    PUT
*/
var ajaxPut = function(url, onSuccess, onError){
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

    xhttp.send(JSON.stringify(putData)); 
}


/*
    DELETE
*/
var ajaxDelete = function(url, onSuccess, onError) {
    var xhttp = new XMLHttpRequest(); 
    xhttp.open("DELETE", url, true); 

    xhttp.withCredentials = false; 

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


/*
    call methods to test them 
*/
window.onload = function() {
    ajaxGet(ROUTE_URL + ALL_POSTS, 
        function(testObject){
            console.log("GET SUCCESS"); 
            console.log(testObject);
        },
        function(error){
            console.log("GET ERROR"); 
            console.log(error);
        }); 


    ajaxPost("https://evening-fjord-94245.herokuapp.com/new", 
            function(returnObject){
                console.log("POST SUCCESS"); 
                console.log(returnObject);
            }, 
            function(error){
                console.log("POST ERROR"); 
                console.log(error); 
            });
            
    ajaxPut(
            //TEST_PUT, 
            ROUTE_URL + ALL_POSTS + "/68717",
            function(smth){
                console.log("PUT SUCCESS"); 
                console.log(smth);
            }, 
            function(error) {
                console.log("PUT ERROR"); 
                console.log(error); 
            }); 

    ajaxDelete(
                ROUTE_URL + ALL_POSTS + "/97220",
                function(smth){
                    console.log("DELETE SUCCESS");
                    console.log(smth); 
                }, 
                function(error){
                    console.log("DELETE FAIL"); 
                    console.log(error); 
                });
}