--不同环境下路径不同
package.cpath = package.cpath .. ';C:/Users/OSoleMio/AppData/Roaming/JetBrains/Rider2021.1/plugins/EmmyLua/classes/debugger/emmy/windows/x64/?.dll'
pcall(function()
    local dbg = require('emmy_core')
    dbg.tcpConnect('localhost', 9966)
end)
