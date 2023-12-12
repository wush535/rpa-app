import ImageNode from './base/ImageNode.js'


// 图片-用户节点
class TaskGoView extends ImageNode.view {
  getImageHref () {
    return require('../background/web.png');
  }
}


export default {
  type: 'taskGo',
  view: TaskGoView,
  model: ImageNode.model
}
