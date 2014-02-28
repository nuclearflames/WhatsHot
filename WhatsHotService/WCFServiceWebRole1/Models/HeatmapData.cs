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
        [Key]
        Int64 Id { get; set; }
        GeoCoordinate LatLong { get; set; }
        double Weight { get; set; }
    }
}