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

        public static bool IsPostcode(string postcode)
        {
            return _postcodeRegex.IsMatch(postcode);
        }

        public static bool IsLat(string lat, out double result)
        {
            return double.TryParse(lat, out result);
        }

        public static bool IsLong(string longitude, out double result)
        {
            return double.TryParse(longitude, out result);
        }

        public static bool IsLatLong(string latlong, out double lat, out double @long)
        {
            lat = 0;
            @long = 0;

            var ll = latlong.Split(',');

            if (ll.Length != 2)
            {
                ll = latlong.Split(' ');
            }

            if (ll.Length == 2)
            {
                if (!double.TryParse(ll[0], out lat)) return false;
                if (!double.TryParse(ll[1], out @long)) return false;

                return true;
            }

            return false;
        }
    }
}