FilePond.registerPlugin(
  FilePondPluginImagePreview,
  FilePondPluginImageResize,
  FilePondPluginFileEncode,
)

FilePond.setOptions({
  stylePanelAspectRatio: 300 / 200,
  imageResizeTargetWidth: 200,
  imageResizeTargetHeight: 300,
})

FilePond.parse(document.body);
  

 

