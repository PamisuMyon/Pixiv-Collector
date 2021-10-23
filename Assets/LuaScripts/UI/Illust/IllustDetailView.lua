local BaseWindow = require('UI.BaseWindow')

---@class IllustDetailView
local IllustDetailView = Class('IllustDetailView', BaseWindow)

function IllustDetailView:Ctor(uiManager)
    IllustDetailView.super.Ctor(self, uiManager)
    self.prefabName = 'IllustDetailView'
end

---@param go UnityEngine.GameObject
function IllustDetailView:OnInit(go)
    IllustDetailView.super.OnInit(self, go)
    self.imagePanel = go.transform:Find('Panel/ImagePanel'):GetComponent('RectTransform')
    self.image = go.transform:Find('Panel/ImagePanel/Image'):GetComponent('Image')
    self.titleText = go.transform:Find('Panel/DetailPanel/TitleText'):GetComponent('Text')
    self.captionText = go.transform:Find('Panel/DetailPanel/CaptionText'):GetComponent('Text')
    self.detailText = go.transform:Find('Panel/DetailPanel/DetailText'):GetComponent('Text')
    ---@type PixivCollector.TagGridDataSource
    self.tagDataSource = go.transform:Find('Panel/DetailPanel/TagGrid'):GetComponent('TagGridDataSource')
    self.backButton = go.transform:Find('BackButton'):GetComponent('Button')
    self.backButton.onClick:AddListener(function() self.uiManager:NavBack() end)
end

function IllustDetailView:OnOpen(data)
    self.titleText.text = data.title
    self.captionText.text = data.caption
    local detail = 'id: '..tostring(data.id)..'\n'
        ..'作者: '..tostring(data.user and data.user.name or data.author_name)..'    时间: '..tostring(data.create_date)..'\n'
        ..'收藏: '..tostring(data.total_bookmarks)..'    浏览: '..tostring(data.total_view)..'\n'
        ..'Sanity level: '..tostring(data.sanity_level)
    self.detailText.text = detail
    
    local tags = {}
    for _, v in pairs(data.tags) do
        if v.name then
            table.insert(tags, v.name)
        end
        if v.translated_name then
            table.insert(tags, v.translated_name)
        end
        if type(v) == 'string' then
            table.insert(tags, v)
        end
    end
    self.tagDataSource:AddEntries(tags)
    
    ImageLoader.GetInstance():LoadAndFillParent(self.image, self.imagePanel, data.image_urls.large, data.imageKey)

    self.uiManager.menuView:HideButton()
end

function IllustDetailView:OnClose()
    self.uiManager.menuView:ShowButton()
end

function IllustDetailView:OnDispose()
    IllustDetailView.super.OnDispose(self)
    if self.backButton then
        self.backButton.onClick:RemoveAllListeners()
    end
end

return IllustDetailView