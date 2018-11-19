//GLOBAL VARIABLES 
var CLIENT_PHONE_NUMBER; 

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

// var ajaxPost = function(url, onSuccess, onError){
//     var xhttp = new XMLHttpRequest();
//     xhttp.open("POST", url, true);

//     xhttp.setRequestHeader("Content-Type", "application/json");
//     //xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

//     xhttp.onreadystatechange = function() { // Call a function when the state changes.
//         if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
//             // Request finished. Do processing here.
//             var products = JSON.parse(xhttp.responseText); //convert payload to object
//             onSuccess(products);
//         } else if(this.readyState == 4 && this.status == 500) {
//                 onError(xhttp.responseText); 
//         }
//     }

//     //xhttp.send("foo=bar&lorem=ipsum"); 
//     xhttp.send(JSON.stringify(postData)); 
// }

// var ajaxPut = function(url, onSuccess, onError){
//     var xhttp = new XMLHttpRequest(); 
//     xhttp.open("PUT", url, true); 

//     xhttp.setRequestHeader("Content-Type", "application/json"); 

//     xhttp.onreadystatechange = function() {
//         if(this.readyState == 4 && this.status == 200) {
//             var responseObject = JSON.parse(xhttp.responseText); 
//             onSuccess(responseObject); 
//         } else if (this.readyState == 4 && this.status == 500) {
//             onError(xhttp.responseText); 
//         }
//     }

//     xhttp.send(JSON.stringify(putData)); 
// }

// var ajaxDelete = function(url, onSuccess, onError) {
//     var xhttp = new XMLHttpRequest(); 
//     xhttp.open("DELETE", url, true); 

//     xhttp.setRequestHeader("Content-Type", "application/json"); 

//     xhttp.onreadystatechange = function() {
//         if(this.readyState == 4 && this.status == 200) {
//             var responseObject = JSON.parse(xhttp.responseText); 
//             onSuccess(responseObject); 
//         } else if (this.readyState == 4 && this.status == 500) {
//             onError(xhttp.responseText); 
//         }
//     }

//     xhttp.send(JSON.stringify(deleteData)); 
// }

