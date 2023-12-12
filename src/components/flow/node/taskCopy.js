import ImageNode from './base/ImageNode.js'


// 图片-用户节点
class TaskCopyView extends ImageNode.view {
  getImageHref () {
    return require('../background/复制.png');
  }
}


export default {
  type: 'taskCopy',
  view: TaskCopyView,
  model: ImageNode.model
}
