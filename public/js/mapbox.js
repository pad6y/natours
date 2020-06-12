/* eslint-disable */

export const displayMap = (locations) => {
  mapboxgl.accessToken =
    'pk.eyJ1IjoicGFkNnkiLCJhIjoiY2theWNmZXF6MDJpdjMzcGppMnd3NnVkYSJ9.NPepW9fE1QSTqH6QoDQC2w';

  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/pad6y/ckaycskop06uz1ipnbqnuxpam',
    scrollZoom: false,
    //   center: [-118.113491, 34.111745],
    //   zoom: 4,
    //   interactive: false,
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach((loc) => {
    //Create Marker
    const el = document.createElement('div');
    el.className = 'marker';

    //Add Marker
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom',
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    //Add popup
    new mapboxgl.Popup({
      offset: 30,
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
      .addTo(map);

    //Extend map bounds to include the current locations
    bounds.extend(loc.coordinates);
  });

  //To make map fit around the markers
  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      left: 100,
      right: 100,
    },
  });
};
