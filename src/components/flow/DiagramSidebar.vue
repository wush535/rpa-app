<template>
  <div class="diagram-sidebar">
    <div>
      <h1 class="node-category-title">任务</h1>
      <div class="node-category">
        <div class="image-node" @mousedown="dragInNode('taskClick')">
			<div class="image-node image-click"></div>
			<span class="node-item_span">点击</span>
        </div>
		<div class="image-node" @mousedown="dragInNode('taskSend')">
			<div class="image-node image-send"></div>
			<span class="node-item_span">输入</span>
		</div>
		<div class="image-node" @mousedown="dragInNode('taskCopy')">
			<div class="image-node image-copy"></div>
			<span class="node-item_span">粘贴</span>
		</div>
		<div class="image-node" @mousedown="dragInNode('taskGo')">
			<div class="image-node image-go"></div>
			<span class="node-item_span">页面</span>
		</div>
      </div>
    </div>
    <div class="icon-item">
      <h1 class="node-category-title">钱包</h1>
	  <div class="node-category">
		  <div class="image-node" @mousedown="dragInNode('taskWallet')">
			  <div class="image-node image-wallet"></div>
			  <span class="node-item_span">点击</span>
		  </div>
		  <div class="image-node" @mousedown="dragInNode('taskJdbc')">
			  <div class="image-node image-jdbc"></div>
			  <span class="node-item_span">入库</span>
		  </div>
		  <div class="image-node" @mousedown="dragInNode('taskWalletSend')">
			  <div class="image-node image-wallet-send"></div>
			  <span class="node-item_span">输入</span>
		  </div>
	  </div>
      
    </div>
    <div class="icon-item">
      <h1 class="node-category-title">起始</h1>
	  <div class="node-category">
		  <div class="image-node" @mousedown="dragInNode('start')">
			  <div class="image-node image-start"></div>
			  <span class="node-item_span">开始</span>
		  </div>
		  <div class="image-node " @mousedown="dragInNode('end')">
			  <div class="image-node image-end"></div>
			  <span class="node-item_span">结束</span>
		  </div>
		  <div class="image-node " @mousedown="dragInNode('taskSelect')">
			  <div class="image-node image-select"></div>
			  <span class="node-item_span">选择</span>
		  </div>
		  
		  <div class="image-node " @mousedown="dragInNode('taskCookie')">
			  <div class="image-node image-cookie"></div>
			  <span class="node-item_span">cookie</span>
		  </div>
	  </div>
    </div>
	
	<div class="icon-item">
	  <h1 class="node-category-title">条件</h1>
	  <div class="node-category">
		  <div class="image-node" @mousedown="dragInNode('taskIf')">
			  <div class="image-node image-if"></div>
			  <span class="node-item_span">条件</span>
		  </div>
		  <div class="image-node " @mousedown="dragInNode('taskWait')">
			  <div class="image-node image-until"></div>
			  <span class="node-item_span">等待</span>
		  </div>
		  
		  <div class="image-node " @mousedown="dragInNode('taskSwitch')">
			  <div class="image-node image-switch"></div>
			  <span class="node-item_span">切换</span>
		  </div>
		  
		  <div class="image-node " @mousedown="dragInNode('taskRoller')">
				<div class="image-node image-roller"></div>
				<span class="node-item_span">滚动</span>
		  </div>
		  
	  </div>
	</div>
	
	<div class="icon-item">
	  <h1 class="node-category-title">条件</h1>
	  <div class="node-category">
		  <div class="image-node" @mousedown="dragInNode('taskScreenshot')">
			  <div class="image-node image-screenshot"></div>
			  <span class="node-item_span">截图</span>
		  </div>
		  <div class="image-node " @mousedown="dragInNode('taskKey')">
			  <div class="image-node image-key"></div>
			  <span class="node-item_span">按键</span>
		  </div>
	  </div>
	</div>
	
	<div class="icon-item">
	  <h1 class="node-category-title">window组件</h1>
	  <div class="node-category">
		  <div class="image-node" @mousedown="dragInNode('taskWinOpen')">
			  <div class="image-node image-open-win"></div>
			  <span class="node-item_span">启动</span>
		  </div>
		  
		  <div class="image-node" @mousedown="dragInNode('taskWinClick')">
			  <div class="image-node image-click-win"></div>
			  <span class="node-item_span">点击</span>
		  </div>
		  
		  <div class="image-node " @mousedown="dragInNode('taskWinInput')">
			  <div class="image-node image-input-win"></div>
			  <span class="node-item_span">输入</span>
		  </div>
		  
		  <div class="image-node " @mousedown="dragInNode('taskWinClose')">
			  <div class="image-node image-close-win"></div>
			  <span class="node-item_span">关闭</span>
		  </div>
	  </div>
	</div>
  </div>
