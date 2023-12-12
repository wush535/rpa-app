import ImageNode from './base/ImageNode.js'


// 图片-用户节点
class TaskCookieView extends ImageNode.view {
  getImageHref () {
    return require('../background/cookie.png');
  }
}


export default {
  type: 'taskCookie',
  view: TaskCookieView,
  model: ImageNode.model
}
