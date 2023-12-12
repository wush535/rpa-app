import ImageNode from './base/ImageNode.js'


// 图片-用户节点
class TaskWinCloseView extends ImageNode.view {
  getImageHref () {
    return require('../background/关闭win.png');
  }
}

export default {
  type: 'taskWinClose',
  view: TaskWinCloseView,
  model: ImageNode.model
}
