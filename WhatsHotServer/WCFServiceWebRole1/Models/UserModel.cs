using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WhatsHotWCF.Models
{
    public class UserModel
    {
        public int UserId { get; set; }
        public string UserName { get; set; }
        public string HashedPassword { get; set; }
        public string DefaultPostcode { get; set; }
    }
}