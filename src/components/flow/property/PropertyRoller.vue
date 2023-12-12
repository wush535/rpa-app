<template>
  <div>
    <el-form label-width="80px" :model="formData">
      <el-form-item label="节点名称:">
        <el-input v-model="formData.name"></el-input>
      </el-form-item>
	  
	  
	  <el-form-item label="滚动速度:" >
	  		<el-input v-model="formData.scrollSpeed"></el-input>
	  </el-form-item>
	  
	  <el-form-item label="滚动次数:" >
	  		<el-input v-model="formData.scrollNum"></el-input>
	  </el-form-item>
	  
	  
	  <el-form-item label="失败退出:">
		<el-switch v-model="formData.isExit" active-text="失败退出" style="width: 100%;">
		</el-switch> 
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
import dict from "../../comm/dict.vue"
export default {
  name: 'PropertyJdbc',
  components: { dict },
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
			operaType: '2',
			path: undefined,
			descType: '3',
			desc: undefined,
			isExit: true,
			sleepSecond: 1,
			maxSecond: 18,
			resourceType: undefined,
			walletType: undefined,
		}
    }
  }, 
  methods: {
	dictMyChange(val){
		this.$data.formData.walletType = val
	},
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
