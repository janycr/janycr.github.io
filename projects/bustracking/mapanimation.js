var map;
var markers = [];

// load map
function init() {
  var myOptions = {
    zoom: 14,
    center: { lat: 42.35335, lng: -71.091525 },
    mapTypeId: google.maps.MapTypeId.ROADMAP,
  };
  var element = document.getElementById("map");
  map = new google.maps.Map(element, myOptions);
  addMarkers();
}

// Add bus markers to map
async function addMarkers() {
  //Clear old markers
  while (markers.length) {
    markers.pop().setMap(null);
  }
  // get bus data
  var locations = await getBusLocations();

  // loop through data, add bus markers
  locations.forEach(function (bus) {
    var marker = getMarker(bus.id);
    if (marker) {
      moveMarker(marker, bus);
    } else {
      addMarker(bus);
    }
    //Get bus location name
    getLocationName(bus.id, bus.attributes.latitude, bus.attributes.longitude);
  });

  // timer
  //console.log(new Date());
  setTimeout(addMarkers, 15000);
}

// Request bus data from MBTA
async function getBusLocations() {
  var url =
    "https://api-v3.mbta.com/vehicles?api_key=&filter[route]=1&include=trip";
  var response = await fetch(url);
  var json = await response.json();
  return json.data;
}

function addMarker(bus) {
  var iconFile = getIcon(bus);
  const icon = {
    url: iconFile, // url
    scaledSize: new google.maps.Size(20, 30), // scaled size
    origin: new google.maps.Point(0, 0), // origin
    anchor: new google.maps.Point(0, 0), // anchor
  };
  var marker = new google.maps.Marker({
    position: {
      lat: bus.attributes.latitude,
      lng: bus.attributes.longitude,
    },
    map: map,
    icon: icon,
    id: bus.id,
  });
  markers.push(marker);
}

function getIcon(bus) {
  // select icon based on bus direction
  if (bus.attributes.direction_id === 0) {
    return "red.png";
  }
  return "blue.png";
}

function moveMarker(marker, bus) {
  // change icon if bus has changed direction
  var icon = getIcon(bus);
  marker.setIcon(icon);

  // move icon to new lat/lon
  marker.setPosition({
    lat: bus.attributes.latitude,
    lng: bus.attributes.longitude,
  });
}

function getMarker(id) {
  var marker = markers.find(function (item) {
    return item.id === id;
  });
  return marker;
}

async function getLocationName(id, lat, lng) {
  var url =
    "https://maps.googleapis.com/maps/api/geocode/json?latlng=" +
    lat +
    "," +
    lng +
    "&sensor=true&key=";
  var response = await fetch(url);
  var json = await response.json();
  var row = '<div class="row">';
  row += '<div class="col-6 borderbox">' + id + "</div>";
  let address = "";
  json.results.forEach((item) => {
    address += " - " + item.formatted_address + "<br>";
  });
  row += '<div class="col-6 borderbox">' + address + "</div>";
  row += "</div>";
  $("#mapaddress").append(row);
}

window.onload = init;
