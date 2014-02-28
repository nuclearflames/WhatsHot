using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;

namespace WhatsHot.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            ViewBag.Message = "Modify this template to jump-start your ASP.NET MVC application.";

            return View();
        }

        [HttpPost]
        public string GetData(string id)
        {
            try
            {
                var json = "";

                HttpWebRequest req = (HttpWebRequest)WebRequest.Create("http://whatshot.cloudapp.net/Service1.svc/GetHeatmapData/123/0/0");
                req.ContentType = "application/json";
                req.Method = "GET";

                HttpWebResponse res = (HttpWebResponse)req.GetResponse();
                using (StreamReader reader = new StreamReader(res.GetResponseStream()))
                {
                    json += reader.ReadToEnd();
                }
                return json;

            }
            catch (Exception e)
            {
                Debug.WriteLine(e);
                return "failed response";
            }
        }
    }
}
