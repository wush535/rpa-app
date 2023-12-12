import ImageNode from './base/ImageNode.js'


// 图片-用户节点
class TaskWalletView extends ImageNode.view {
  getImageHref () {
    return require('../background/钱包.png');
  }
}


export default {
  type: 'taskWallet',
  view: TaskWalletView,
  model: ImageNode.model
}

