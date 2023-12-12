<template>
  <div class="toolbar">
		<div class="toolbar-item" :class="{'selection-active': selectionOpened}" @click="$_selectionSelect()">
			<area-select size="28" />
		</div>
		
		<div class="toolbar-item" @click="$_zoomIn()">
			<zoom-in size="28" />
		</div>
		
		<div class="toolbar-item" @click="$_zoomOut()">
			<zoom-out size="28" />
		</div>
		
		<div class="toolbar-item" @click="$_undo()">
			<step-back size="28" />
		</div>
		
		<div class="toolbar-item" @click="$_redo()">
			<step-foward size="28" />
		</div>
		
		
		<div class="toolbar-item" @click="$_download()">
			<Down size="28" />
		</div>
		
		<div class="toolbar-item" @click="$_catData()">
			<JsonView size="28" />
		</div>
		
		<div class="toolbar-item" @click="$_showMiniMap()">
			<MiniMap size="28" />
		</div> 
		
		<div class="toolbar-item" @click="$_saveGraph()">
			<saveView  size="32" ></saveView>
		</div>
  </div>
</template>

<script>
import ZoomIn from './icon/ZoomIn.vue'
import ZoomOut from './icon/ZoomOut.vue'
import StepBack from './icon/StepBack.vue'
import StepFoward from './icon/StepFoward.vue'
import AreaSelect from './icon/AreaSelect.vue'

import Down from './icon/Down.vue'
import MiniMap from './icon/MiniMap.vue'
import JsonView from './icon/JsonView.vue'
import saveView from './icon/saveView.vue'

export default {
  props: {
    lf: Object,
    activeEdges: Array,
    fillColor: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      selectionOpened: false,
      undoAble: false,
      redoAble: false,
      colors: '#345678',       
    }
  },
  mounted () {
    this.$props.lf.on('history:change', ({ data: { undoAble, redoAble } }) => {
      this.$data.redoAble = redoAble
      this.$data.undoAble = undoAble
    })
  },
  methods: {
    $_saveGraph () {
      this.$emit('saveGraph')
    },
    $_zoomIn () {
      this.$props.lf.zoom(true)
    },
    $_zoomOut () {
      this.$props.lf.zoom(false)
    },
    $_undo () {
      if (this.$data.undoAble) {
        this.$props.lf.undo()
      }
    },
    $_redo () {
      if (this.$data.redoAble) {
        this.$props.lf.redo()
      }
    },
	$_download(){
	  this.$props.lf.getSnapshot();
	},
    $_selectionSelect () {
      this.selectionOpened = !this.selectionOpened
      if (this.selectionOpened) {
		//console.log("1111===="+this.lf.openSelectionSelect);
		this.lf.updateEditConfig({
		      stopMoveGraph: true,
		    });
        this.lf.extension.selectionSelect.openSelectionSelect()
      } else {
		//console.log("2222===="+this.lf.closeSelectionSelect);
		this.lf.updateEditConfig({
		      stopMoveGraph: false,
		    });
        this.lf.extension.selectionSelect.closeSelectionSelect()
      }
    },
	$_showMiniMap() {
	  this.$props.lf.extension.miniMap.show(this.lf.graphModel.width - 250, 120)
	},
	$_catData(){
	  this.$emit('catData');
	},
  },
  components: {
    ZoomIn,
    ZoomOut,
    StepBack,
    StepFoward,
    AreaSelect,
	Down,
	MiniMap,
	JsonView,
	saveView
  },
}
</script>

<style scoped>
.toolbar{
	margin-top: 18px;
}
.toolbar-item {
  width: 28px;
  height: 28px;
  float: left;
  margin: 12px 10px;
  cursor: pointer;
  background:rgba(255,255,255,0.8);
}
.toolbar-color-picker {
  width: 24px;
  height: 24px;
  margin: 8px 4px;
}
.selection-active {
  background: #33a3dc;
}
</style>
