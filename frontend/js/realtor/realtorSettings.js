//GLOBAL VARIABLES 
var REALTOR_NUMBER; 


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



}