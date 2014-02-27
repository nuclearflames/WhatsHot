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
    public partial class Service1 : IService1
    {
        private TokenHelper _tokenHelper = new TokenHelper();

        public string GetData(string value)
        {
            using (var db = new WhatsHotContext())
            {
                var userCount = db.Users.Count();

                var newuser = new UserModel() { UserId = userCount + 1, UserName = "test" };

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
            if (!LocationHelper.IsPostcode(defaultlocation) && !LocationHelper.IsLatLong(defaultlocation)) return;

            using (var db = new WhatsHotContext())
            {
                var query = from u in db.Users
                            where u.UserId == userId
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

            using (var db = new WhatsHotContext())
            {
                var query = from u in db.Users
                            where u.UserId == userId
                            select u;

                var user = query.FirstOrDefault();

                if (user == null) return "No user";

                return user.DefaultLocation;
            } 
        }

        public string Register(string user, string password, string defaultlocation)
        {
            int userId;
            if (!LocationHelper.IsPostcode(defaultlocation) && !(LocationHelper.IsLatLong(defaultlocation))) return "";

            // check if user already exists
            using (var db = new WhatsHotContext())
            {
                var userExists = (from User in db.Users
                                  where User.UserName == user
                                  select User).Any();

                if (userExists) return "";

                var newUser = new UserModel() { UserName = user, HashedPassword = password, DefaultLocation = defaultlocation };

                db.Users.Add(newUser);
                db.SaveChanges();
                userId = newUser.UserId;
            }

            return _tokenHelper.CreateToken(userId);
        }
        
    }
}
