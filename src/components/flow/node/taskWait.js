import ImageNode from './base/ImageNode.js'


// 图片-用户节点
class TaskWaitView extends ImageNode.view {
  getImageHref () {
    return require('../background/等待.png');
  }
}


export default {
  type: 'taskWait',
  view: TaskWaitView,
  model: ImageNode.model
}

