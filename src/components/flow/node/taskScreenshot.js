import ImageNode from './base/ImageNode.js'


// 图片-用户节点
class TaskScreenshotView extends ImageNode.view {
  getImageHref () {
    return require('../background/截图.png');
  }
}


export default {
  type: 'taskScreenshot',
  view: TaskScreenshotView,
  model: ImageNode.model
}
