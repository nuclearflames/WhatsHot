using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.ServiceModel.Web;
using System.Text;
using WCFServiceWebRole1.Classes;
using WCFServiceWebRole1.Contexts;
using WCFServiceWebRole1.Models;

namespace WCFServiceWebRole1
{
    // NOTE: You can use the "Rename" command on the "Refactor" menu to change the class name "Service1" in code, svc and config file together.
    // NOTE: In order to launch WCF Test Client for testing this service, please select Service1.svc or Service1.svc.cs at the Solution Explorer and start debugging.
    public class Service1 : IService1
    {
        private TokenHelper _tokenHelper = new TokenHelper();

        public string ping()
        {
            return "pong";
        }

        public string GetData(string value)
        {
            using (var db = new whatshotEntities())
            {
                var userCount = db.Users.Count();

                var newuser = new User() { Id = userCount + 1, UserName = "test", DefaultLocation = "", HashedPassword = "" };

                db.Users.Add(newuser);

                db.SaveChanges();

                return "success";
            }
        }

        public void SetUserProfile(string token, string defaultlocation)
        {
            // check if valid token & get user id
            int userId;
            if (!_tokenHelper.IsTokenValid(token, out userId)) return;


            // check if default location is a valid location
            double lat,loong;
            if (!LocationHelper.IsPostcode(defaultlocation) && !LocationHelper.IsLatLong(defaultlocation,out lat, out loong)) return;

            using (var db = new whatshotEntities())
            {
                var query = from u in db.Users
                            where u.Id == userId
                            select u;

                var user = query.FirstOrDefault();

                user.DefaultLocation = defaultlocation;

                db.SaveChanges();
            } 

        }



        public string GetUserProfile(string token)
        {
            // check if valid token & get user id
            int userId;
            if (!_tokenHelper.IsTokenValid(token, out userId)) return "Invalid token";

            using (var db = new whatshotEntities())
            {
                var query = from u in db.Users
                            where u.Id == userId
                            select u;

                var user = query.FirstOrDefault();

                if (user == null) return "No user";

                return user.DefaultLocation;
            } 
        }

        public string Register(string user, string password, string defaultlocation)
        {
            int userId;
            double lat, loong;
            if (!LocationHelper.IsPostcode(defaultlocation) && !(LocationHelper.IsLatLong(defaultlocation,out lat, out loong))) return "";

            // check if user already exists
            using (var db = new whatshotEntities())
            {
                var userExists = (from User in db.Users
                                  where User.UserName == user
                                  select User).Any();

                if (userExists) return "";

                var newUser = new User() { UserName = user, HashedPassword = password, DefaultLocation = defaultlocation };

                db.Users.Add(newUser);
                db.SaveChanges();
                userId = newUser.Id;
            }

            return _tokenHelper.CreateToken(userId);
        }

        public string Authenticate(string user, string password, string method)
        {
            int userId;
            using (var db = new whatshotEntities())
            {
                var theuser = (from User in db.Users
                           where User.UserName == user && User.HashedPassword == password
                           select User).FirstOrDefault();

                if (theuser == null) return "";

                userId = theuser.Id;
            }

            return _tokenHelper.CreateToken(userId);
        }

        public string PostDestination(string token, string lat, string @long)
        {
            // check if valid token & get user id
            //int userId;
            //if (!_tokenHelper.IsTokenValid(token, out userId)) return "Invalid token";

            double latitude, longitude;

            if (!LocationHelper.IsLat(lat, out latitude) || !(LocationHelper.IsLong(@long, out longitude))) return "Invalid lat/long";

            using (var db = new whatshotEntities())
            {
                var newvote = new Location()
                {
                    Lat = latitude.ToString(),
                    Long = longitude.ToString(),
                    TimeAdded = DateTime.Now,
                    User_Id = -1//userId
                };

                db.Locations.Add(newvote);
                db.SaveChanges();
            }

            return "blah";
        }

        public const double latlongincrement = 1 / 11000;

        /// <summary>
        /// delta 1 lat / long is roughly 110km = 110000m. We want roughly 10 meter increments
        /// </summary>
        /// <param name="token"></param>
        /// <param name="lat"></param>
        /// <param name="long"></param>
        /// <returns></returns>
        public HeatmapData[] GetHeatmapData(string token, string lat, string @long)
        {
            //int userId;
            //if (!_tokenHelper.IsTokenValid(token, out userId)) return dataForUser.ToArray();

            double latitude, longitude;
            if (!LocationHelper.IsLat(lat, out latitude) || !(LocationHelper.IsLong(@long, out longitude))) return null;

            using (var db = new whatshotEntities())
            {
                return (from Locations in db.Locations
                             select new HeatmapData() { Latitude = Locations.Lat, Longitude = Locations.Long, Weight = 1 }).ToArray();
            }
        }
        
    }

    
}
