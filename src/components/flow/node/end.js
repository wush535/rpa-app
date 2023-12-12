import ImageNode from './base/ImageNode.js'


// 图片-用户节点
class EndView extends ImageNode.view {
  getImageHref () {
    return require('../background/结束.png');
  }
}

export default {
  type: 'end',
  view: EndView,
  model: ImageNode.model
}
