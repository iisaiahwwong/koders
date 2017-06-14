
// mapboxgl.accessToken = 'pk.eyJ1IjoiaWlzYWlhaHd3b25nIiwiYSI6ImNqM3ZwamI2ZjAwNGcyeG13aHh5cXFmMmsifQ.0DZgOX1YZBm4Y36Cu-CRwQ';
//     var map = new mapboxgl.Map({
//     container: 'mapid',
//     center: [-77.38, 39],
//     zoom: 3,
//     style: 'mapbox://styles/mapbox/dark-v9'
// });


var mymap = L.map('mapid').setView([51.505, -0.09], 13);
var marker = L.marker([51.5, -0.09]).addTo(mymap);


L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
        '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        'Imagery © <a href="http://mapbox.com">Mapbox</a>',
    id: 'mapbox.dark'
}).addTo(mymap);

var circle = L.circle([51.508, -0.11], {
    color: 'red',
    fillColor: '#f03',
    fillOpacity: 0.5,
    radius: 500
}).addTo(mymap);

var polygon = L.polygon([
    [51.509, -0.08],
    [51.503, -0.06],
    [51.51, -0.047]
]).addTo(mymap);

// marker.bindPopup("<b>Hello world!</b><br>I am a popup.").openPopup();
circle.bindPopup("I am a circle.");
polygon.bindPopup("I am a polygon.");

var popup = L.popup()
    .setLatLng([51.5, -0.09])
    .setContent("I am a standalone popup.")
    .openOn(mymap);