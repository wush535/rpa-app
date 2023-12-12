import ImageNode from './base/ImageNode.js'


// 图片-用户节点
class StartView extends ImageNode.view {
  getImageHref () {
    return require('../background/开始.png');
  }
}

export default {
  type: 'start',
  view: StartView,
  model: ImageNode.model
}
