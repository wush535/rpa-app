import ImageNode from './base/ImageNode.js'


// 图片-用户节点
class TaskSwitchView extends ImageNode.view {
  getImageHref () {
    return require('../background/切换.png');
  }
}


export default {
  type: 'taskSwitch',
  view: TaskSwitchView,
  model: ImageNode.model
}

