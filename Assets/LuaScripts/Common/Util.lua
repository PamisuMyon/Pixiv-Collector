local util = require('xlua.util')

------ 把table转成string
-- author https://www.cnblogs.com/yougoo/p/11918508.html
-- sign 打印在最前面的一个标记
-- tab 待处理table
-- showAddress 是否显示table的地址
local function TableToString(sign, tab, showAddress)

    -- 缓存table地址，防止递归死循环
    local tabs = {};
    local check = function(cur_tab, key, parentKey, level)
        local tempP = tabs[(level-1) .. parentKey]
        while tempP do
            if tempP.id == tostring(cur_tab) then
                return false;
            end
            tempP = tempP.parent;
        end

        tabs[level .. key] = {};
        tabs[level .. key].id = tostring(cur_tab);
        tabs[level .. key].parent = tabs[(level-1) .. parentKey];

        return true;
    end

    -- 处理直接传入table的情况
    if tab == nil then
        tab = sign;
        sign = "table:";
    end

    local targetType = type(tab);
    if targetType == "table" then
        local isHead = false;
        local function dump(t, tKey, space, level)
            local temp = {};
            if not isHead then
                temp = {sign or "table:"};
                isHead = true;
            end

            if tKey ~= "_fields" then
                table.insert(temp, string.format("%s{", string.rep("    ", level)));
            end
            for k, v in pairs(t) do
                local key = tostring(k);
                -- 协议返回内容
                if key == "_fields" then
                    local fields = {};
                    for fk, fv in pairs(v) do
                        fields[fk.name] = fv;
                    end
                    table.insert(temp, dump(fields, key, space, level))
                    -- 如果是table模拟的类，忽略。 以下划线开头的字段, 忽略
                elseif key == "class" or string.sub(key, 1, string.len("_")) == "_" then
                    -- 这里忽略

                elseif type(v) == "table" then
                    if check(v, key, tKey, level) then
                        if showAddress then
                            table.insert(temp, string.format("%s%s: %s\n%s", string.rep("    ", level+1), key, tostring(v), dump(v, key, space, level + 1)));
                        else
                            table.insert(temp, string.format("%s%s: \n%s", string.rep("    ", level+1), key, dump(v, key, space, level + 1)));
                        end
                    else
                        table.insert(temp, string.format("%s%s: %s (loop)", string.rep("    ", level+1), key, tostring(v)));
                    end
                else
                    table.insert(temp, string.format("%s%s: %s", string.rep("    ", level+1), key, tostring(v)));
                end
            end
            if tKey ~= "_fields" then
                table.insert(temp, string.format("%s}", string.rep("    ", level)));
            end

            return table.concat(temp, string.format("%s\n", space));
        end
        return dump(tab, "", "", 0);
    else
        return tostring(tab);
    end
end

---将table中所有value转为string
---@param table void
local function StringifyTableValues(table)
    if not table then
        return
    end
    for k, v in pairs(table) do
        if v ~= nil and type(v) ~= string then
            table[k] = tostring(v)
        end
    end
end

local function Split(str, pattern)
    local t = {}
    local fpat = "(.-)" .. pattern
    local last_end = 1
    local s, e, cap = str:find(fpat, 1)
    while s do
        if s ~= 1 or cap ~= "" then
            table.insert(t,cap)
        end
        last_end = e+1
        s, e, cap = str:find(fpat, last_end)
    end
    if last_end <= #str then
        cap = str:sub(last_end)
        table.insert(t, cap)
    end
    return t
end

local function Trim(s)
    if not s then
        return s
    end
    return (string.gsub(s, "^%s*(.-)%s*$", "%1"))
end

local function InsertAll(t1, t2)
    if not t1 or not t2 then
        return
    end
    for _, v in pairs(t2) do
        table.insert(t1, v)
    end
end

local function UrlEncode(s)
    s = string.gsub(s,"([^%w%.%- ])",function(c) return string.format("%%%02X",string.byte(c)) end)
    return string.gsub(s," ","+")
end

local function UrlDecode(s)
    if not s then
        return s
    end
    s = string.gsub(s,'%%(%x%x)',function(h) return string.char(tonumber(h,16)) end)
    return s
end

local function SplitProxy(s)
    if not s then
        return
    end
    local split = Split(s, ':')
    local host = s
    local port = 80
    if #split > 1 then
        port = tonumber(split[#split])
        if port then
            host = string.gsub(s, ':'..tostring(port), '')
        end
    end
    return host, port
end

local function AddButtonListener(button, func)
    button.onClick:AddListener(func)
end

local function RemoveButtonListeners(button)
    print('BUtton:')
    print(tostring(button))
    print(tostring(button.onClick.AddListener))
    print(tostring(button.onClick.RemoveListener))
    print(tostring(button.onClick.RemoveAllListeners))
    button.onClick:RemoveAllListeners()
end

local function AddToggleListener(toggle, func)
    toggle.onValueChanged:AddListener(func)
end

local function RemoveToggleListeners(toggle)
    toggle.onValueChanged:RemoveAllListeners()
end

local function AddEventTriggerListener(trigger, func, index) 
    index = index or 0
    trigger.triggers[index].callback:AddListener(func)
end

local function RemoveEventTriggerListeners(trigger, index)
    index = index or 0
    trigger.triggers[index].callback:RemoveAllListeners()
end

local function Sleep(seconds, callback) 
    LuaManagerr.GetInstance():StartCoroutine(util.cs_generator(function() 
        coroutine.yield(CS.UnityEngine.WaitForSeconds(seconds))
        callback()
    end))
end

local function GenToken()
    math.randomseed(tostring(os.time()):reverse():sub(1, 7))
    return tostring(os.time())..tostring(math.random(1000))
end

return {
    TableToString = TableToString,
    StringifyTableValues = StringifyTableValues,
    Split = Split,
    Trim = Trim,
    InsertAll = InsertAll,
    UrlEncode = UrlEncode,
    UrlDecode = UrlDecode,
    SplitProxy = SplitProxy,
    AddButtonListener = AddButtonListener,
    RemoveButtonListeners = RemoveButtonListeners,
    AddToggleListener = AddToggleListener,
    RemoveToggleListeners = RemoveToggleListeners,
    AddEventTriggerListener = AddEventTriggerListener,
    RemoveEventTriggerListeners = RemoveEventTriggerListeners,
    Sleep = Sleep,
    GenToken = GenToken
}