</template>

<script>
import start from './node/start.js';
import end from './node/end.js';

export default {
  name: 'DiagramSidebar',
  methods: {
    dragInNode (type) {
      this.$emit('dragInNode', type)
    }
  },
  components: {
	  start,
	  end,
  }
}
</script>

<style scoped>
	
.image-click-win {
  background: url('./background/点击win.png');
  background-size: cover;
}

.image-open-win {
  background: url('./background/开启win.png');
  background-size: cover;
}

.image-input-win {
  background: url('./background/输入win.png');
  background-size: cover;
}

.image-close-win {
  background: url('./background/关闭win.png');
  background-size: cover;
}
	
	
	
.diagram-sidebar {
  width: 60%;
  user-select: none;
}
.node-category-title {
  margin: 0;
  font-size: 18px;
  display: block;
  border-bottom: 1px solid #e5e5e5;
  line-height: 30px;
  padding-bottom: 6px;
  margin-bottom: 6px;
}
.node-item {
  width: 35px;
  height: 35px;
  margin-right: 5px;
  display: inline-block;
}

.node-category {margin-bottom: 10px;
  border-bottom: 1px solid #e5e5e5;
  padding-bottom: 12px;
}

.icon-item{
	margin: 8px 5px;
}

.image-cursor {
  display: inline-block;
  width: 50px;
  height: 50px;
  cursor: pointer;
}


.image-node, .icon-node {
  display: inline-block;
  width: 42px;
  height: 42px;
  margin: 5px 15px 0px 0px;
  cursor: pointer;
}

.node-item_span {
	width: 42px;
	height: 42px;
	display: inline-block;
	margin: 5px 15px 0px 0px;
	text-align: center;
}
.image-setting {
  background: url('./background/复制.png');
  background-size: cover;
}

.image-start {
  background: url('./background/开始.png');
  background-size: cover;
}

.image-end {
  background: url('./background/结束.png');
  background-size: cover;
}


.image-wallet {
  background: url('./background/钱包.png');
  background-size: cover;
}

.image-wallet-send {
  background: url('./background/钱包1.png');
  background-size: cover;
}

.image-click {
  background: url('./background/点击.png');
  background-size: cover;
}

.image-send {
  background: url('./background/输入.png');
  background-size: cover;
}

.image-copy {
  background: url('./background/复制.png');
  background-size: cover;
}

.image-go {
  background: url('./background/web.png');
  background-size: cover;
}

.image-jdbc {
  background: url('./background/数据库.png');
  background-size: cover;
}

.image-if {
  background: url('./background/条件.png');
  background-size: cover;
}

.image-until {
  background: url('./background/等待.png');
  background-size: cover;
}

.image-switch {
  background: url('./background/切换.png');
  background-size: cover;
}

.image-select {
  background: url('./background/选择.png');
  background-size: cover;
}

.image-cookie {
  background: url('./background/cookie.png');
  background-size: cover;
}

.image-roller {
  background: url('./background/鼠标.png');
  background-size: cover;
}

.image-screenshot {
  background: url('./background/截图.png');
  background-size: cover;
}

.image-upload {
  background: url('./background/上传.png');
  background-size: cover;
}


.image-key {
  background: url('./background/按键.png');
  background-size: cover;
}
</style>
