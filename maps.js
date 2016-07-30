function geolocate() {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
            var geolocation = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            var circle = new google.maps.Circle({
              center: geolocation,
              radius: position.coords.accuracy
            });
            autocomplete.setBounds(circle.getBounds());
          });
        }
      }
function initMap() {
       autocomplete = new google.maps.places.Autocomplete(
            /** @type {!HTMLInputElement} */(document.getElementById('autocomplete')),
            {types: ['geocode']});
        var infowindow = new google.maps.InfoWindow();
        var marker = new google.maps.Marker({
          map: map,
          anchorPoint: new google.maps.Point(0, -29)
        });

       var map = new google.maps.Map(document.getElementById('map'), {
         zoom: 11,
         center: {lat: -31.953945, lng: 115.852901},
         mapTypeControl: true
       });
       autocomplete.addListener('place_changed', function() {
          infowindow.close();
          marker.setVisible(false);
          var place = autocomplete.getPlace();
          if (!place.geometry) {
            window.alert("Autocomplete's returned place contains no geometry");
            return;
          }

          // If the place has a geometry, then present it on a map.
          if (place.geometry.viewport) {
            map.fitBounds(place.geometry.viewport);
          } else {
            map.setCenter(place.geometry.location);
            map.setZoom(17);  // Why 17? Because it looks good.
          }
          marker.setIcon(/** @type {google.maps.Icon} */({
            url: place.icon,
            size: new google.maps.Size(71, 71),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(17, 34),
            scaledSize: new google.maps.Size(35, 35)
          }));
          marker.setPosition(place.geometry.location);
          marker.setVisible(true);
 infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + address);
          infowindow.open(map, marker);
        });


}
var kml = {
    a: {
        name: "Treatment Plants",
        url: 'https://github.com/beckylum0216/VioletPipeDreams/blob/master/TreatmentAll.kmz?raw=true'
    },
    b: {
        name: "Grey Water Useage",
        url: 'https://github.com/beckylum0216/VioletPipeDreams/blob/master/Reclamation_all.kmz?raw=true'
    },
    c: {
        name: "Treatment Ponds",
        url: 'https://github.com/beckylum0216/VioletPipeDreams/blob/master/TreatmentPond.kmz?raw=true'
    },
    d: {
        name: "Disposal Ponds",
        url: 'https://github.com/beckylum0216/VioletPipeDreams/blob/master/DisposalPond.kmz?raw=true'
    }
// keep adding more if ye like 
};
     // easy way to remove all objects
function removeAll() {
    for (var prop in kml) {
        if (kml[prop].obj) {
            kml[prop].obj.setMap(null);
            delete kml[prop].obj;
        }

    }
};
// the important function... kml[id].xxxxx refers back to the top 
function toggleKML(checked, id) {

    if (checked) {

        var layer = new google.maps.KmlLayer(kml[id].url, {
            preserveViewport: true 
        });
        // store kml as obj
        kml[id].obj = layer;
        kml[id].obj.setMap(map);
    }
    else {
        kml[id].obj.setMap(null);
        delete kml[id].obj;
    }

};
// create the controls dynamically because it's easier, really
function createTogglers() {

    var html = "<form><ul>";
    for (var prop in kml) {
        html += "<li id=\"selector-" + prop + "\"><input type='checkbox' id='" + prop + "'" +
        " onclick='highlight(this,\"selector-" + prop + "\"); toggleKML(this.checked, this.id)' \/>" +
        kml[prop].name + "<\/li>";
    }
    html += "<li class='control'><a href='#' onclick='removeAll();return false;'>" +
    "Remove all layers<\/a><\/li>" + 
    "<\/ul><\/form>";

    document.getElementById("toggle_box").innerHTML = html;
};

// Append Class on Select
function highlight(box, listitem) {
    var selected = 'selected';
    var normal = 'normal';
    document.getElementById(listitem).className = (box.checked ? selected: normal);
};
function startup() { 
// for example, this toggles kml b on load and updates the menu selector
var checkit = document.getElementById('b');
checkit.checked = true;
toggleKML(checkit, 'b');
highlight(checkit, 'selector1');
 }
 