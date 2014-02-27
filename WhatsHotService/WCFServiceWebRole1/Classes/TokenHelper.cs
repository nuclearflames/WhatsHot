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
        public bool IsTokenValid(string token)
        {
            using( var db = new WhatsHotContext())
            {
                return (from Token in db.Tokens
                        where Token.TokenString == token
                        select Token).Any();
            }
        }

        public int TokensUserId(string token)
        {
            using (var db = new WhatsHotContext())
            {
                return (from Token in db.Tokens
                        where Token.TokenString == token
                        select Token.UserId).FirstOrDefault();
            }
        }

        public string CreateToken(int userId)
        {
            var existingToken = HasToken(userId);

            if (!string.IsNullOrWhiteSpace(existingToken)) return existingToken;

            using (var db = new WhatsHotContext())
            {
                var token = new Token()
                {
                    TimeAdded = DateTime.Now,
                    UserId = userId,
                    TokenString = Guid.NewGuid().ToString()
                };

                db.Tokens.Add(token);
                db.SaveChanges();

                return token.TokenString;
            }
        }

        public string HasToken(int userId)
        {
            using (var db = new WhatsHotContext())
            {
                return (from Token in db.Tokens
                        where Token.UserId == userId
                        select Token.TokenString).FirstOrDefault();
            }
        }
    }
}