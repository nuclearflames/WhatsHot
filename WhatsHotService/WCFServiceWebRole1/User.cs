//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace WCFServiceWebRole1
{
    using System;
    using System.Collections.Generic;
    
    public partial class User
    {
        public User()
        {
            this.Locations = new HashSet<Location>();
            this.Tokens = new HashSet<Token>();
        }
    
        public int Id { get; set; }
        public string UserName { get; set; }
        public string HashedPassword { get; set; }
        public string DefaultLocation { get; set; }
    
        public virtual ICollection<Location> Locations { get; set; }
        public virtual ICollection<Token> Tokens { get; set; }
    }
}
