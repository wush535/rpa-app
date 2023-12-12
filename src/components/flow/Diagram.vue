<template>
	<div class="diagram">
		<diagram-toolbar class="diagram-toolbar" v-if="lf" :lf="lf" :activeEdges="activeEdges" @catData="$_catData" @saveGraph="$_saveGraph" />
		<div class="diagram-main">
		  <diagram-sidebar class="diagram-sidebar" @dragInNode="$_dragInNode" />
		  <div class="diagram-container" ref="container">
			<div class="diagram-wrapper">
			  <div class="lf-diagram" ref="diagram"></div>
			</div>
		  </div>
		</div>
		<!-- 属性面板 -->
		<el-drawer title="设置节点属性" :visible.sync="dialogVisible" direction="rtl" size="600px">
		  <PropertyDialog v-if="dialogVisible" :nodeData="activeNodes" :lf="lf" @setPropertiesFinish="closeDialog" >
		  </PropertyDialog>
		</el-drawer>
		<!-- 数据查看面板 -->
		<el-dialog title="数据" :visible.sync="dataVisible" width="50%">
		  <vue-json-pretty :path="'res'" :data="graphData"> </vue-json-pretty>
		</el-dialog>
	</div>
</template>

<script>
import LogicFlow from '@logicflow/core'
import { Menu, Snapshot, MiniMap, SelectionSelect } from '@logicflow/extension'
import '@logicflow/core/dist/style/index.css'
import '@logicflow/extension/lib/style/index.css'
import DiagramToolbar from './DiagramToolbar.vue' 
import DiagramSidebar from './DiagramSidebar.vue'
import PropertyDialog from './property/PropertyDialog.vue' 
import { registerCustomElement } from './node/index.js'

import { getTask, updateTask } from "@/api/home";
import VueJsonPretty  from 'vue-json-pretty';
import 'vue-json-pretty/lib/styles.css';

