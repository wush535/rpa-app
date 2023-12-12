import { h } from '@logicflow/core'
import { RectResize } from '@logicflow/extension'

// 图片-基础节点
class ImageModel extends RectResize.model {
	initNodeData(data) {
    super.initNodeData(data)
    this.width = 80
    this.height = 80
  }
}


class ImageView extends RectResize.view {
  getImageHref () {
    return;
  }
  getResizeShape() {
    const { x, y, width, height, properties } = this.props.model
	let nodeData = this.props.model.getData();
	//console.log("nodeData============="+JSON.stringify(nodeData))
	let textStr = "还未命名";
	if(nodeData.type == "start"){
		textStr = "开始";
	}else if(nodeData.type == "end"){
		textStr = "结束";
	}else if(null != nodeData.properties && null != nodeData.properties.name){
		textStr = nodeData.properties.name;
	}
	//console.log("nodeData===="+JSON.stringify(nodeData))
    const href = this.getImageHref()
    const attrs = {
      x: x- 1/2 * width,
      y: y - 1/2 * height,
      width,
      height,
      href,
      // 根据宽高缩放
      preserveAspectRatio: 'none meet'
    }
	const myX = textStr.length * 5;
	const textAttrs = {
	  x: x - 1/6 * width - myX,
	  y: y + 5/6 * height
	}
    return h('g', {}, [
       h('image', { ...attrs }),
	   h('text', { ...textAttrs },[textStr]) 
    ]
    );
  }
}

export default{
  type: 'image-node',
  view: ImageView,
  model: ImageModel
}