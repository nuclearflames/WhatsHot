using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.ServiceModel.Web;
using System.Text;
using WCFServiceWebRole1.Contexts;
using WCFServiceWebRole1.Models;

namespace WCFServiceWebRole1
{
    // NOTE: You can use the "Rename" command on the "Refactor" menu to change the class name "Service1" in code, svc and config file together.
    // NOTE: In order to launch WCF Test Client for testing this service, please select Service1.svc or Service1.svc.cs at the Solution Explorer and start debugging.
    public partial class Service1 : IService1
    {
        public string GetData(string value)
        {
            return string.Format("You entered: {0}", value);
        }

        public void SetUserProfile(string token, string defaultlocation)
        {
            // check if valid token & get user id
            int userId = 0;

            // check if default location is a valid location

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
            return "Raarrrwww!";
        }
        
    }
}
