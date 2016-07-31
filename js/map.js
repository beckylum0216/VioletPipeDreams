var map;
var kml = {
    		    a: {
    		        name: "Treatment Plants",
    		        url: 'https://github.com/beckylum0216/VioletPipeDreams/blob/master/TreatmentAll.kmz?raw=true'
    		    },
    		    b: {
    		        name: "Recycled Water Usage",
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
var openlayersWMS;

function startup() { 
// for example, this toggles kml b on load and updates the menu selector
var checkit = document.getElementById('a');
checkit.checked = true;
checkit = document.getElementById('b');
checkit.checked = true;
toggleKML(checkit, 'a');
toggleKML(checkit, 'b');
 }
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


       map = new google.maps.Map(document.getElementById('map'), {
         zoom: 11,
         center: {lat: -31.953945, lng: 115.852901}//,
         //mapTypeControl: true
       });
       
       var marker = new google.maps.Marker({
           map: map,
           anchorPoint: new google.maps.Point(0, -29)
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
       createTogglers();

       
       var wmsOptions = {
           alt: "ClaySoil",
           getTileUrl: WMSGetTileUrl,
           isPng: false,
           maxZoom: 17,
           minZoom: 1,
           name: "ClaySoil",
           tileSize: new google.maps.Size(256, 256)

       };
       

       //Creating the object to create the ImageMapType that will call the WMS Layer Options.

       openlayersWMS = new google.maps.ImageMapType(wmsOptions);

       
       //Layers to appear on Map A.  The first string will give the map the map a name in the dropdown and the second object calls the map type

       map.mapTypes.set('ClaySoil', openlayersWMS);
       
      

       //Controling the Layers that appear in Map A.  You can set certain maps to appear in Map A.
       map.setOptions({
           mapTypeControlOptions: {
               mapTypeIds: [
		  'ClaySoil',
		 
		   google.maps.MapTypeId.ROADMAP
		],
               style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
           }
       });

   //Where the initial map type is set.  This can be adjusted as necessary.  The map name in ' ' indicates the default map viewed when the user 
   //visits the page
   map.setMapTypeId('ClaySoil');
   


}

     // easy way to remove all objects
function removeAll() {
	console.log("removing all");
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



//Complete path to OpenLayers WMS layer

 function WMSGetTileUrl(tile, zoom) {
     var projection = window.map.getProjection();
     var zpow = Math.pow(2, zoom);
     var ul = new google.maps.Point(tile.x * 256.0 / zpow, (tile.y + 1) * 256.0 / zpow);
     var lr = new google.maps.Point((tile.x + 1) * 256.0 / zpow, (tile.y) * 256.0 / zpow);
     var ulw = projection.fromPointToLatLng(ul);
     var lrw = projection.fromPointToLatLng(lr);
     //The user will enter the address to the public WMS layer here.  The data must be in WGS84
     var baseURL = "http://www.asris.csiro.au/arcgis/services/TERN/CLY_ACLEP_AU_NAT_C/MapServer/WmsServer?";
     var version = "1.3.0";
     var request = "GetMap";
     var format = "image%2Fjpeg"; //type of image returned  or image/jpeg
     //The layer ID.  Can be found when using the layers properties tool in ArcMap or from the WMS settings 
     var layers = "CLY_000_005_EV_N_P_AU_NAT_C,CLY_005_015_EV_N_P_AU_NAT_C,CLY_015_030_EV_N_P_AU_NAT_C,CLY_030_060_95_N_P_AU_NAT_C,CLY_060_100_95_N_P_AU_NAT_C,CLY_100_200_95_N_P_AU_NAT_C";
     //projection to display. This is the projection of google map. Don't change unless you know what you are doing.  
     //Different from other WMS servers that the projection information is called by crs, instead of srs
     var crs = "EPSG:4326"; 
     //With the 1.3.0 version the coordinates are read in LatLon, as opposed to LonLat in previous versions
     var bbox = ulw.lat() + "," + ulw.lng() + "," + lrw.lat() + "," + lrw.lng();
     var service = "WMS";
     //the size of the tile, must be 256x256
     var width = "256";
     var height = "256";
     //Some WMS come with named styles.  The user can set to default.
     var styles = "default,default,default,default,default,default";
     //Establish the baseURL.  Several elements, including &EXCEPTIONS=INIMAGE and &Service are unique to openLayers addresses.
     var url = baseURL + "Layers=" + layers + "&version=" + version + "&EXCEPTIONS=INIMAGE" + "&Service=" + service + "&request=" + request + "&Styles=" + styles + "&format=" + format + "&CRS=" + crs + "&BBOX=" + bbox + "&width=" + width + "&height=" + height;
     console.log("WMS URL is:");
     console.log(url);
     return url;
 }


