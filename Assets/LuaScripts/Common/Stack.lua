---@class Stack
local Stack = Class('Stack')

function Stack:Push(...)
    local arg = {...}
    self.data = self.data or {}
    if next(arg) then
        for i = 1, #arg do
            table.insert(self.data, arg[i])
        end
    end
end

function Stack:Pop(num)
    num = num or 1
    assert(num > 0, 'num must grater than zero')
    local popTb = {}
    for i = 1, num do
        table.insert(popTb, self.data[#self.data])
        table.remove(self.data)
    end
    return table.unpack(popTb)
end

function Stack:List()
    for i = 1, #self.data do
        print(i, self.data[i])
    end
end

function Stack:Count()
    return #self.data
end

return Stack