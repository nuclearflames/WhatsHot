using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using WCFServiceWebRole1.Contexts;
using WCFServiceWebRole1.Models;

namespace WCFServiceWebRole1.Classes
{
    public class TokenHelper
    {
        public bool IsTokenValid(string token, out int userId)
        {
            using (var db = new whatshotEntities())
            {
                var tokennn = (from Token in db.Tokens
                               where Token.TokenString == token
                               select Token).FirstOrDefault();

                userId = tokennn.User_Id;
                return tokennn.TokenString == token;
            }
        }

        public string CreateToken(int userId)
        {
            var existingToken = HasToken(userId);

            if (!string.IsNullOrWhiteSpace(existingToken)) return existingToken;

            using (var db = new whatshotEntities())
            {
                var token = new Token()
                {
                    TimeAdded = DateTime.Now,
                    User_Id = userId,
                    TokenString = Guid.NewGuid().ToString()
                };

                db.Tokens.Add(token);
                db.SaveChanges();

                return token.TokenString;
            }
        }

        public string HasToken(int userId)
        {
            using (var db = new whatshotEntities())
            {
                return (from Token in db.Tokens
                        where Token.User_Id == userId
                        select Token.TokenString).FirstOrDefault();
            }
        }
    }
}