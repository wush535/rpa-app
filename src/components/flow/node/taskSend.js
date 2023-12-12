import ImageNode from './base/ImageNode.js'


// 图片-用户节点
class TaskSendView extends ImageNode.view {
  getImageHref () {
    return require('../background/输入.png');
  }
}


export default {
  type: 'taskSend',
  view: TaskSendView,
  model: ImageNode.model
}

