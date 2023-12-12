import ImageNode from './base/ImageNode.js'


// 图片-用户节点
class TaskJdbcView extends ImageNode.view {
  getImageHref () {
    return require('../background/数据库.png');
  }
}


export default {
  type: 'taskJdbc',
  view: TaskJdbcView,
  model: ImageNode.model
}
