"""
Fallback airport database for airspace classification.
Used when FAA polygon queries return ambiguous results.
"""

from dataclasses import dataclass
import math

@dataclass
class Airport:
    icao: str
    name: str
    lat: float
    lon: float
    airspace_class: str  # B, C, or D
    radius_nm: float  # Typical airspace radius
    ceiling_ft: int  # Typical ceiling


# Major US airports with published airspace
# Source: FAA Chart Supplement and sectional charts
AIRPORTS = [
    # Class B (30 busiest)
    Airport("KATL", "Hartsfield-Jackson Atlanta", 33.6367, -84.4281, "B", 30, 10000),
    Airport("KORD", "Chicago O'Hare", 41.9742, -87.9073, "B", 30, 10000),
    Airport("KLAX", "Los Angeles International", 33.9425, -118.4081, "B", 30, 10000),
    Airport("KDFW", "Dallas/Fort Worth", 32.8998, -97.0403, "B", 30, 11000),
    Airport("KDEN", "Denver International", 39.8561, -104.6737, "B", 30, 12000),
    Airport("KJFK", "New York JFK", 40.6413, -73.7781, "B", 30, 7000),
    Airport("KSFO", "San Francisco International", 37.6213, -122.3790, "B", 30, 10000),
    Airport("KSEA", "Seattle-Tacoma", 47.4502, -122.3088, "B", 30, 10000),
    Airport("KLAS", "Las Vegas McCarran", 36.0840, -115.1537, "B", 30, 10000),
    Airport("KMCO", "Orlando International", 28.4294, -81.3089, "B", 30, 10000),
    Airport("KPHX", "Phoenix Sky Harbor", 33.4352, -112.0101, "B", 30, 10000),
    Airport("KIAH", "Houston Bush", 29.9902, -95.3368, "B", 30, 10000),
    Airport("KBOS", "Boston Logan", 42.3656, -71.0096, "B", 30, 7000),
    Airport("KMIA", "Miami International", 25.7959, -80.2870, "B", 30, 7000),
    Airport("KEWR", "Newark Liberty", 40.6895, -74.1745, "B", 30, 7000),
    Airport("KMSP", "Minneapolis-St Paul", 44.8848, -93.2223, "B", 30, 10000),
    Airport("KDTW", "Detroit Metro Wayne", 42.2124, -83.3534, "B", 30, 9000),
    Airport("KPHL", "Philadelphia International", 39.8729, -75.2437, "B", 30, 7000),
    Airport("KCLT", "Charlotte Douglas", 35.2144, -80.9473, "B", 30, 10000),
    Airport("KSLC", "Salt Lake City", 40.7899, -111.9791, "B", 30, 10000),
    
    # Class C (selected major regional)
    Airport("KPDX", "Portland International", 45.5887, -122.5975, "C", 10, 4000),
    Airport("KSAN", "San Diego International", 32.7336, -117.1897, "C", 10, 4000),
    Airport("KAUS", "Austin-Bergstrom", 30.1945, -97.6699, "C", 10, 4000),
    Airport("KOAK", "Oakland International", 37.7213, -122.2208, "C", 10, 4000),
    Airport("KSJC", "San Jose International", 37.3626, -121.9290, "C", 10, 4000),
    Airport("KSAT", "San Antonio International", 29.5337, -98.4698, "C", 10, 4000),
    Airport("KSMF", "Sacramento International", 38.6954, -121.5908, "C", 10, 4000),
    Airport("KONT", "Ontario International", 34.0560, -117.6012, "C", 10, 4000),
    Airport("KBUR", "Burbank Airport", 34.2007, -118.3587, "C", 10, 4000),
    Airport("KBNA", "Nashville International", 36.1245, -86.6782, "C", 10, 4000),
    Airport("KIND", "Indianapolis International", 39.7173, -86.2944, "C", 10, 4000),
    Airport("KCMH", "Columbus International", 39.9980, -82.8919, "C", 10, 4000),
    Airport("KSJC", "Mineta San Jose", 37.3626, -121.9290, "C", 10, 4000),
    Airport("KRDU", "Raleigh-Durham", 35.8801, -78.7874, "C", 10, 4000),
    Airport("KSTL", "St. Louis Lambert", 38.7487, -90.3700, "C", 10, 4000),
    Airport("KTPA", "Tampa International", 27.9755, -82.5332, "C", 10, 4000),
    Airport("KBWI", "Baltimore/Washington", 39.1754, -76.6683, "C", 10, 4000),
    Airport("KRSW", "Southwest Florida International", 26.5362, -81.7552, "C", 10, 4000),
    Airport("KPBI", "Palm Beach International", 26.6832, -80.0956, "C", 10, 4000),
]


def haversine_nm(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculate great-circle distance in nautical miles."""
    R_nm = 3440.065  # Earth radius in nautical miles
    
    lat1_rad = math.radians(lat1)
    lat2_rad = math.radians(lat2)
    delta_lat = math.radians(lat2 - lat1)
    delta_lon = math.radians(lon2 - lon1)
    
    a = (math.sin(delta_lat / 2) ** 2 +
         math.cos(lat1_rad) * math.cos(lat2_rad) *
         math.sin(delta_lon / 2) ** 2)
    c = 2 * math.asin(math.sqrt(a))
    
    return R_nm * c


def find_nearest_airport(latitude: float, longitude: float, max_distance_nm: float = 15) -> Airport | None:
    """Find the nearest airport within max_distance_nm."""
    nearest = None
    min_distance = float('inf')
    
    for airport in AIRPORTS:
        distance = haversine_nm(latitude, longitude, airport.lat, airport.lon)
        if distance < min_distance and distance <= max_distance_nm:
            min_distance = distance
            nearest = airport
    
    return nearest


def classify_by_airport_proximity(
    latitude: float, 
    longitude: float,
    altitude_ft_agl: float
) -> tuple[str | None, bool | None, int | None, str | None, float | None]:
    """
    Fallback airspace classification based on airport proximity.
    
    Returns: (airspace_class, laanc_required, ceiling_ft, facility_name, distance_nm)
    """
    airport = find_nearest_airport(latitude, longitude, max_distance_nm=15)
    
    if not airport:
        return (None, None, None, None, None)
    
    distance_nm = haversine_nm(latitude, longitude, airport.lat, airport.lon)
    
    # Check if within airspace radius
    if distance_nm > airport.radius_nm:
        return (None, None, None, None, distance_nm)
    
    # Within the airspace
    airspace_class = f"Class {airport.airspace_class}"
    laanc_required = True  # All B, C, D require authorization
    ceiling_ft = airport.ceiling_ft
    facility_name = airport.name
    
    return (airspace_class, laanc_required, ceiling_ft, facility_name, distance_nm)