$(function () {
    var map = L.map('map').setView([43.6532, -79.3832], 11);

    L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap &copy; CartoDB',
        subdomains: 'abcd',
        maxZoom: 19
    }).addTo(map);

    // Get the Locations from the SensorThings server
    axios.get('http://toronto-bike-snapshot.sensorup.com/v1.0/Locations').then(function (success) {

       // Convert the Locations into GeoJSON Features
        var geoJsonFeatures = success.data.value.map(function(location) {
            return {
                type: 'Feature',
                geometry: location.location
            };
        });

        var geoJsonLayerGroup = L.geoJSON(geoJsonFeatures, {

            // Change the default marker to a circle
            pointToLayer: function (geoJsonPoint, latlng) {
                return L.circleMarker(latlng);
            }

        });

        geoJsonLayerGroup.addTo(map);

        // Zoom in the map so that it fits the Locations
        map.fitBounds(geoJsonLayerGroup.getBounds());

        map.attributionControl.addAttribution("Contains information licensed under the Open Government Licence – Toronto.");
    });

});

