using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WCFServiceWebRole1.Models
{
    public class Location
    {
        public int ID;
        public int UserId;
        public string Lat;
        public string Long;
        public DateTime TimeAdded;
    }
}