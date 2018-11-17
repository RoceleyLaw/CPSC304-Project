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


}