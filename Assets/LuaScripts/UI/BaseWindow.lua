---@class BaseWindow
local BaseWindow = Class('BaseWindow')

---Ctor
---@param uiManager UIManager
function BaseWindow:Ctor(uiManager)
    ---@type UIManager
    self.uiManager = uiManager
    self.prefabName = ''
end

function BaseWindow:OnInit(go)
    self.gameObject = go
end

function BaseWindow:OnOpen(data)
    
end 

function BaseWindow:OnClose()
    
end

function BaseWindow:OnDispose()

end

return BaseWindow