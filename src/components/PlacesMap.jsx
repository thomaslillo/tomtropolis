import { useEffect, useMemo, useRef, useState } from 'react';
import L from 'leaflet';
import { GeoJSON, MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import '../styles/places-map.css';

const categoryLabels = {
  city: 'City',
  community: 'Community',
  nature: 'Nature'
};

const categoryFallbackIcons = {
  city: '/icons/city-pin.svg',
  community: '/icons/community-pin.svg',
  nature: '/icons/nature-pin.svg'
};

const categoryFallbackColors = {
  city: '#2563eb',
  community: '#7c3aed',
  nature: '#059669'
};

const initialCenter = [43.3, -79.2];
const initialZoom = 8;

const iconCache = new Map();

function getMarkerIcon(place) {
  const iconPath = place.icon || categoryFallbackIcons[place.category] || categoryFallbackIcons.city;

  if (!iconCache.has(iconPath)) {
    iconCache.set(
      iconPath,
      L.divIcon({
        className: 'places-page__marker',
        html: `<img src="${iconPath}" alt="" />`,
        iconSize: [34, 34],
        iconAnchor: [17, 34],
        popupAnchor: [0, -28]
      })
    );
  }

  return iconCache.get(iconPath);
}

function MapFocusController({ selectedPlace, visiblePlaces }) {
  const map = useMap();

  useEffect(() => {
    if (selectedPlace) {
      map.flyTo([selectedPlace.lat, selectedPlace.lng], Math.max(map.getZoom(), 9), {
        duration: 0.8
      });
      return;
    }

    if (!visiblePlaces.length) {
      return;
    }

    if (visiblePlaces.length === 1) {
      const [place] = visiblePlaces;
      map.flyTo([place.lat, place.lng], Math.max(map.getZoom(), 9), {
        duration: 0.8
      });
      return;
    }

    const bounds = L.latLngBounds(visiblePlaces.map((place) => [place.lat, place.lng]));
    map.fitBounds(bounds.pad(0.2));
  }, [map, selectedPlace, visiblePlaces]);

  return null;
}

export default function PlacesMap({ places }) {
  const markerRefs = useRef({});
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCountry, setSelectedCountry] = useState('all');
  const [selectedTrip, setSelectedTrip] = useState('all');
  const [selectedPlaceId, setSelectedPlaceId] = useState(places[0]?.id ?? null);
  const [routeData, setRouteData] = useState(null);

  const categories = useMemo(
    () => [...new Set(places.map((place) => place.category))],
    [places]
  );
  const countries = useMemo(
    () => [...new Set(places.map((place) => place.country))],
    [places]
  );
  const trips = useMemo(
    () => [...new Set(places.map((place) => place.trip))],
    [places]
  );

  const visiblePlaces = useMemo(
    () =>
      places.filter((place) => {
        if (selectedCategory !== 'all' && place.category !== selectedCategory) {
          return false;
        }

        if (selectedCountry !== 'all' && place.country !== selectedCountry) {
          return false;
        }

        if (selectedTrip !== 'all' && place.trip !== selectedTrip) {
          return false;
        }

        return true;
      }),
    [places, selectedCategory, selectedCountry, selectedTrip]
  );

  const selectedPlace = visiblePlaces.find((place) => place.id === selectedPlaceId) ?? null;
  const activePlace = selectedPlace ?? visiblePlaces[0] ?? null;

  useEffect(() => {
    fetch('/data/places-route.geojson')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Route overlay failed to load.');
        }

        return response.json();
      })
      .then((data) => setRouteData(data))
      .catch(() => setRouteData(null));
  }, []);

  useEffect(() => {
    setSelectedPlaceId(null);
  }, [selectedCategory, selectedCountry, selectedTrip]);

  useEffect(() => {
    if (!selectedPlace) {
      return;
    }

    const marker = markerRefs.current[selectedPlace.id];
    if (marker) {
      marker.openPopup();
    }
  }, [selectedPlace]);

  const handlePlaceSelect = (placeId) => {
    setSelectedPlaceId(placeId);
  };

  return (
    <div className="places-page__layout">
      <div className="places-page__controls">
        <div className="places-page__control">
          <label htmlFor="category-filter">Category</label>
          <select
            id="category-filter"
            value={selectedCategory}
            onChange={(event) => setSelectedCategory(event.target.value)}
          >
            <option value="all">All categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {categoryLabels[category] ?? category}
              </option>
            ))}
          </select>
        </div>

        <div className="places-page__control">
          <label htmlFor="country-filter">Country</label>
          <select
            id="country-filter"
            value={selectedCountry}
            onChange={(event) => setSelectedCountry(event.target.value)}
          >
            <option value="all">All countries</option>
            {countries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </div>

        <div className="places-page__control">
          <label htmlFor="trip-filter">Trip</label>
          <select
            id="trip-filter"
            value={selectedTrip}
            onChange={(event) => setSelectedTrip(event.target.value)}
          >
            <option value="all">All trips</option>
            {trips.map((trip) => (
              <option key={trip} value={trip}>
                {trip}
              </option>
            ))}
          </select>
        </div>
      </div>

      <p className="places-page__summary">
        Showing {visiblePlaces.length} place{visiblePlaces.length === 1 ? '' : 's'} from a static
        dataset, with GeoJSON and SVG assets layered on top of Leaflet.
      </p>

      <div className="places-page__map-shell">
        <MapContainer
          center={initialCenter}
          zoom={initialZoom}
          scrollWheelZoom={false}
          className="places-page__map"
        >
          <MapFocusController selectedPlace={selectedPlace} visiblePlaces={visiblePlaces} />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {routeData ? (
            <GeoJSON
              data={routeData}
              style={() => ({
                color: '#0f172a',
                weight: 3,
                opacity: 0.65,
                dashArray: '8 8'
              })}
            />
          ) : null}

          {visiblePlaces.map((place) => (
            <Marker
              key={place.id}
              position={[place.lat, place.lng]}
              icon={getMarkerIcon(place)}
              eventHandlers={{
                click: () => handlePlaceSelect(place.id)
              }}
              ref={(marker) => {
                if (marker) {
                  markerRefs.current[place.id] = marker;
                }
              }}
            >
              <Popup>
                <div className="places-page__popup">
                  {place.image ? <img src={place.image} alt={`Illustration for ${place.name}`} /> : null}
                  <h3>{place.name}</h3>
                  <p>{place.description}</p>
                  <a href={place.link} target="_blank" rel="noreferrer">
                    Learn more
                  </a>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {visiblePlaces.length ? (
        <div className="places-page__cards">
          {visiblePlaces.map((place) => {
            const color = place.color || categoryFallbackColors[place.category] || '#2563eb';
            const isActive = activePlace?.id === place.id;

            return (
              <article
                key={place.id}
                className={`places-page__card${isActive ? ' places-page__card--active' : ''}`}
              >
                {place.image ? <img src={place.image} alt={`Illustration for ${place.name}`} /> : null}
                <div className="places-page__card-meta">
                  <span className="places-page__pill" style={{ '--pill-color': color }}>
                    {categoryLabels[place.category] ?? place.category}
                  </span>
                  <span className="places-page__pill" style={{ '--pill-color': color }}>
                    {place.trip}
                  </span>
                </div>
                <div>
                  <h3>{place.name}</h3>
                  <p>{place.description}</p>
                </div>
                <div className="places-page__card-actions">
                  <button
                    type="button"
                    className="places-page__button"
                    onClick={() => handlePlaceSelect(place.id)}
                  >
                    Focus map
                  </button>
                  <a
                    className="places-page__secondary-link"
                    href={place.link}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Related link
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <p className="places-page__empty">No places match those filters yet.</p>
      )}
    </div>
  );
}
