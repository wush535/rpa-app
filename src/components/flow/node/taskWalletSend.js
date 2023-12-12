import ImageNode from './base/ImageNode.js'


// 图片-用户节点
class TaskWalletSendView extends ImageNode.view {
  getImageHref () {
    return require('../background/钱包1.png');
  }
}


export default {
  type: 'taskWalletSend',
  view: TaskWalletSendView,
  model: ImageNode.model
}

