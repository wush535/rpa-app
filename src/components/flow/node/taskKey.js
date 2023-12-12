import ImageNode from './base/ImageNode.js'


// 图片-用户节点
class TaskKeyView extends ImageNode.view {
  getImageHref () {
    return require('../background/按键.png');
  }
}


export default {
  type: 'taskKey',
  view: TaskKeyView,
  model: ImageNode.model
}
