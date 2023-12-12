import ImageNode from './base/ImageNode.js'


// 图片-用户节点
class TaskClickView extends ImageNode.view {
  getImageHref () {
    return require('../background/点击.png');
  }
}

export default {
  type: 'taskClick',
  view: TaskClickView,
  model: ImageNode.model
}
