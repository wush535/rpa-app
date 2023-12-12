import ImageNode from './base/ImageNode.js'


// 图片-用户节点
class TaskWinInputView extends ImageNode.view {
  getImageHref () {
    return require('../background/输入win.png');
  }
}

export default {
  type: 'taskWinInput',
  view: TaskWinInputView,
  model: ImageNode.model
}
