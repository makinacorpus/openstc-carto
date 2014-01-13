var OSMMQUrl = 'http://{s}.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png';
var OSMMQ = L.tileLayer(OSMMQUrl, {minZoom: 1, maxZoom: 18, 
            subdomains: ["otile1", "otile2", "otile3", "otile4"]})

var map = L.map('map', { zoomControl:false, attributionControl:false});
map.setView([47.09, -1.28], 14);

OSMMQ.addTo(map);

var expected_keys = { "id": true, "libelle": true, "nom": true, "description": true, "service": true, "demandeur": true, "date": true, "statut": true };
var displayed_sites = [];

var redIcon = L.icon({
    iconUrl: 'images/marker-red.png',
    iconSize: [25, 41], 
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
});

function loadData() {
	$.getJSON("data/arbres.geojson", function (data) {
		// Populate the table
		var markers = L.layerGroup();
    	$.each(data.features, function() {
			var id = this.properties.id;
			var inter = this;
			var marker = new L.marker(new L.LatLng(this.geometry.coordinates[1], this.geometry.coordinates[0]), { title: this.properties.ESSENCE });
			var popupContent = "<h5 style='display: inline;'>" + this.properties.ID_INTRAGE + " : " + this.properties.ESSENCE + "</h5>"
							 + "<table class='table table-bordered'>"
							 + "<thead><tr><th style='min-width: 33px';>N°</th><th>Intervention</th><th>Date</th><th>Durée</th><th>Avancement</th></tr></thead>";
			var popupContentBody = "";
			popupContentBody = "<tbody>" 
			popupContentBody += this.properties.inter1;
			if (this.properties.inter2 != null) {
				popupContentBody += this.properties.inter2;
			};
			popupContentBody += "</tbody>";
			popupContent += popupContentBody + "</table>";
			popupContent += "<button class='btn btn-primary' data-toggle='modal' data-target='#modalForm'>Nouvelle intervention</button>";
		    var popupOptions =
		    {
		        minWidth: 'auto',
		        closeButton: false
		    };
			marker.bindPopup(popupContent, popupOptions);
			marker.on('mouseover', marker.openPopup.bind(marker));
			marker._leaflet_id = this.properties.ID_INTRAGE;
			if (this.properties.ID_INTRAGE == "1888662" || this.properties.ID_INTRAGE == "1891059") {
				marker.setIcon(redIcon);
			};
			markers.addLayer(marker);
			map.addLayer(markers);
		})
		map.on('popupopen', function (e) {
		  $("tr." + e.popup._source._leaflet_id).css("background", "#f5f5f5");
		});
		map.on('popupclose', function (e) {
		  $("tr." + e.popup._source._leaflet_id).css("background", "#fff");
		});

	});
}

loadData();


