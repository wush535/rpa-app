import ImageNode from './base/ImageNode.js'


// 图片-用户节点
class TaskWinClickView extends ImageNode.view {
  getImageHref () {
    return require('../background/点击win.png');
  }
}

export default {
  type: 'taskWinClick',
  view: TaskWinClickView,
  model: ImageNode.model
}
