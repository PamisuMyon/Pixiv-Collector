using System;
using System.Security.Cryptography;
using System.Text;
using JetBrains.Annotations;
using Newtonsoft.Json;

namespace Pamisu.Common
{
    public class Util
    {
        public static string GetMD5Hash(string input)
        {
            MD5 md5Hasher = MD5.Create();
            byte[] data = md5Hasher.ComputeHash(Encoding.Default.GetBytes(input));
            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < data.Length; i++)
            {
                sb.Append(data[i].ToString("x2"));
            }
            return sb.ToString();
        }

        [CanBeNull]
        public static object ParseJson(string json, Type type)
        {
            return JsonConvert.DeserializeObject(json, type);
        }
    }
}