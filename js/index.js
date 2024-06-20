

let menuToggle = document.querySelector(".menu-toggle");
let mobileNavigation = document.querySelector(".mobile-navigation");
let searchInput = document.querySelector("#search");
let today = document.querySelector(".today");
let secondDay = document.querySelector(".second");
let thirdDay = document.querySelector(".third");

let apiKey = "539bfddfc6a24d50b63162845241806";
const weekDays = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const yearMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

menuToggle.addEventListener("click",function(){
    mobileNavigation.style.transition = "all 0.5s ease";
    mobileNavigation.style.overflow = "hidden";
    mobileNavigation.style.paddingTop = "30px";
    if(mobileNavigation.style.height == "300px"){
        mobileNavigation.style.height = 0;
        mobileNavigation.style.paddingTop = 0;
    }
    else
        mobileNavigation.style.height="300px"; 
});

(function(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition)
    }
})();

function showPosition(position){
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;
    initLocation(latitude,longitude);
}



async function initLocation(latitude,longitude,days =3){
    let response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${latitude},${longitude}&days=${days}`);
    let actualResponse = await response.json();
    showLocation(actualResponse);    
}

async function searchLocation(location, days){
    try{
        let response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}&days=${days}`);
        let actualResponse = await response.json();
        showLocation(actualResponse);
    }
    catch{
        console.log("error");
    }
}

function showLocation(response){
    console.log(response);
    generateDaysInfo(response);
    setTodayInfo(0);
    setNextDay(secondDay,1);
    setNextDay(thirdDay,2);
}

function debounce(func, timeout = 1000){
    let timer;
    return (...args)=>{
        clearTimeout(timer);
        timer = setTimeout(()=>{func.apply(this,args)} ,timeout);
    }
}

function isInputValid(value){
    return value.trim().length > 0;
}

const processChange = debounce((location)=>searchLocation(location,3));

searchInput.addEventListener("input",function(){
    if(isInputValid(searchInput.value))
        processChange(searchInput.value);
});

let daysInfo = [];

function generateDaysInfo(info){
    daysInfo = [];
    let size = info.forecast.forecastday.length;
    for(let i = 0; i < size; ++i){
        daysInfo.push(generateDayObject(info,i));
    }
}


function generateDayObject(info,idx){
    let dayInfo = {
        day: "",
        date: "",
        month: "",
        location: "",
        maxTemp: "",
        minTemp: "",
        currTemp: "",
        icon: "",
        status: ""
    }
    dayInfo.day= getDay(info,idx);
    dayInfo.date= getDate(info,idx);
    dayInfo.month= getMonth(info,idx);
    dayInfo.location = getLocation(info);
    dayInfo.maxTemp = getMaxtemp(info,idx);
    dayInfo.minTemp = getMintemp(info,idx);
    dayInfo.currTemp = getCurrTemp(info);
    dayInfo.icon = (idx == 0) ? getCurrIcon(info): getIcon(info,idx);
    dayInfo.status =(idx == 0)? getCurrStatus(info): getStatus(info,idx);

    return dayInfo;
}

function getDay(info, idx){
    let date = info.forecast.forecastday[idx].date;
    let todayDate = new Date(date);
    return weekDays[todayDate.getDay()];
}

function getDate(info, idx){
    return new Date(info.forecast.forecastday[idx].date).getDate(); 
}
function getMonth(info, idx){
    return new Date(info.forecast.forecastday[idx].date).getMonth();
}

function getLocation(info){
    let location ={
        name : info.location.name,
        region: info.location.region,
        country: info.location.country
    }
    return location;
}

function getMaxtemp(info, idx){
    return info.forecast.forecastday[idx].day.maxtemp_c;
}

function getMintemp(info, idx){
    return info.forecast.forecastday[idx].day.mintemp_c;
}

function getIcon(info, idx){
    return info.forecast.forecastday[idx].day.condition.icon;
}

function getCurrIcon(info){
    return info.current.condition.icon;
}

function getStatus(info, idx){
    return info.forecast.forecastday[idx].day.condition.text;
}

function getCurrStatus(info){
    return info.current.condition.text;
}

function getCurrTemp(info){
    return info.current.temp_c;
}

function setTodayInfo(idx){
    today.firstElementChild
    .firstElementChild
    .innerHTML = daysInfo[idx].day
    
    today.firstElementChild
    .firstElementChild
    .nextElementSibling
    .innerHTML= daysInfo[idx].date + yearMonths[daysInfo[idx].month];

    today.firstElementChild
    .nextElementSibling
    .firstElementChild.innerHTML=daysInfo[idx].location.name;

    today.firstElementChild.nextElementSibling
    .firstElementChild.nextElementSibling
    .firstElementChild.innerHTML = 
    `${daysInfo[idx].currTemp}<sup>o</sup>C`;

    today.firstElementChild.nextElementSibling
    .firstElementChild.nextElementSibling
    .firstElementChild.nextElementSibling.innerHTML=
    `<img src="https:${daysInfo[idx].icon}" alt="status">`;

    today.firstElementChild.nextElementSibling
    .firstElementChild.nextElementSibling
    .nextElementSibling.innerHTML=daysInfo[idx].status;
}

function setNextDay(parentElement,idx){
    parentElement.querySelector('.day').innerHTML = daysInfo[idx].day;

    parentElement.querySelector('.forecast-icon').innerHTML =
        `<img src="https:${daysInfo[idx].icon}" alt="status">`;

    parentElement.querySelector('.max-temp').innerHTML = daysInfo[idx].maxTemp;

    parentElement.querySelector('.min-temp').innerHTML = daysInfo[idx].minTemp;

    parentElement.querySelector('.status').innerHTML = daysInfo[idx].status;

}


