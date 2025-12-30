export interface AddressSuggestion {
  place_id: number;
  licence: string;
  osm_type: string;
  osm_id: number;
  boundingbox: string[];
  lat: string;
  lon: string;
  display_name: string;
  class: string;
  type: string;
  importance: number;
}

export const getAddressSuggestions = async (query: string): Promise<AddressSuggestion[]> => {
  if (!query || query.length < 3) return [];

  try {
    // Using OpenStreetMap Nominatim API for address autocomplete.
    // This is a free public API that does not require an API key for low-volume usage.
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&addressdetails=1&limit=5&countrycodes=us`;
    
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        // Nominatim requires a User-Agent identifying the application
        'User-Agent': 'RadonScoutAI-Demo/1.0'
      }
    });

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    return data as AddressSuggestion[];
  } catch (error) {
    console.warn("Failed to fetch address suggestions:", error);
    return [];
  }
};
