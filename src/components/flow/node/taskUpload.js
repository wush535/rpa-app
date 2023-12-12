import ImageNode from './base/ImageNode.js'


// 图片-用户节点
class TaskUploadView extends ImageNode.view {
  getImageHref() {
    return require('../background/上传.png');
  }
}


export default {
  type: 'taskUpload',
  view: TaskUploadView,
  model: ImageNode.model
}