export default {
  name: 'Diagram',
  components: {
    DiagramToolbar,
	DiagramSidebar,
	PropertyDialog ,
	VueJsonPretty ,
  },
  data () {
    return {
	  id: undefined,
	  isEdit: false,
	  dialogVisible: false,
	  dataVisible: false,
	  graphData: undefined,
      sidebarWidth: 200,
      diagramWidth: 0,
      diagramHeight: 0,
      lf: '',
      filename: '',
	  taskInfo: {},
      activeNodes: [],
      activeEdges: [],
      properties: {}
    }
  },
  mounted () {
	if(this.$route.query.id){
		this.id = this.$route.query.id.substring(1,this.$route.query.id.length);
	}
	console.log("id11==="+this.$route.query.id+"===="+this.id);
	let that = this ;
	getTask(that.id).then(res => {
		if(res.code == 200){
			that.isEdit = true;
			that.taskInfo = res.data;
			//console.log("===="+that.taskInfo.flowData);
			if(null != that.taskInfo.flowData 
				&&  that.taskInfo.flowData != "" 
				&&  that.taskInfo.flowData != undefined ){
				that.initLogicFlow(JSON.parse(that.taskInfo.flowData))
			}else{
				that.initLogicFlow()
			}
		}else{
			that.isEdit = false;
			that.$message.error("任务基础信息获取失败，无法后续操作，请刷新！！");
		}
	});
  },
  methods: {
	closeDialog () {
		this.$_saveGraph();
		this.dialogVisible = false;
	},
    initLogicFlow (data) {
      // 引入框选插件
      LogicFlow.use(SelectionSelect)
      const lf = new LogicFlow({
        container: this.$refs.diagram,
		plugins: [
		  Menu,
		  MiniMap,
		  Snapshot,
		  SelectionSelect
		],
        overlapMode: 1,
        autoWrap: true,
        metaKeyMultipleSelected: true,
        keyboard: {
          enabled: true
        },
        grid: {
          visible: false,
          size: 5
        },
        background: {
          backgroundImage: 'url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2QwZDBkMCIgb3BhY2l0eT0iMC4yIiBzdHJva2Utd2lkdGg9IjEiLz48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZDBkMGQwIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=")',
          backgroundRepeat: 'repeat'
        }
      })
      lf.setTheme(
        {
          baseEdge: { strokeWidth: 1 },
          baseNode: { strokeWidth: 1 },
          nodeText: { overflowMode: 'autoWrap', lineHeight: 1.5 },
          edgeText: { overflowMode: 'autoWrap', lineHeight: 1.5 }
        }
      )
      // 注册自定义元素
      registerCustomElement(lf)
      lf.render(data)
      this.lf = lf
      /* this.lf.on('selection:selected,node:click,blank:click,edge:click', () => {
        this.$nextTick(() => {
          const { nodes, edges } = this.lf.getSelectElements()
          this.$set(this, 'activeNodes', nodes)
          this.activeNodes = nodes
          this.activeEdges = edges
          this.$_getProperty()
        })
      }) */
	  this.$_myEvent();
    },
	$_myEvent() {
	  this.lf.on('node:click', ({data}) => {
	    console.log('node:click', data)
		console.log("data.type==="+data.type);
		if(data.type != "start" && data.type != "end"){
			this.dialogVisible = true
		}
	    this.activeNodes = data
		this.$_getProperty();
	  })
	  this.lf.on('edge:click', ({data}) => {
	     console.log('edge:click', data)
		 console.log("data.type==="+data.type);
		 this.dialogVisible = true
	     this.activeNodes = data;
		 this.$_getProperty();
	  })

	  this.lf.on('edge:add', ({data}) => {
	    console.log('edge:add', data)
	  })
	  
	  this.lf.on('node:mousemove', ({data}) => {
	    console.log('node:mousemove')
	    this.moveData = data
	  })
 
	  this.lf.on('connection:not-allowed', (data) => {
	    this.$message({
	      type: 'error',
	      message: data.msg
	    })
	  })
	  this.lf.on('node:mousemove', () => {
	    console.log('on mousemove')
	  })
	},
	// 获取可以进行设置的属性
    $_getProperty () {
      let properties = {}
      const { nodes, edges } = this.lf.getSelectElements()
      nodes.forEach(node => {
        properties = { ...properties, ...node.properties }
      })
      edges.forEach(edge => {
        properties = { ...properties, ...edge.properties }
      })
      this.properties = properties
      return properties
    },
    $_dragInNode (type) {
      this.lf.dnd.startDrag({type});
    },
    $_changeNodeFill (color) {
      const { nodes } = this.lf.graphModel.getSelectElements()
      nodes.forEach(({ id }) => {
        this.lf.setProperties(id, {
          fill: color
        })
      })
    },
    $_setStyle (item) {
      this.activeNodes.forEach(({ id }) => {
        this.lf.setProperties(id, item)
      })
      this.activeEdges.forEach(({ id }) => {
        this.lf.setProperties(id, item)
      })
      this.$_getProperty()
    },
    $_setZIndex (type) {
      this.activeNodes.forEach(({ id }) => {
        this.lf.setElementZIndex(id, type)
      })
      this.activeEdges.forEach(({ id }) => {
        this.lf.setElementZIndex(id, type)
      })
    },
	$_catData(){
	  this.graphData = this.lf.getGraphData();
	  //console.log("this.graphData==="+JSON.stringify(this.graphData))
	  this.dataVisible = true;
	},
    $_saveGraph () {
	  let that = this;
	  if(!that.isEdit){
		  that.$message.error("任务基础信息获取失败，无法保存！！");
		  return ;
	  }
      const data = this.lf.getGraphData();
	  console.log("data===="+JSON.stringify(data))
      /* this.download(this.filename, JSON.stringify(data)) */
	  that.taskInfo.flowData = JSON.stringify(data);
	  updateTask(that.taskInfo).then(res=>{
		if(res.code == 200){
			that.$message.success("保存成功！！！");
		}else{
			that.$message.error(res.msg);
		}
	  }).catch(err=>{
		  that.$message.error(err);
	  })
    },
    download (filename, text) {
      window.sessionStorage.setItem(filename, text)
      const element = document.createElement('a')
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text))
      element.setAttribute('download', filename)
      element.style.display = 'none'
      document.body.appendChild(element)
      element.click()
      document.body.removeChild(element)
    }
  }
}
</script>

<style scoped>
.diagram {
  width: 100%;
  height: 100%;
}
.diagram * {
  box-sizing: border-box;
}
.diagram-toolbar {
  position: absolute;
  top: 0;
  right: 30px;
  height: 70px;
  width: 450px;
  display: flex;
  align-items: center;
  border: 1px solid #e7e7e7;
  z-index: 10;
  background: hsla(0,0%,100%,.8);
}
.diagram-main {
  display: flex;
  width: 100%;
  height: 100%;
}
.diagram-sidebar {
  width: 260px;
  height: calc(100% - 40px);
  border-right: 1px solid #dadce0;
  padding: 10px;
}
.diagram-panel {
  width: 300px;
  background: #fff;
  height: calc(100% - 40px);
  position: absolute;
  right: 0px;
  top: 40px;
  border-left: 1px solid #dadce0;
}
.diagram-container {
  flex: 1;
}
/* 由于背景图和gird不对齐，需要css处理一下 */
.diagram /deep/ .lf-background {
  left: -9px;
}
.diagram-wrapper {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
}
.lf-diagram {
  box-shadow: 0px 0px 4px #838284;
  width: 100%;
  height: 100%;
}
::-webkit-scrollbar {
  width: 9px;
  height: 9px;
  background: white;
  border-left: 1px solid #e8e8e8;
}
::-webkit-scrollbar-thumb {
  border-width: 1px;
  border-style: solid;
  border-color: #fff;
  border-radius: 6px;
  background: #c9c9c9;
}
::-webkit-scrollbar-thumb:hover {
  background: #b5b5b5;
}
</style>