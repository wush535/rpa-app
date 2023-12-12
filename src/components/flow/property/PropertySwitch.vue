<template>
  <div>
    <el-form label-width="80px" :model="formData">
      <el-form-item label="节点名称:">
        <el-input v-model="formData.name"></el-input>
      </el-form-item>
	
	<el-form-item label="切换类型:"  >
	  <el-select v-model="formData.switchType" placeholder="请选择" style="width: 100%;">
	     <el-option v-for="item in switchTypes" :key="item.value"
	       :label="item.label" :value="item.value">
	     </el-option>
	   </el-select>
	</el-form-item>
	
	
	<el-form-item label="path类型:" v-if="formData.switchType == '2'" >
	  <el-select v-model="formData.switchPathType" placeholder="请选择" style="width: 100%;">
	     <el-option v-for="item in options" :key="item.value"
	       :label="item.label" :value="item.value">
	     </el-option>
	   </el-select>
	</el-form-item>
	
      <el-form-item label="第几个窗口:"  v-if="formData.switchType == '1'">
        <el-input v-model="formData.switchText"></el-input>
      </el-form-item>
	  <el-form-item label="path:"  v-else-if="formData.switchType == '2'">
	    <el-input v-model="formData.switchText"></el-input>
	  </el-form-item>
	  
	  <el-form-item label="失败退出:">
		<el-switch v-model="formData.isExit" active-text="失败退出" style="width: 100%;">
		</el-switch> 
	  </el-form-item>
	  
	  <el-form-item label="等待最大时间:">
	  		  <el-input v-model="formData.maxSecond"></el-input>
	  </el-form-item>
	  
	  <el-form-item label="休眠时间:">
		  <el-input v-model="formData.sleepSecond"></el-input>
	  </el-form-item>
	  
       <el-form-item>
        <el-button type="primary" @click="onSubmit">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  name: 'PropertyIf',
  props: {
    nodeData: Object,
    lf: Object || String,
  },
  mounted() {
    const { properties, text } = this.$props.nodeData;
    if (properties) {
      this.$data.formData = Object.assign({}, this.$data.formData, properties)
    }
    if (text && text.value) {
      this.$data.formData.text = text.value
    }
    if (text && text.value) {
      this.$data.text = text.value
    }
	
	const nodeData = this.$props.nodeData;
	nodeData.properties = this.$data.form;
	this.$props.lf.setProperties(nodeData.id, this.$data.form);
  },
  data () {
    return {
		switchTypes: [{
			value: '1',
			label: '1-标签页'
		  }, {
			value: '2',
			label: '2-iframe'
		}, {
			value: '3',
			label: '3-跳出iframe'
		}],
	   options: [{
			value: '1',
			label: '1-xpath'
		  }, {
			value: '2',
			label: '2-cssPath'
		 }],
		formData:{
			text: undefined,
			pathType: '1',
			path: undefined,
			descType: '1',
			desc: undefined,
			isExit: true,
			ifType: '1',
			sleepSecond: 1,
			maxSecond: 18,
			switchType: '2',
			switchPathType: '1',
		}
    }
  }, 
  methods: {
    onSubmit() {
      const { id } = this.$props.nodeData;
      this.$props.lf.setProperties(id, {
        ...this.$data.formData
      });
      console.log(6666, this.$data.formData);
      this.$props.lf.updateText(id, this.$data.formData.text);
      this.$emit('onClose')
    },
  }
}
</script>
<style scoped>
</style>
