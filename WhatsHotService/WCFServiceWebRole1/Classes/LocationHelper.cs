using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Web;

namespace WCFServiceWebRole1.Classes
{
    public static class LocationHelper
    {
        private static Regex _postcodeRegex = new Regex(@"(GIR 0AA)|((([A-Z-[QVX]][0-9][0-9]?)|(([A-Z-[QVX]][A-Z-[IJZ]][0-9][0-9]?)|(([A-Z-[QVX‌​]][0-9][A-HJKSTUW])|([A-Z-[QVX]][A-Z-[IJZ]][0-9][ABEHMNPRVWXY]))))\s?[0-9][A-Z-[C‌​IKMOV]]{2})");

        private static Regex _latitudeRegex = new Regex(@"^[NS]([0-8][0-9](\.[0-5]\d){2}|90(\.00){2})$");
        private static Regex _longitudeRegex = new Regex(@"^[EW]((0\d\d|1[0-7]\d)(\.[0-5]\d){2}|180(\.00){2})$");
        private static Regex _latitudeLongitudeRegex = new Regex(@"^[NS]([0-8][0-9](\.[0-5]\d){2}|90(\.00){2})\040[EW]((0\d\d|1[0-7]\d)(\.[0-5]\d){2}|180(\.00){2})$");

        public static bool IsPostcode(string postcode)
        {
            return _postcodeRegex.IsMatch(postcode);
        }

        public static bool IsLat(string lat)
        {
            return _latitudeRegex.IsMatch(lat);
        }

        public static bool IsLong(string longitude)
        {
            return _longitudeRegex.IsMatch(longitude);
        }

        public static bool IsLatLong(string latlong)
        {
            return _latitudeLongitudeRegex.IsMatch(latlong);
        }
    }
}