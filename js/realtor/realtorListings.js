//GLOBAL VARIABLES 
var REALTOR_NUMBER; 
var POSTAL_CODES=[];
var PHONE_NO =[];

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

ajaxGet("https://evening-fjord-94245.herokuapp.com/postalcodes", function(success){
    for(var keys in success){
        POSTAL_CODES.push(success[keys].postalCode);
    }
    populateDropDownPC();
    console.log("SUCCESS GET POSTAL CODE")
}, function(error){
    console.log("Failed")
    POSTAL_CODES = null;
});


ajaxGet("https://evening-fjord-94245.herokuapp.com/allClients", function(success){
    for(var keys in success){
        PHONE_NO.push(success[keys].phoneNumber);
    }
    populateDropDownPhone();
    console.log("SUCCESS GET PHONE NO");
}, function(error){
    console.log("Failed")
    PHONE_NO = null;
});

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
    var streetNameText = document.createTextNode("ADDRESS: "+ instance.details[listName].streetName);
    var cityText = document.createTextNode("CITY: "+ instance.details[listName].city);
    var provinceText = document.createTextNode("PROVINCE: "+ instance.details[listName].province);
    var postalCodeText = document.createTextNode("POSTAL CODE: "+ instance.details[listName].postalCode);
    var nBedroomsText = document.createTextNode("NO. OF BEDROOMS: "+ instance.details[listName].bedroom);
    var nBathroomsText = document.createTextNode("NO. OF BATHROOMS: "+ instance.details[listName].bathroom);

    var ids = instance.details[listName].listingID;

    var buttonDelete= document.createElement("BUTTON");
    buttonDelete.setAttribute("class", "btn btn-primary")
    buttonDelete.setAttribute("onclick", "deleteListings(" + ids + ")");
    var buttonDeleteText = document.createTextNode("Delete");
    buttonDelete.appendChild(buttonDeleteText);

    var buttonSold= document.createElement("BUTTON");
    buttonSold.setAttribute("class", "btn btn-danger");

    buttonSold.setAttribute("data-toggle", "modal");
    buttonSold.setAttribute("onclick", "soldListingsSetUp(" + ids + ")");
    buttonSold.setAttribute("data-target","#soldModal");
    var buttonSoldText = document.createTextNode("Sold");
    buttonSold.appendChild(buttonSoldText);

    var buttonEdit= document.createElement("BUTTON");
    buttonEdit.setAttribute("class", "btn btn-primary");
    buttonEdit.setAttribute("onclick", "editListingsGet(" + ids + ")");
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
    
    if(instance.details[listName].hasOwnProperty('houseNumber')){
        console.log("HOUSE")
        var nHouseNumber = document.createElement("p");
        var nLotSize = document.createElement("p");
        var nHouseNumberText = document.createTextNode("LOT SIZE: "+ instance.details[listName].lotSize);
        var nLotSizeText = document.createTextNode("HOUSE NUMBER:  "+ instance.details[listName].houseNumber);
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
    div2.appendChild(buttonDelete);
    div2.appendChild(buttonSold);
    div2.appendChild(buttonEdit);
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

function createNewListings(){
    var obj = new Object();
    var endPoint;
    obj.listedPrice = document.getElementById("inputListedPrice").value;
    obj.streetName = document.getElementById("inputStreetName").value;
    obj.postalCode = document.getElementById("selectPostalCode").value;
    obj.city = document.getElementById("inputCity").value;
    obj.province = document.getElementById("inputProvince").value;
    obj.bathroom = document.getElementById("inputBathrooms").value;
    obj.bedroom = document.getElementById("inputBedrooms").value;
    if(document.getElementById("house").checked == true){
        obj.houseNumber = document.getElementById("inputHouseNumber").value;
        obj.lotSize = document.getElementById("inputLotSize").value;
        endPoint = "/allHouses";
    }
    else if(document.getElementById("appart").checked == true){
        obj.buildingNumber =document.getElementById("inputBuildingNumber").value;
        obj.apartmentRoomNumber = document.getElementById("inputHouseNumber").value;
        endPoint = "/allApts";
    }
    else{endPoint = "/addNewPost";}
    var randomID = Math.floor((Math.random() * 10000000) + 10000);
    obj.listingID = randomID;
    obj.licenseNumber = REALTOR_NUMBER; //Hardcoded for now
    obj.pictureURL = "http://dummyimage.com/165x107.jpg/5fa2dd/ffffff";

    var newJSON = JSON.stringify(obj);

    console.log(newJSON);

    ajaxPost("https://evening-fjord-94245.herokuapp.com" + endPoint, 
    function(returnObject){
        console.log("POST SUCCESS"); 
        console.log(returnObject);
       // var divRem = document.getElementById("list");
        ajaxGet(ROUTE_URL + "/allUnsoldPosts" , 
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


function deleteListings(id){
    var obj = new Object()
    obj.listingID = id;
    var delJSON = JSON.stringify(obj);
    console.log(delJSON);
    ajaxDelete("https://evening-fjord-94245.herokuapp.com/allposts/" + id, function(returnObject){
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

function getParentNode(){
    console.log()
}

var globalID, globalistedPrice,globalstreetname, globalpostalCode, globalcity, globalprovince, globalbathroom,globalbedroom;
var globalSoldNodeId;

function editListingsGet(id){
    console.log(id);
    var getInfo ;
    ajaxGet(ROUTE_URL + ALL_POSTS + '/' + id, 
        function(testObject){
            getInfo = testObject;
            document.getElementById("editListedPrice").value = getInfo[0].listedPrice;
            document.getElementById("editStreetName").value = getInfo[0].streetName;
            document.getElementById("editPostalCode").value = getInfo[0].postalCode;
            document.getElementById("editCity").value = getInfo[0].city;
            document.getElementById("editProvince").value = getInfo[0].province;
            document.getElementById("editBathrooms").value = getInfo[0].bathroom;
            document.getElementById("editBedrooms").value = getInfo[0].bedroom;
            globalID = id; 
            console.log(getInfo[0]);
        },
        function(error){
            console.log("GET ERROR"); 
            console.log(error);
        });
    }

function editListingsUpdate(){
        var obj = new Object();
        obj.listedPrice = document.getElementById("editListedPrice").value;
        obj.streetName = document.getElementById("editStreetName").value;
        obj.postalCode = document.getElementById("editPostalCode").value;
        obj.city = document.getElementById("editCity").value;
        obj.province = document.getElementById("editProvince").value;
        obj.bathroom = document.getElementById("editBathrooms").value;
        obj.bedroom = document.getElementById("editBedrooms").value;
        //var randomID = Math.floor((Math.random() * 10000000) + 10000);
        obj.listingID = globalID;
        obj.licenseNumber = REALTOR_NUMBER; //Hardcoded for now
        obj.pictureURL = "http://dummyimage.com/165x107.jpg/5fa2dd/ffffff";
        //console.log(newJSON);
        ajaxPut("https://evening-fjord-94245.herokuapp.com/allposts/"  + globalID,function(success){
            console.log("UPDATED");
            //console.log(newJSON);
            console.log(success); 
            document.location.reload();
            renderListingsAll(document.getElementById("list"),listings);
        },
        function(error){
            console.log("UPDATE FAILED")
        }, obj);
}

function filterListings(){
    if(document.getElementById("filterHouse").checked == true){
        ajaxGet("https://evening-fjord-94245.herokuapp.com/unsoldHouses", function(success){
            console.log(success);
            //$("#helperContainer").remove();
            //document.location.reload();
            listings.details = success;
            console.log(listings.details)
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

function populateDropDownPC(){
    var select = document.getElementById("selectPostalCode"); 

for(var i = 0; i < POSTAL_CODES.length; i++) {
    var opt = POSTAL_CODES[i];
    var el = document.createElement("option");
    el.textContent = opt;
    el.value = opt;
    select.appendChild(el);
}
}

function populateDropDownPhone(){
    var select = document.getElementById("selectPhoneNumber"); 

for(var i = 0; i < PHONE_NO.length; i++) {
    var opt = PHONE_NO[i];
    var el = document.createElement("option");
    el.textContent = opt;
    el.value = opt;
    select.appendChild(el);
}
}

function resetFilter(){
    document.getElementById("filterBoth").checked = true;
    document.getElementById("filterNearbyRestaurant").checked = false;
    document.getElementById("filterNearbyGym").checked = false;
    document.getElementById("filterNearbyMall").checked = false;
    document.getElementById("filterAll").checked = false;
    filterListings();
}


function filterNearby(){
    var counter = 0 ;
    var counter1 = 0;
    var nearbyCondition = [];
    var tempNearbyList = {};
    var tempListingDetails = {};
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
        document.getElementById("filterNearbyRestaurant").disabled = true;
        document.getElementById("filterNearbyGym").disabled = true;
        document.getElementById("filterNearbyMall").disabled = true;
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
function soldListingsSetUp(id){
    globalSoldNodeId = id;
}

function soldListings(){
    var obj = new Object();
    obj.finalPrice = document.getElementById("soldFinalPrice").value;
    obj.soldDate = document.getElementById("soldDate").value;
    obj.completionDate = document.getElementById("soldCompletionDate").value;
    obj.phoneNumber = document.getElementById("selectPhoneNumber").value;
    obj.listingID = globalSoldNodeId;
    obj.licenseNumber = REALTOR_NUMBER;
    var newJSON = JSON.stringify(obj);
    ajaxPost("https://evening-fjord-94245.herokuapp.com/soldlistings", 
    function(returnObject){
        console.log("SOLD SUCCESS"); 
        console.log(returnObject);
        var removeThis = document.getElementById(globalSoldNodeId);
        removeThis.remove();
    }, 
    function(error){
        console.log("SOLD ERROR"); 
        console.log(error); 
    }, newJSON);
}


window.onload = function() {
    console.log('Hello')

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

    ajaxGet(ROUTE_URL + "/AllUnsoldPosts" , 
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