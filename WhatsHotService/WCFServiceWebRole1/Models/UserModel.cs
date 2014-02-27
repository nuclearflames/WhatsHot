using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace WCFServiceWebRole1.Models
{
    public class UserModel
    {
        [Key]
        public int UserId { get; set; }
        public string UserName { get; set; }

        public string HashedPassword { get; set; }

        public string DefaultLocation { get; set; }
    }
}