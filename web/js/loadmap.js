var map;
var markerPosition;
var autoComplete;
var infowindow = new google.maps.InfoWindow();

function initialization() {
    showAllReports();
    //initAutocomplete();
}

function showAllReports() {
    $.ajax({
        url: 'RunQuery.jsp',
        type: 'POST',
        data: { "tab_id": "1"},
        success: function(reports) {
            mapInitialization(reports);
        },
        error: function(xhr, status, error) {
            alert("An AJAX error occured: " + status + "\nError: " + error);
        }
    });
}

function mapInitialization(reports) {

    const styledMapType = new google.maps.StyledMapType(
        [
            //{ elementType: "geometry", stylers: [{ color: "#ebe3cd" }] },
            { elementType: "geometry", stylers: [{ color: "#e6e6e6" }] },
            //{ elementType: "labels.text.fill", stylers: [{ color: "#523735" }] },
            { elementType: "labels.text.fill", stylers: [{ color: "#525151" }] },
            //{ elementType: "labels.text.stroke", stylers: [{ color: "#f5f1e6" }] },
            { elementType: "labels.text.stroke", stylers: [{ color: "#f2f2f2" }] },
            {
                featureType: "administrative",
                elementType: "geometry.stroke",
                //stylers: [{ color: "#c9b2a6" }],
                stylers: [{ color: "#b5b3b1"}],
            },
            {
                featureType: "poi.business",
                stylers: [{ visibility: "off" }],
            },
            {
                featureType: "transit",
                elementType: "labels.icon",
                stylers: [{ visibility: "off" }],
            },
            {
                featureType: "administrative.land_parcel",
                elementType: "geometry.stroke",
                //stylers: [{ color: "#dcd2be" }],
                stylers: [{ color: "#d9d9d9"}],
            },

            {
                featureType: "administrative.land_parcel",
                elementType: "labels.text.fill",
                //stylers: [{ color: "#ae9e90" }],
                stylers: [{ color: "#b0b0b0" }],
            },
            {
                featureType: "landscape.natural",
                elementType: "geometry",
                //stylers: [{ color: "#dfd2ae" }],
                stylers: [{color: "#c9c9c9" }],
            },
            {
                featureType: "poi",
                elementType: "geometry",
                //stylers: [{ color: "#dfd2ae" }],
                stylers: [{color: "#c9c9c9" }],
            },
            {
                featureType: "poi",
                elementType: "labels.text.fill",
                //stylers: [{ color: "#93817c" }],
                stylers: [{ color: "#8f8f8f" }],
            },
            {
                featureType: "poi.park",
                elementType: "geometry.fill",
                //stylers: [{ color: "#a5b076" }],
                stylers: [{ color: "#b0b0b0" }],

            },
            {
                featureType: "poi.park",
                elementType: "labels.text.fill",
                //stylers: [{ color: "#447530" }],
                stylers: [{ color: "#6b6b6b" }],
            },
            {
                featureType: "road",
                elementType: "geometry",
                //stylers: [{ color: "#f5f1e6" }],
                stylers: [{ color: "#f5f5f5" }],
            },
            {
                featureType: "road.arterial",
                elementType: "geometry",
                //stylers: [{ color: "#fdfcf8" }],
                stylers: [{ color: "#ffffff" }],
            },
            {
                featureType: "road.highway",
                elementType: "geometry",
                //stylers: [{ color: "#f8c967" }],
                stylers: [{ color: "#c7c7c7" }],
            },
            {
                featureType: "road.highway",
                elementType: "geometry.stroke",
                //stylers: [{ color: "#e9bc62" }],
                stylers: [{ color: "#9e9d9b" }],
            },
            {
                featureType: "road.highway.controlled_access",
                elementType: "geometry",
                //stylers: [{ color: "#e98d58" }],
                stylers: [{ color: "#adabaa"}],
            },
            {
                featureType: "road.highway.controlled_access",
                elementType: "geometry.stroke",
                //stylers: [{ color: "#db8555" }],
                stylers: [{ color: "#cfcdcc" }],
            },
            {
                featureType: "road.local",
                elementType: "labels.text.fill",
                //stylers: [{ color: "#806b63" }],
                stylers: [{ color: "#858585" }],
            },
            {
                featureType: "transit.line",
                elementType: "geometry",
                //stylers: [{ color: "#dfd2ae" }],
                stylers: [{ color: "#cfcfcf" }],
            },
            {
                featureType: "transit.line",
                elementType: "labels.text.fill",
                //stylers: [{ color: "#8f7d77" }],
                stylers: [{ color: "#8c8c8c" }],
            },
            {
                featureType: "transit.line",
                elementType: "labels.text.stroke",
                //stylers: [{ color: "#ebe3cd" }],
                stylers: [{ color: "#d4d4d4" }],
            },
            {
                featureType: "transit.station",
                elementType: "geometry",
                //stylers: [{ color: "#dfd2ae" }],
                stylers: [{ color: "#d1d1d1" }],
            },
            {
                featureType: "water",
                elementType: "geometry.fill",
                //stylers: [{ color: "#b9d3c2" }],
                stylers: [{ color: "#becee4" }],
            },
            {
                featureType: "water",
                elementType: "labels.text.fill",
                //stylers: [{ color: "#92998d" }],
                stylers: [{ color: "#878787" }],
            },
        ],
        { name: "Styled Map" }
    );

    // Render the map within the empty div
    map = new google.maps.Map(document.getElementById('map-canvas'), {
        mapTypeControlOptions: {
            mapTypeIds: ["roadmap", "satellite", "hybrid", "terrain", "styled_map"]
        }
    });

    //apply map style
    map.mapTypes.set("styled_map", styledMapType);
    map.setMapTypeId("styled_map");

        //set data variables
    const bike_lane = new google.maps.Data({map: map});
    const shared_lane = new google.maps.Data({map: map});
    const path = new google.maps.Data({map: map});
    const trails = new google.maps.Data({map: map});

    bike_lane.loadGeoJson('https://raw.githubusercontent.com/KeHaDo/ATR/main/GBP_BL.geojson');
    bike_lane.setStyle({
        strokeColor: '#248f44',
        strokeWeight: 2,
        strokeOpacity: .50
    });

    shared_lane.loadGeoJson('https://raw.githubusercontent.com/KeHaDo/ATR/main/GBP_SL.geojson');
    shared_lane.setStyle({
        strokeColor: '#248f44',
        strokeWeight: 1,
        strokeOpacity: .30
    });

    path.loadGeoJson('https://raw.githubusercontent.com/KeHaDo/ATR/main/Trails_Existing.geojson');
    path.setStyle({
        strokeColor: '#f15a26',
        strokeWeight: 1,
        strokeOpacity: .25
    });

    trails.loadGeoJson('https://raw.githubusercontent.com/KeHaDo/ATR/main/Trails_Existing.geojson');
    trails.setStyle({
        strokeColor: '#f15a26',
        strokeWeight: 1,
        strokeOpacity: .25
    });



    trails.addListener("mouseover", (event) => {
        map.data.revertStyle();
        map.data.overrideStyle(event.feature, { strokeWeight: 4 });
    });
    bike_lane.addListener("mouseout", (event) => {
        map.data.revertStyle();
    });


    var bounds = new google.maps.LatLngBounds();

    myListener = google.maps.event.addListener(map, 'click', function(event) {
        placeMarker(event.latLng); google.maps.event.removeListener(myListener);

    });

    const centerControlDiv = document.createElement("div");
    CenterControl(centerControlDiv, map);
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(centerControlDiv);

    $.each(reports, function (i, e) {
        var long = Number(e['longitude']);
        var lat = Number(e['latitude']);
        var latlng = new google.maps.LatLng(lat, long);

        bounds.extend(latlng);

        // Create the infoWindow content
        var contentStr = '<h4>Report Details</h4><hr>';
        contentStr += '<p><b>' + 'Report Type' + ':</b>&nbsp' + e['report_type'] +
            '</p>';
        if (e['report_type'] == 'bike' || e['report_type'] == 'pedestrian') {
            contentStr += '<p><b>' + 'Obstruction Type' + ':</b>&nbsp' +
                e['obstruction_type'] + '</p>';
        }
    else
        if (e['report_type'] == 'ADA') {
            contentStr += '<p><b>' + 'Restriction Type' + ':</b>&nbsp' + e['ada_restriction']
                + '</p>';
        }

        contentStr += '<p><b>' + 'Time Reported' + ':</b>&nbsp' +
            e['time_stamp'].substring(0, 19) + '</p>';
        if ('additionalinformation' in e) {
            contentStr += '<p><b>' + 'Detailed Comment' + ':</b>&nbsp' + e['additionalinformation'] + '</p>';
        }



        // Create the icons
        const BikeIcon = {
            url: "images/bike_icon.png",
            scaledSize: new google.maps.Size(25, 25)
        };
        const PedIcon = {
            url: "images/ped_icon.png",
            scaledSize: new google.maps.Size(25, 25)
        };
        const ADAIcon = {
            url: "images/ada_icon.png",
            scaledSize: new google.maps.Size(25, 25)
        };


        //if else to assign icon by report type
        if (e['report_type'] == 'bike') {
            marker(BikeIcon)
        } else if (e['report_type'] == 'pedestrian') {
            marker(PedIcon)
        } else marker(ADAIcon);

        //function for marker by reportType
        function marker(reportType) {
            var marker = new google.maps.Marker({ // Set the marker
                position: latlng, // Position marker to coordinates
                map: map, // assign the market to our map variable
                icon: reportType,
                customInfo: contentStr
            });
            marker.addListener('click', function () {
                // use 'customInfo' to customize infoWindow
                infowindow.setContent(marker['customInfo']);
                map.setZoom(16);
                map.setCenter(marker.getPosition());
                infowindow.open(map, marker); // Open InfoWindow
            });
        }

    });

        map.fitBounds (bounds);

};


