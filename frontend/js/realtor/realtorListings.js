//testing request

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
    test1: "HELLO", 
    test2: "WORLD"
}

var deleteData = {
    test1: "HI", 
    test2: "THERE"
}

var listingDetails = function(url){
    this.details = {};
    this.url = url;
}

var listings = new listingDetails("https://evening-fjord-94245.herokuapp.com");

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

ajaxGet("https://evening-fjord-94245.herokuapp.com/allposts", function(success){
    listings.details = success;
}, function(error){
    console.log("Failed")
    listings.details = null;
});

function renderListings(container, instance, listName){
    // var breaks = document.createElement("br");
    //  var liX = document.createElement(container);
    //  liX.setAttribute("class","row");

    var div1 = document.createElement(container);
    div1.setAttribute("class","col-sm-3");
    div1.setAttribute("id", instance.details[listName].listingID)

    var div2 =document.createElement("DIV");
    div2.setAttribute("class","well");

    var h4X = document.createElement("h4");
    var pX = document.createElement("p");
    var streetName = document.createElement("p");
    var city = document.createElement("p");
    var province = document.createElement("p");
    var postalCode = document.createElement("p");
    var nBedrooms = document.createElement("p");
    var nBathrooms = document.createElement("p");
    var h4XText = document.createTextNode("ID: "+ instance.details[listName].listingID);
    var pXText = document.createTextNode("PRICE: $" + instance.details[listName].listedPrice);
    var streetNameText = document.createTextNode("ADDRESS: "+"--------");
    var cityText = document.createTextNode("CITY: "+"--------");
    var provinceText = document.createTextNode("PROVINCE: "+"--------");
    var postalCodeText = document.createTextNode("POSTAL CODE: "+ instance.details[listName].postalCode);
    var nBedroomsText = document.createTextNode("NO. OF BEDROOMS: "+ instance.details[listName].bedroom);
    var nBathroomsText = document.createTextNode("NO. OF BATHROOMS: "+ instance.details[listName].bathroom);

    var buttonDelete= document.createElement("BUTTON");
    var ids = instance.details[listName].listingID;
    buttonDelete.setAttribute("class", "btn btn-primary")
    buttonDelete.setAttribute("onclick", "deleteListings(" + ids + ")");
    var buttonDeleteText = document.createTextNode("Delete");
    buttonDelete.appendChild(buttonDeleteText);

    var buttonSold= document.createElement("BUTTON");
    buttonSold.setAttribute("class", "btn btn-danger");
    buttonSold.setAttribute("data-toggle", "modal");
    buttonSold.setAttribute("data-target","#soldModal");
    var buttonSoldText = document.createTextNode("Sold");
    buttonSold.appendChild(buttonSoldText);

    var buttonEdit= document.createElement("BUTTON");
    buttonEdit.setAttribute("class", "btn btn-primary");
    buttonEdit.setAttribute("data-toggle", "modal");
    buttonEdit.setAttribute("data-target","#editModal");
    var buttonEditText = document.createTextNode("Edit");
    buttonEdit.appendChild(buttonEditText);

    h4X.appendChild(h4XText);
    pX.appendChild(pXText);
    streetName.appendChild(streetNameText);
    city.appendChild(cityText);
    province.appendChild(provinceText);
    postalCode.appendChild(postalCodeText);
    nBedrooms.appendChild(nBedroomsText);
    nBathrooms.appendChild(nBathroomsText);

    div2.appendChild(h4X);
    div2.appendChild(pX);
    div2.appendChild(streetName);
    div2.appendChild(city);
    div2.appendChild(province);
    div2.appendChild(postalCode);
    div2.appendChild(nBedrooms);
    div2.appendChild(nBathrooms);
    div2.appendChild(pX);
    div2.appendChild(buttonDelete);
    div2.appendChild(buttonSold);
    div2.appendChild(buttonEdit);
    div1.appendChild(div2);
    // liX.appendChild(div1);

    return div1;
}

function renderListingsAll(container, instance){
	var keys;
	for(keys in instance.details){
		//console.log("print this")
		var cont = renderListings("div", instance, keys);
		container.appendChild(cont);
	}
}

function createNewListings(){
    var obj = new Object();
    obj.listedPrice = document.getElementById("inputListedPrice").value;
    obj.streetName = document.getElementById("inputStreetName").value;
    obj.postalCode = document.getElementById("inputPostalCode").value;
    obj.city = document.getElementById("inputCity").value;
    obj.province = document.getElementById("inputProvince").value;
    obj.bathroom = document.getElementById("inputBathrooms").value;
    obj.bedroom = document.getElementById("inputBedrooms").value;
    var randomID = Math.floor((Math.random() * 10000000) + 10000);
    obj.listingID = randomID;
    obj.licenseNumber = "5770319"; //Hardcoded for now
    obj.pictureURL = "http://dummyimage.com/165x107.jpg/5fa2dd/ffffff";

    var newJSON = JSON.stringify(obj);

    console.log(newJSON);

    ajaxPost("https://evening-fjord-94245.herokuapp.com/addNewPost", 
    function(returnObject){
        console.log("POST SUCCESS"); 
        console.log(returnObject);
       // var divRem = document.getElementById("list");
        ajaxGet(ROUTE_URL + ALL_POSTS , 
        function(testObject){
            console.log("GET SUCCESS"); 
            console.log(testObject);
            document.location.reload();
            renderListingsAll(document.getElementById("list"),listings);
        },
        function(error){
            console.log("GET ERROR"); 
            console.log(error);
        }); 
    }, 
    function(error){
        console.log("POST ERROR"); 
        console.log(error); 
    }, newJSON); 
}
// $('.btn btn-primary').on('click', function(){
//     var parent_id = $(this).parent().parent().attr('id');
//     console.log(parent_id);
//    })

function deleteListings(id){
    var obj = new Object()
    obj.listingID = id;
    var delJSON = JSON.stringify(obj);
    console.log(delJSON);
    ajaxDelete("https://evening-fjord-94245.herokuapp.com/allposts/" + id,     function(returnObject){
        console.log("DELETE SUCCESS"); 
        console.log(returnObject);
       // var divRem = document.getElementById("list");
        ajaxGet(ROUTE_URL + ALL_POSTS , 
        function(testObject){
            console.log("GET SUCCESS"); 
            console.log(testObject);
            document.location.reload();
            renderListingsAll(document.getElementById("list"),listings);
        },
        function(error){
            console.log("GET ERROR"); 
            console.log(error);
        }); 
    }, 
    function(error){
        console.log("POST ERROR"); 
        console.log(error); 
    }, delJSON);
}


window.onload = function() {
    console.log('Hello')
    ajaxGet(ROUTE_URL + ALL_POSTS , 
        function(testObject){
            console.log("GET SUCCESS"); 
            console.log(testObject);
            renderListingsAll(document.getElementById("list"),listings);
        },
        function(error){
            console.log("GET ERROR"); 
            console.log(error);
        }); 
}