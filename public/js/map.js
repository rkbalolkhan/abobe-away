mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: "map", // container ID
  center: coOrdinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
  zoom: 9, // starting zoom
});

const marker = new mapboxgl.Marker({ color: "#FF385C" })
  .setLngLat(coOrdinates)
  .addTo(map)
  .setPopup(
    new mapboxgl.Popup({
      offset: 25,
    })
      .setHTML(
        `<h5>${listing.title}</h5><p>Exact location provided after booking</p>`
      )
      .addClassName("Map-Popup")
  );
