import ImageNode from './base/ImageNode.js'


// 图片-用户节点
class TaskSelectView extends ImageNode.view {
  getImageHref () {
    return require('../background/选择.png');
  }
}


export default {
  type: 'taskSelect',
  view: TaskSelectView,
  model: ImageNode.model
}

