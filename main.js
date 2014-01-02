
var OSMMQUrl = 'http://{s}.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png';
var OSMMQ = L.tileLayer(OSMMQUrl, {minZoom: 1, maxZoom: 18, 
            subdomains: ["otile1", "otile2", "otile3", "otile4"]})

var map = L.map('map', { zoomControl:false, attributionControl:false});
map.setView([47.09, -1.28], 14);

OSMMQ.addTo(map);

function loadData() {
	$.getJSON("data/points.geojson", function (data) {
		// Populate the table
		var table_body = "<table class='table table-bordered table-hover'><thead><tr><th style='min-width: 33px;''>N°</th><th>Libellé</th><th>Site / Matériel</th><th>Détails</th><th>Service</th><th>Demandeur</th><th>Date de création</th><th>Statut</th></tr></thead>";
		//var markers = L.markerClusterGroup({showCoverageOnHover: false});
		var markers = L.layerGroup();
		for (var i in data.features) {
			var f = data.features[i];
			var table_row = "";
			var id = "";
			for (var j in f.properties) {
				table_row += "<td>" + f.properties[j] + "</td>";
				id = f.properties.id
			}
			table_body += "<tr id=" + 10000 + id + " onmouseover='map._layers[ " + 10000 + id +"].openPopup();''>"+table_row+"</tr>";   
			//table_body += "<tr id=" + 10000 + id + " onmouseover='console.log(" + 10000 + id + ");'>"+table_row+"</tr>";   
			var marker = new L.marker(new L.LatLng(f.geometry.coordinates[1], f.geometry.coordinates[0]), { title: f.properties.nom });
			marker._leaflet_id = '10000' + id;
			marker.bindPopup(f.properties.description);
			markers.addLayer(marker);
		}
		$("#table").html(table_body+"</table>");
		map.addLayer(markers);
		map.on('popupopen', function (e) {
		  $("tr#" + e.popup._source._leaflet_id).css("background", "#f5f5f5");
		});
		map.on('popupclose', function (e) {
		  $("tr#" + e.popup._source._leaflet_id).css("background", "#fff");
		});

	});
}

loadData();