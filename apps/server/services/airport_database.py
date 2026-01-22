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


# Comprehensive US airports with published airspace
# Source: FAA Chart Supplement and sectional charts
AIRPORTS = [
    # ==================== CLASS B AIRPORTS (Major Hubs) ====================
    # These have 30nm Mode C veils and complex airspace
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
    Airport("KIAH", "Houston Bush Intercontinental", 29.9902, -95.3368, "B", 30, 10000),
    Airport("KBOS", "Boston Logan", 42.3656, -71.0096, "B", 30, 7000),
    Airport("KMIA", "Miami International", 25.7959, -80.2870, "B", 30, 7000),
    Airport("KEWR", "Newark Liberty", 40.6895, -74.1745, "B", 30, 7000),
    Airport("KMSP", "Minneapolis-St Paul", 44.8848, -93.2223, "B", 30, 10000),
    Airport("KDTW", "Detroit Metro Wayne", 42.2124, -83.3534, "B", 30, 9000),
    Airport("KPHL", "Philadelphia International", 39.8729, -75.2437, "B", 30, 7000),
    Airport("KCLT", "Charlotte Douglas", 35.2144, -80.9473, "B", 30, 10000),
    Airport("KSLC", "Salt Lake City", 40.7899, -111.9791, "B", 30, 10000),
    Airport("KDCA", "Washington Reagan National", 38.8521, -77.0377, "B", 30, 7000),
    Airport("KBWI", "Baltimore/Washington Int'l", 39.1754, -76.6683, "B", 30, 8000),
    Airport("KIAD", "Washington Dulles", 38.9531, -77.4565, "B", 30, 8000),
    Airport("KSTL", "St. Louis Lambert", 38.7487, -90.3700, "B", 30, 10000),
    Airport("KMDW", "Chicago Midway", 41.7868, -87.7522, "B", 30, 8000),
    Airport("KSAN", "San Diego International", 32.7336, -117.1897, "B", 30, 10000),
    Airport("KTPA", "Tampa International", 27.9755, -82.5332, "B", 30, 10000),
    Airport("KHOU", "Houston Hobby", 29.6454, -95.2789, "B", 30, 8000),
    Airport("KCVG", "Cincinnati/Northern Kentucky", 39.0488, -84.6678, "B", 30, 10000),
    Airport("KMEM", "Memphis International", 35.0424, -89.9767, "B", 30, 9000),
    Airport("KPBI", "Palm Beach International", 26.6832, -80.0956, "B", 30, 8000),
    Airport("KHNL", "Honolulu International", 21.3187, -157.9225, "B", 30, 7000),
    
    # ==================== CLASS C AIRPORTS (Regional Hubs) ====================
    # 10nm radius, 4000ft ceiling typical
    
    # West Coast
    Airport("KOAK", "Oakland International", 37.7213, -122.2208, "C", 10, 4000),
    Airport("KSJC", "San Jose International", 37.3626, -121.9290, "C", 10, 4000),
    Airport("KSMF", "Sacramento International", 38.6954, -121.5908, "C", 10, 4000),
    Airport("KONT", "Ontario International", 34.0560, -117.6012, "C", 10, 4000),
    Airport("KBUR", "Burbank Airport", 34.2007, -118.3587, "C", 10, 4000),
    Airport("KSNA", "John Wayne Orange County", 33.6757, -117.8682, "C", 10, 4000),
    Airport("KFAT", "Fresno Yosemite", 36.7762, -119.7181, "C", 10, 4000),
    Airport("KBOI", "Boise Air Terminal", 43.5644, -116.2228, "C", 10, 4000),
    Airport("KGEG", "Spokane International", 47.6199, -117.5339, "C", 10, 4000),
    Airport("KPDX", "Portland International", 45.5887, -122.5975, "C", 10, 4000),
    Airport("KAUS", "Austin-Bergstrom", 30.1945, -97.6699, "C", 10, 4000),
    Airport("KSAT", "San Antonio International", 29.5337, -98.4698, "C", 10, 4000),
    Airport("KRNO", "Reno-Tahoe International", 39.4991, -119.7681, "C", 10, 4000),
    
    # Mountain States
    Airport("KCOS", "Colorado Springs", 38.8058, -104.7013, "C", 10, 4000),
    Airport("KABQ", "Albuquerque International", 35.0402, -106.6092, "C", 10, 4000),
    Airport("KTUS", "Tucson International", 32.1161, -110.9410, "C", 10, 4000),
    Airport("KOMA", "Omaha Eppley Airfield", 41.3032, -95.8941, "C", 10, 4000),
    Airport("KBIL", "Billings Logan", 45.8077, -108.5430, "C", 10, 4000),
    Airport("KGTF", "Great Falls International", 47.4820, -111.3705, "C", 10, 4000),
    
    # Midwest
    Airport("KIND", "Indianapolis International", 39.7173, -86.2944, "C", 10, 4000),
    Airport("KCMH", "Columbus International", 39.9980, -82.8919, "C", 10, 4000),
    Airport("KBNA", "Nashville International", 36.1245, -86.6782, "C", 10, 4000),
    Airport("KMKE", "Milwaukee Mitchell", 42.9472, -87.8966, "C", 10, 4000),
    Airport("KDSM", "Des Moines International", 41.5340, -93.6631, "C", 10, 4000),
    Airport("KICT", "Wichita Eisenhower", 37.6499, -97.4331, "C", 10, 4000),
    Airport("KCID", "Cedar Rapids Eastern Iowa", 41.8847, -91.7108, "C", 10, 4000),
    Airport("KGRR", "Gerald R. Ford International", 42.8808, -85.5228, "C", 10, 4000),
    Airport("KFWA", "Fort Wayne International", 40.9785, -85.1951, "C", 10, 4000),
    Airport("KLIT", "Little Rock National", 34.7294, -92.2243, "C", 10, 4000),
    Airport("KTUL", "Tulsa International", 36.1984, -95.8881, "C", 10, 4000),
    
    # South
    Airport("KRDU", "Raleigh-Durham", 35.8801, -78.7874, "C", 10, 4000),
    Airport("KGSO", "Piedmont Triad", 36.0978, -79.9373, "C", 10, 4000),
    Airport("KSAV", "Savannah/Hilton Head", 32.1276, -81.2021, "C", 10, 4000),
    Airport("KBHM", "Birmingham-Shuttlesworth", 33.5629, -86.7535, "C", 10, 4000),
    Airport("KMSY", "New Orleans Louis Armstrong", 29.9934, -90.2580, "C", 10, 4000),
    Airport("KRSW", "Southwest Florida International", 26.5362, -81.7552, "C", 10, 4000),
    Airport("KFLL", "Fort Lauderdale-Hollywood", 26.0726, -80.1527, "C", 10, 4000),
    Airport("KJAX", "Jacksonville International", 30.4941, -81.6879, "C", 10, 4000),
    Airport("KPNS", "Pensacola International", 30.4734, -87.1866, "C", 10, 4000),
    Airport("KMOB", "Mobile Regional", 30.6912, -88.2428, "C", 10, 4000),
    Airport("KLEX", "Blue Grass Airport Lexington", 38.0365, -84.6059, "C", 10, 4000),
    Airport("KDAY", "Dayton International", 39.9024, -84.2194, "C", 10, 4000),
    Airport("KTYS", "McGhee Tyson Knoxville", 35.8111, -83.9940, "C", 10, 4000),
    Airport("KCHA", "Chattanooga Metropolitan", 35.0353, -85.2038, "C", 10, 4000),
    Airport("KCRW", "Charleston Yeager", 38.3731, -81.5932, "C", 10, 4000),
    
    # Northeast
    Airport("KBDL", "Bradley International Hartford", 41.9389, -72.6832, "C", 10, 4000),
    Airport("KPVD", "T.F. Green Providence", 41.7240, -71.4281, "C", 10, 4000),
    Airport("KALB", "Albany International", 42.7483, -73.8017, "C", 10, 4000),
    Airport("KBUF", "Buffalo Niagara", 42.9405, -78.7322, "C", 10, 4000),
    Airport("KROC", "Greater Rochester", 43.1189, -77.6724, "C", 10, 4000),
    Airport("KSYR", "Syracuse Hancock", 43.1112, -76.1063, "C", 10, 4000),
    Airport("KPIT", "Pittsburgh International", 40.4915, -80.2329, "C", 10, 4000),
    Airport("KMHT", "Manchester-Boston Regional", 42.9326, -71.4357, "C", 10, 4000),
    
    # ==================== CLASS D AIRPORTS (Towered Fields) ====================
    # 4nm radius, 2500ft ceiling typical
    # Adding strategic coverage for rural areas
    
    # Montana
    Airport("KMSO", "Missoula International", 46.9163, -114.0906, "D", 4, 2500),
    Airport("KHLN", "Helena Regional", 46.6068, -111.9828, "D", 4, 2500),
    Airport("KBTM", "Bert Mooney Butte", 45.9548, -112.4975, "D", 4, 2500),
    Airport("KGPI", "Glacier Park International", 48.3105, -114.2559, "D", 4, 2500),
    Airport("KBZN", "Bozeman Yellowstone", 45.7775, -111.1603, "D", 4, 2500),
    
    # Wyoming
    Airport("KCYS", "Cheyenne Regional", 41.1557, -104.8122, "D", 4, 2500),
    Airport("KJAC", "Jackson Hole", 43.6073, -110.7377, "D", 4, 2500),
    Airport("KRIW", "Riverton Regional", 43.0642, -108.4597, "D", 4, 2500),
    Airport("KCOD", "Yellowstone Regional Cody", 44.5202, -109.0238, "D", 4, 2500),
    
    # Dakotas
    Airport("KFAR", "Hector International Fargo", 46.9207, -96.8158, "D", 4, 2500),
    Airport("KBIS", "Bismarck Municipal", 46.7727, -100.7467, "D", 4, 2500),
    Airport("KMOT", "Minot International", 48.2594, -101.2803, "D", 4, 2500),
    Airport("KRAP", "Rapid City Regional", 44.0453, -103.0574, "D", 4, 2500),
    Airport("KFSD", "Sioux Falls Regional", 43.5820, -96.7419, "D", 4, 2500),
    
    # Idaho
    Airport("KTWF", "Magic Valley Regional Twin Falls", 42.4818, -114.4877, "D", 4, 2500),
    Airport("KIDA", "Idaho Falls Regional", 43.5146, -112.0707, "D", 4, 2500),
    Airport("KPIH", "Pocatello Regional", 42.9098, -112.5959, "D", 4, 2500),
    Airport("KLWS", "Lewiston-Nez Perce County", 46.3745, -117.0154, "D", 4, 2500),
    
    # Nevada
    Airport("KEKO", "Elko Regional", 40.8249, -115.7917, "D", 4, 2500),
    
    # Alaska (major airports only)
    Airport("PANC", "Ted Stevens Anchorage", 61.1744, -149.9962, "C", 10, 4000),
    Airport("PAFA", "Fairbanks International", 64.8151, -147.8561, "D", 4, 2500),
    Airport("PAJN", "Juneau International", 58.3550, -134.5764, "D", 4, 2500),
    
    # Hawaii (additional islands)
    Airport("PHOG", "Kahului Maui", 20.8986, -156.4305, "D", 4, 2500),
    Airport("PHKO", "Kona International", 19.7388, -156.0456, "D", 4, 2500),
    Airport("PHNL", "Daniel K. Inouye International", 21.3187, -157.9225, "B", 30, 7000),
    
    # Oregon
    Airport("KEUG", "Eugene Mahlon Sweet", 44.1246, -123.2119, "D", 4, 2500),
    Airport("KRDM", "Roberts Field Redmond", 44.2541, -121.1497, "D", 4, 2500),
    Airport("KOTH", "Southwest Oregon Regional", 43.4178, -124.2461, "D", 4, 2500),
    Airport("KMFR", "Rogue Valley International Medford", 42.3742, -122.8735, "D", 4, 2500),
    
    # Washington
    Airport("KPSC", "Tri-Cities", 46.2647, -119.1190, "D", 4, 2500),
    Airport("KBLI", "Bellingham International", 48.7928, -122.5375, "D", 4, 2500),
    Airport("KYKM", "Yakima Air Terminal", 46.5682, -120.5440, "D", 4, 2500),
    
    # New Mexico
    Airport("KROW", "Roswell International", 33.3016, -104.5306, "D", 4, 2500),
    Airport("KSAF", "Santa Fe Regional", 35.6171, -106.0881, "D", 4, 2500),
    
    # Vermont/New Hampshire/Maine
    Airport("KBTV", "Burlington International", 44.4719, -73.1533, "C", 10, 4000),
    Airport("KPWM", "Portland International Jetport", 43.6462, -70.3093, "C", 10, 4000),
    Airport("KBGR", "Bangor International", 44.8074, -68.8281, "D", 4, 2500),
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
        # No controlled airport within 15nm - likely Class G (uncontrolled)
        return ("Class G", False, None, "Uncontrolled airspace (no nearby airports)", None)
    
    distance_nm = haversine_nm(latitude, longitude, airport.lat, airport.lon)
    
    # Check if within airspace radius
    if distance_nm > airport.radius_nm:
        # Outside the controlled airspace - likely Class G or E
        return ("Class G", False, None, "Uncontrolled airspace (outside controlled zones)", distance_nm)
    
    # Within the airspace
    airspace_class = f"Class {airport.airspace_class}"
    laanc_required = True  # All B, C, D require authorization
    
    # IMPORTANT: Don't return hardcoded ceilings for Class B/C
    # LAANC ceilings vary by exact grid location (0-400ft typical)
    # Users must check with FAA-approved LAANC provider
    ceiling_ft = None  # Force users to verify via LAANC provider
    
    facility_name = airport.name
    
    return (airspace_class, laanc_required, ceiling_ft, facility_name, distance_nm)