function placeMarker(location) {
    var marker = new google.maps.Marker({
        position: location,
        map: map,
        icon: "images/drag.png",
        draggable: true
    });
    marker.addListener("click", () => {
        infowindow.open(map, marker);
    });
    map.setCenter(location);

    const dragString = "Drag to the report location"
    const infowindow = new google.maps.InfoWindow({
        content: dragString,
    });

    var markerPosition = marker.getPosition();
    populateInputs(markerPosition);
    google.maps.event.addListener(marker, "drag", function (mEvent) {
        populateInputs(mEvent.latLng);
    });
}
function populateInputs(pos) {
    document.getElementById("latitude").value=pos.lat()
    document.getElementById("longitude").value=pos.lng()
}


const stlouis = { lat:38.626, lng: -90.233 };

// CenterControl to recenter the map on St. Louis
function CenterControl(controlDiv, map) {
    // Set CSS for the control border.
    const controlUI = document.createElement("div");
    controlUI.style.backgroundColor = "#fff";
    controlUI.style.border = "2px solid #fff";
    controlUI.style.borderRadius = "3px";
    controlUI.style.boxShadow = "0 2px 6px rgba(0,0,0,.3)";
    controlUI.style.cursor = "pointer";
    controlUI.style.marginBottom = "22px";
    controlUI.style.textAlign = "center";
    controlUI.title = "Click to recenter the map";
    controlDiv.appendChild(controlUI);
    // Set CSS for the control interior.
    const controlText = document.createElement("div");
    controlText.style.color = "rgb(25,25,25)";
    controlText.style.fontFamily = "Roboto,Arial,sans-serif";
    controlText.style.fontSize = "16px";
    controlText.style.lineHeight = "38px";
    controlText.style.paddingLeft = "5px";
    controlText.style.paddingRight = "5px";
    controlText.innerHTML = "Center Map";
    controlUI.appendChild(controlText);
    // Setup the click event listeners: simply set the map to Chicago.
    controlUI.addEventListener("click", () => {
        map.setCenter(stlouis);
    });
}

//Execute our 'initialization' function once the page has loaded.
google.maps.event.addDomListener(window, 'load', initialization);