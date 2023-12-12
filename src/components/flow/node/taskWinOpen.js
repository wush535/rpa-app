import ImageNode from './base/ImageNode.js'


// 图片-用户节点
class TaskWinOpenView extends ImageNode.view {
  getImageHref () {
    return require('../background/开启win.png');
  }
}

export default {
  type: 'taskWinOpen',
  view: TaskWinOpenView,
  model: ImageNode.model
}
