using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Net.Security;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using System.Threading.Tasks;
using UnityEngine;

namespace PixivCollector
{
    public class RequestOption
    {
        public string method = "GET";
        public Dictionary<string, string> headers = null;
        public Dictionary<string, string> parameters = null;
        public Dictionary<string, string> formDatas = null;
        public Dictionary<string, string> formUrlencodedDatas = null;
        public string body = null;
        public string proxyHost = null;
        public int proxyPort = 80;
        public int timeOut = 30000;
        public bool resultInBytes = false;
    }

    public class RequestResult
    {
        public int statusCode = -1;
        public string body;
        public byte[] bytes;
    }

    public class NetworkManager
    {
        static NetworkManager instance;
        readonly static object locker = new object();

        public static NetworkManager GetInstance()
        {
            if (instance == null)
            {
                lock (locker)
                {
                    if (instance == null)
                    {
                        instance = new NetworkManager();
                    }
                }
            }
            return instance;
        }

        public NetworkManager()
        {
            if (instance != null)
                throw new NotImplementedException("Instance already exists!");
        }

        public async Task<RequestResult> Request(string url, RequestOption option = null, Action<RequestResult> onComplete = null)
        {
            var result = await Task.Run(() =>
            {
                return DoRequest(url, option);
            });
            onComplete?.Invoke(result);
            return result;
        }

        public RequestResult DoRequest(string url, RequestOption option = null)
        {
            RequestResult result = null;
            try
            {
                if (option != null)
                {
                    var queryString = GetQueryString(option.parameters);
                    if (queryString != "")
                        url += "?" + queryString;
                }
                var logmsg = "NetworkManager request url: " + url;
                if (option != null && option.proxyHost != null)
                    logmsg += " Proxy: " + option.proxyHost + ":" + option.proxyPort;
                Debug.Log(logmsg);
                HttpWebRequest request;
                if(url.StartsWith("https",StringComparison.OrdinalIgnoreCase))  
                {  
                    ServicePointManager.ServerCertificateValidationCallback = CheckValidationResult;  
                    request = WebRequest.Create(url) as HttpWebRequest;
                    Debug.Assert(request != null, "Null request");
                    request.ProtocolVersion=HttpVersion.Version10;  
                }  
                else 
                {
                    request = WebRequest.Create(url) as HttpWebRequest;  
                }  
                if (request == null)
                {
                    Debug.LogError("Request null, url: " + url);
                    return null;
                }

                if (option != null)
                {
                    if (option.method != null)
                        request.Method = option.method;
                    if (option.headers != null)
                    {
                        SetRequestHeaders(request, option.headers);
                    }
                    if (option.proxyHost != null)
                    {
                        request.Proxy = new WebProxy(option.proxyHost, option.proxyPort);
                    }
                    request.Timeout = option.timeOut;
                    
                    // 写数据
                    string data = null;
                    if (option.body != null)
                        data = option.body;
                    else if (option.formDatas != null && option.formDatas.Count > 0)
                    {
                        // form-data
                        var boundary = "----" + DateTime.Now.Ticks.ToString("x"); // 边界符
                        request.ContentType = "multipart/form-data; boundary=" + boundary;
                        var beginBoundary = "--" + boundary + "\r\n"; // 开始边界符
                        var endBoundary = "--" + boundary + "--\r\n"; // 结束结束符
                        var format = "Content-Disposition: form-data; name=\"{0}\"\r\n\r\n{1}\r\n";
                        data = "";
                        foreach (var formData in option.formDatas)
                        {
                            data += beginBoundary;
                            data += string.Format(format, formData.Key, formData.Value);
                        }
                        data += endBoundary;
                    }
                    else if (option.formUrlencodedDatas != null && option.formUrlencodedDatas.Count > 0)
                    {
                        // www-form-urlencoded
                        request.ContentType = "application/x-www-form-urlencoded";
                        data = GetQueryString(option.formUrlencodedDatas);
                    }
                    if (data != null)
                    {
                        if (request.Method == "GET")
                            request.Method = "POST";
                        using (var writeStream = request.GetRequestStream())
                        {
                            var writer = new StreamWriter(writeStream);
                            writer.Write(data);
                            writer.Close();
                        }
                    }
                }
                
                // 读取响应
                using (var response = request.GetResponse())
                {
                    result = new RequestResult();
                    var httpRes = response as HttpWebResponse;
                    Debug.Assert(httpRes != null, "Null response");
                    result.statusCode = (int) httpRes.StatusCode; 
                    
                    using (var input = httpRes.GetResponseStream())
                    {
                        Debug.Assert(input != null, "Null response stream");
                        if (option != null && option.resultInBytes)
                        {
                            byte[] buffer = new byte[16 * 1024];
                            using (MemoryStream ms = new MemoryStream())
                            {
                                int read;
                                while (input.CanRead && (read = input.Read(buffer, 0, buffer.Length)) > 0)
                                {
                                    ms.Write(buffer, 0, read);
                                }
                                result.bytes = ms.ToArray();
                            }
                        }
                        else
                        {
                            using (var reader = new StreamReader(input, Encoding.UTF8))
                            {
                                result.body = reader.ReadToEnd();
                            }
                        }
                    }
                }
            }
            catch (Exception e)
            {
                string msg = string.Format("Network exception: {0}\n {1}", e.Message, e.StackTrace);
                Debug.LogError(msg);
            }

            return result;
        }

        void SetRequestHeaders(HttpWebRequest request, Dictionary<string, string> headers)
        {
            foreach (var header in headers)
            {
                var key = header.Key.ToLower();
                if (key == "user-agent" 
                    || key == "host")
                    request.UserAgent = header.Value;
                else if (key == "content-type")
                    request.ContentType = header.Value;
                else if (key == "referer")
                    request.Referer = header.Value;
                else
                    request.Headers.Add(header.Key, header.Value);
            }
        }

        string GetQueryString(Dictionary<string, string> parameters)
        {
            if (parameters == null || parameters.Count == 0)
                return "";
            StringBuilder sb = new StringBuilder();
            int i = 0;
            foreach (var parameter in parameters)
            {
                sb.Append(Uri.EscapeDataString(parameter.Key) + "=" + Uri.EscapeDataString(parameter.Value));
                if (i != parameters.Count - 1)
                    sb.Append("&");
                i++;
            }
            return sb.ToString();
        }
        
        private static bool CheckValidationResult(object sender, X509Certificate certificate, X509Chain chain, SslPolicyErrors errors)  
        {
            return true; 
        }
        
    }
}