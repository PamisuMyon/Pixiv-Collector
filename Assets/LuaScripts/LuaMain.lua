---@type LuaApplication
local LuaApplication = require('LuaApplication')

---@type LuaApplication
local app = LuaApplication:GetInstance()

function OnDispose()
    if app then
        app:OnDispose()
    end
end

app:Init()
app:ShowLogin()