ajaxGet("https://evening-fjord-94245.herokuapp.com/allUnsoldPosts", function(success){
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
    var streetNameText = document.createTextNode("ADDRESS: "+ instance.details[listName].streetName);
    var cityText = document.createTextNode("CITY: "+ instance.details[listName].city);
    var provinceText = document.createTextNode("PROVINCE: "+ instance.details[listName].province);
    var postalCodeText = document.createTextNode("POSTAL CODE: "+ instance.details[listName].postalCode);
    var nBedroomsText = document.createTextNode("NO. OF BEDROOMS: "+ instance.details[listName].bedroom);
    var nBathroomsText = document.createTextNode("NO. OF BATHROOMS: "+ instance.details[listName].bathroom);

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
    if(instance.details[listName].hasOwnProperty('houseNumber')){
        console.log("HOUSE")
        var nHouseNumber = document.createElement("p");
        var nLotSize = document.createElement("p");
        var nHouseNumberText = document.createTextNode("LOT SIZE: "+ instance.details[listName].lotSize);
        var nLotSizeText = document.createTextNode("HOUSE NUMBER: "+ instance.details[listName].houseNumber);
        nHouseNumber.appendChild(nHouseNumberText);
        nLotSize.appendChild(nLotSizeText);
        div2.appendChild(nHouseNumber);
        div2.appendChild(nLotSize);
    }
    else if(instance.details[listName].hasOwnProperty('buildingNumber')){
        var nbuildingNumber = document.createElement("p");
        var napartmentRoomNumber = document.createElement("p");
        var nBuildingNumberText = document.createTextNode("BUILDING NUMBER: "+ instance.details[listName].buildingNumber);
        var napartmentRoomNumberText = document.createTextNode("ROOM NUMBER: "+ instance.details[listName].apartmentRoomNumber);
        nbuildingNumber.appendChild(nBuildingNumberText);
        napartmentRoomNumber.appendChild(napartmentRoomNumberText);
        div2.appendChild(nbuildingNumber);
        div2.appendChild(napartmentRoomNumberText);
    }
    div2.appendChild(pX);

    div1.appendChild(div2);
    // liX.appendChild(div1);

    return div1;
}

function renderListingsAll(container, instance){
    var keys;
    var helperContainer = document.createElement("DIV");
    helperContainer.id = "helperContainer"
	for(keys in instance.details){
		//console.log("print this")
		var cont = renderListings("div", instance, keys);
		helperContainer.appendChild(cont);
    }
    container.appendChild(helperContainer);
}

function filterListings(){
    if(document.getElementById("filterHouse").checked == true){
        ajaxGet("https://evening-fjord-94245.herokuapp.com/unsoldHouses", function(success){
            console.log(success);
            //$("#helperContainer").remove();
            //document.location.reload();
            listings.details = success;
            filterNearby();
            //renderListingsAll(document.getElementById("list"),listings);
        },function(error){
            console.log("ERROR")
        })
    }
    else if(document.getElementById("filterApartment").checked == true){
        ajaxGet("https://evening-fjord-94245.herokuapp.com/unsoldApts", function(success){
            console.log(success);
           // $("#helperContainer").remove();
            //document.location.reload();
            listings.details = success;
            filterNearby();
            //renderListingsAll(document.getElementById("list"),listings);
        },function(error){
            console.log("ERROR")
        })
    }
    else{
        ajaxGet("https://evening-fjord-94245.herokuapp.com/allUnsoldPosts", function(success){
            console.log(success);
            //filterNearby();
            //document.location.reload();
            listings.details = success;
            filterNearby();
            //renderListingsAll(document.getElementById("list"),listings);
        },function(error){
            console.log("ERROR")
        })
    }
}

function resetFilter(){
    document.getElementById("filterBoth").checked = true;
    document.getElementById("filterNearbyRestaurant").checked = false;
    document.getElementById("filterNearbyGym").checked = false;
    document.getElementById("filterNearbyMall").checked = false;
    filterListings();
}


function filterNearby(){
    var counter = 0 ;
    var counter1 = 0;
    var nearbyCondition = [];
    var tempNearbyList = {};
    var tempListingDetails = {};
    var endPoints ="facilities";
    if(document.getElementById("filterNearbyRestaurant").checked == true){
        document.getElementById("filterAll").checked = false;
        nearbyCondition.push("Restaurant");}
    if(document.getElementById("filterNearbyGym").checked == true){
        document.getElementById("filterAll").checked = false;
        nearbyCondition.push("Gym");}
    if(document.getElementById("filterNearbyMall").checked == true){
        document.getElementById("filterAll").checked = false;
        nearbyCondition.push("Mall");}
    if(document.getElementById("filterAll").checked == true){
        document.getElementById("filterNearbyRestaurant").checked = false;
        document.getElementById("filterNearbyGym").checked = false;
        document.getElementById("filterNearbyMall").checked = false;
        nearbyCondition = [];
        ajaxGet("https://evening-fjord-94245.herokuapp.com/postsNearAllFacilityType" , function(success){
            //tempNearbyList = success;
            listings.details =success;
            console.log(success);
            $("#helperContainer").remove();
            renderListingsAll(document.getElementById("list"),listings);
        },function(error){
            console.log("ERROR")
        })  
    }
    ajaxGet("https://evening-fjord-94245.herokuapp.com/facilities", function(success){
            //tempNearbyList = success;
            for(var i = 0; i<nearbyCondition.length; i++){
                for(var keys in success){
                    if(success[keys].type == nearbyCondition[i]){
                        tempNearbyList[counter] = success[keys].listingID;
                        counter++;
                    }
                }
            }if(nearbyCondition.length != 0){
            tempListingDetails = listings.details;
            listings.details = {}
            for (var key1 in tempNearbyList){
                for(var key2 in tempListingDetails){
                    console.log("COMPARING" + tempListingDetails[key2].listingID + " + " +  tempNearbyList[key1])
                    if(tempListingDetails[key2].listingID == tempNearbyList[key1]){
                        listings.details[counter1] = tempListingDetails[key2]
                        counter1++;
                    }
                }
            }}
            console.log(listings.details);
            $("#helperContainer").remove();
            renderListingsAll(document.getElementById("list"),listings);
        },function(error){
            console.log("ERROR")
        })}


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

    ajaxGet(ROUTE_URL + ALL_POSTS + "/59727", 
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