using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using WCFServiceWebRole1.Models;

namespace WCFServiceWebRole1.Contexts
{
    public class WhatsHotContext : DbContext
    {
        public DbSet<UserModel> Users { get; set; }
    }
}