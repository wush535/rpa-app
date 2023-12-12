<template>
  <div>
    <el-form label-width="80px" :model="formData">
		<el-form-item label="节点名称:">
			<el-input v-model="formData.name"></el-input>
		</el-form-item>
	
		<el-form-item label="条件"  >
		  <el-select v-model="formData.ifText" placeholder="请选择" style="width: 100%;">
		     <el-option v-for="item in ifTexts" :key="item.value"
		       :label="item.label" :value="item.value">
		     </el-option>
		   </el-select>
		</el-form-item>
	  
		<el-form-item>
			<el-button type="primary" @click="onSubmit">保存</el-button>
		</el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  name: 'PropertyLine',
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
		ifTexts: [{
			value: 'Y',
			label: 'Y-是'
		  }, {
			value: 'N',
			label: 'N-否'
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
			ifText: undefined
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
