//GLOBAL VARIABLES 
var REALTOR_NUMBER; 
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
var soldListingDetails = function(url){
    this.details = {};
    this.url = url;
}

var soldListings = new soldListingDetails("https://evening-fjord-94245.herokuapp.com");

var addTopRealtorEntry = function(element, info) {
    var tr = document.createElement("tr"); 

    var td; 

    td = document.createElement('td'); 
    td.innerHTML = info[0];
    tr.appendChild(td);  

    td = document.createElement('td'); 
    td.innerHTML = info[1];
    tr.appendChild(td); 

    element.appendChild(tr); 
}

var listAllTopRealtors = function(container, topRealtors) {
    console.log("list appt")
    for(var key in topRealtors){
        var obj = topRealtors[key];
        var info = []; 
        info.push(obj.realtorName); 
        info.push(obj["COUNT(listingID)"]); 
        console.log(info[1]);
        addTopRealtorEntry(container, info);
    }
}

var getToRealtors = function () {
    var smth = document.getElementById("topRealtorBody");
    while(smth.firstChild){
        smth.removeChild(smth.firstChild); 
    }
    ajaxGet("https://evening-fjord-94245.herokuapp.com/sales", 
            function(topRealtors){
                console.log(smth);
                listAllTopRealtors(smth, topRealtors);  
            }, 
            function(error){
                console.log("getting realotr appointments failed"); 
                console.log(error); 
            });

}

// ajaxGet("https://evening-fjord-94245.herokuapp.com/soldlistings/5770319", function(success){
//     console.log(success)
//     soldListings.details  = success;
// }, function(error){
//     console.log("Failed")
//     soldListings.details  = null;
// });

function renderSoldList(container, instance, listName){
    var tbody = document.createElement(container);
    tbody.setAttribute("id", instance.details[listName].listingID)

    var tr = document.createElement("tr");

    var th1 = document.createElement("td");
    var listingsIDVal = document.createTextNode(instance.details[listName].listingID);
    th1.appendChild(listingsIDVal);
    tr.appendChild(th1);

    var th2 = document.createElement("td");
    var listingCompletionDateVal =  document.createTextNode(instance.details[listName].completionDate);
    th2.appendChild(listingCompletionDateVal);
    tr.appendChild(th2);

    var th3 = document.createElement("td");
    var soldDateVal = document.createTextNode(instance.details[listName].soldDate)
    th3.appendChild(soldDateVal);
    tr.appendChild(th3);

    var th4 = document.createElement("td");
    var finalPriceVal = document.createTextNode(instance.details[listName].finalPrice)
    th4.appendChild(finalPriceVal);
    tr.appendChild(th4);

    var th5 = document.createElement("td");
    var cPhoneNumberVal = document.createTextNode(instance.details[listName].phoneNumber)
    th5.appendChild(cPhoneNumberVal);
    tr.appendChild(th5);

   // tbody.appendChild(tr);

    return tr;
}

function renderSoldListAll(container, instance){
    var keys;
	for(keys in instance.details){
		//console.log("print this")
        var cont =  renderSoldList("tbody", instance, keys);
        console.log(cont);
        container.appendChild(cont);
    }
}

window.onload = function() {
    console.log('Sold Listings');

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
    
    getToRealtors();
    ajaxGet("https://evening-fjord-94245.herokuapp.com/soldlistings/" + REALTOR_NUMBER ,
        function(testObject){
            console.log("GET SUCCESS"); 
            console.log(testObject);
            soldListings.details  = testObject;
            renderSoldListAll(document.getElementById("soldTable"),soldListings);
        },
        function(error){
            console.log("GET ERROR"); 
            console.log(error);
            soldListings.details  = null;
        }); 


}