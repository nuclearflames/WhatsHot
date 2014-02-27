using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.Entity;
using WhatsHotWCF.Models;

namespace WhatsHotWCF.Context
{
    public class WhatsHotContext : DbContext
    {
        public DbSet<UserModel> Users { get; set; } 
    }

    
}