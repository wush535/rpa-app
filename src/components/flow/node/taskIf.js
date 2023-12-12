import ImageNode from './base/ImageNode.js'


// 图片-用户节点
class TaskIfView extends ImageNode.view {
  getImageHref () {
    return require('../background/条件.png');
  }
}


export default {
  type: 'taskIf',
  view: TaskIfView,
  model: ImageNode.model
}

