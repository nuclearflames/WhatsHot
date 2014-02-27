using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WCFServiceWebRole1.Models
{
    public class Token
    {
        public int ID;
        public string TokenString;
        public int UserId;
        public DateTime TimeAdded;
    }
}