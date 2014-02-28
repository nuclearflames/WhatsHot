using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Device.Location;
using System.Linq;
using System.Web;

namespace WCFServiceWebRole1.Models
{
    public class HeatmapData
    {
        public Int64 Id { get; set; }
        public string Latitude { get; set; }
        public string Longitude { get; set; }
        public double Weight { get; set; }
    }
}