import ImageNode from './base/ImageNode.js'


// 图片-用户节点
class TaskRollerView extends ImageNode.view {
  getImageHref () {
    return require('../background/鼠标.png');
  }
}


export default {
  type: 'taskRoller',
  view: TaskRollerView,
  model: ImageNode.model
}
