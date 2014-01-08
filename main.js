var OSMMQUrl = 'http://{s}.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png';
var OSMMQ = L.tileLayer(OSMMQUrl, {minZoom: 1, maxZoom: 18, 
            subdomains: ["otile1", "otile2", "otile3", "otile4"]})

var map = L.map('map', { zoomControl:false, attributionControl:false});
map.setView([47.09, -1.28], 14);

OSMMQ.addTo(map);

var expected_keys = { "id": true, "libelle": true, "nom": true, "description": true, "service": true, "demandeur": true, "date": true, "statut": true };
var displayed_sites = [];

function loadData() {
	$.getJSON("data/points.geojson", function (data) {
		// Populate the table
		var table_body = "<table class='table table-bordered table-hover'><thead><tr><th style='min-width: 33px;''>N°</th><th>Libellé</th><th>Site / Matériel</th><th>Détails</th><th>Service</th><th>Demandeur</th><th>Date de création</th><th>Statut</th></tr></thead>";
		var markers = L.layerGroup();
    	$.each(data.features, function() {
			var table_row = "";
			var id = this.properties.id;
			var inter = this;
			$.each(this.properties, function(k , v) {
				if (( k in expected_keys ) && expected_keys[k] ) {
					table_row += "<td>" + v + "</td>";
				}
			})
			if (displayed_sites.indexOf(this.properties.site) == -1) {
				// This is a new site
				var site = this.properties.site;
				displayed_sites.push(site);
			    $.getJSON("data/site" + site + ".geojson", function(data) {
			       	var marker = new L.marker(new L.LatLng(data.features[0].geometry.coordinates[1], data.features[0].geometry.coordinates[0]), { title: data.features[0].properties.nom });
					var popupContent = "<img src='data/img/" + data.features[0].properties.img + "'' width='60' style='margin: 5px;'>"
									 + "<h5 style='display: inline;'>" + data.features[0].properties.nom + "</h5>"
									 + "<table class='table table-bordered'>"
									 + "<thead><tr><th style='min-width: 33px';>N°</th><th>Intervention</th><th>Durée</th><th>Avancement</th></tr></thead>";
					var popupContentBody = "";
					$.getJSON("data/intersite" + site + ".json", function(data) {
						popupContentBody = "<tbody>" 
						for (var i = 0; i < data.features.length; i++) {
						    popupContentBody += "<tr><td>" + data.features[i].properties.id + "</td>"
											 + "<td>" + data.features[i].properties.libelle + "</td>"
											 + "<td>" + data.features[i].properties.duree + "</td>"
											 + "<td>" + data.features[i].properties.avancement + "</td></tr>";
						}
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
						marker._leaflet_id = '10000' + site;
						markers.addLayer(marker);
					});
				});
			}
			table_body += "<tr class=" + 10000 + this.properties.site + " onmouseover='map._layers[ " + 10000 + this.properties.site +"].openPopup();''>"+table_row+"</tr>";   
			map.addLayer(markers);
		})
		$("#table").html(table_body+"</table>");
		map.on('popupopen', function (e) {
		  $("tr." + e.popup._source._leaflet_id).css("background", "#f5f5f5");
		});
		map.on('popupclose', function (e) {
		  $("tr." + e.popup._source._leaflet_id).css("background", "#fff");
		});

	});
}

loadData();


