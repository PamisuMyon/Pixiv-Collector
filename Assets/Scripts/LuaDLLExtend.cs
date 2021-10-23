using System;
using System.Runtime.InteropServices;

namespace XLua.LuaDLL
{
    public partial class Lua
    {
        [DllImport(LUADLL, CallingConvention = CallingConvention.Cdecl)]
        public static extern int luaopen_rapidjson(IntPtr L);

        [MonoPInvokeCallback(typeof(lua_CSFunction))]
        public static int LoadRapidJson(IntPtr L)
        {
            return luaopen_rapidjson(L);
        }
    }
}