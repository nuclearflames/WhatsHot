using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.ServiceModel.Web;
using System.Text;
using WCFServiceWebRole1.Models;

namespace WCFServiceWebRole1
{
    // NOTE: You can use the "Rename" command on the "Refactor" menu to change the interface name "IService1" in both code and config file together.
    [ServiceContract]
    public interface IService1
    {
        [OperationContract]
        [WebGet(UriTemplate = "ping", ResponseFormat = WebMessageFormat.Json)]
        string ping();


        [OperationContract]
        [WebGet(UriTemplate = "PopulateRandomData", ResponseFormat = WebMessageFormat.Json)]
        string PopulateRandomData();


        [OperationContract]
        [WebGet(UriTemplate = "GetData/{value}", ResponseFormat=WebMessageFormat.Json)]
        string GetData(string value);

        [OperationContract]
        [WebGet(UriTemplate = "SetUserProfile/{token}/{defaultlocation}", ResponseFormat = WebMessageFormat.Json)]
        void SetUserProfile(string token, string defaultlocation);


        [OperationContract]
        [WebGet(UriTemplate = "GetUserProfile/{token}", ResponseFormat = WebMessageFormat.Json)]
        string GetUserProfile(string token);

        [OperationContract]
        [WebGet(UriTemplate = "Register/{user}/{password}/{defaultlocation}", ResponseFormat = WebMessageFormat.Json)]
        string Register(string user, string password, string defaultlocation);

        [OperationContract]
        [WebGet(UriTemplate = "Authenticate/{user}/{password}/{method}", ResponseFormat = WebMessageFormat.Json)]
        string Authenticate(string user, string password, string method);


        [OperationContract]
        [WebGet(UriTemplate = "PostDestination/{token}/{lat}/{long}", ResponseFormat = WebMessageFormat.Json)]
        string PostDestination(string token, string lat, string @long);

        [OperationContract]
        [WebGet(UriTemplate = "GetHeatmapData/{token}/{lat}/{long}", ResponseFormat = WebMessageFormat.Json)]
        HeatmapList GetHeatmapData(string token, string lat, string @long);

    }    
}
