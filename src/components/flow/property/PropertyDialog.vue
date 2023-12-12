<template>
  <div class="property-dialog">
	<PropertyWait :nodeData="nodeData" :lf="lf" @onClose="handleClose" v-if="$props.nodeData.type == 'taskWait'"/>
	<PropertyIf :nodeData="nodeData" :lf="lf" @onClose="handleClose" v-else-if="$props.nodeData.type == 'taskIf' "/>
	<PropertyLine :nodeData="nodeData" :lf="lf" @onClose="handleClose" v-else-if="$props.nodeData.type == 'polyline' "/>
	<PropertyWeb :nodeData="nodeData" :lf="lf" @onClose="handleClose" v-else-if="$props.nodeData.type == 'taskGo' "/>
	<PropertySwitch :nodeData="nodeData" :lf="lf" @onClose="handleClose" v-else-if="$props.nodeData.type == 'taskSwitch' "/>
	<PropertyJdbc :nodeData="nodeData" :lf="lf" @onClose="handleClose" v-else-if="$props.nodeData.type == 'taskJdbc' "/>
	<PropertyCopy :nodeData="nodeData" :lf="lf" @onClose="handleClose" v-else-if="$props.nodeData.type == 'taskCopy' "/>
	
	<PropertySelect :nodeData="nodeData" :lf="lf" @onClose="handleClose" v-else-if="$props.nodeData.type == 'taskSelect' "/>
	
	<PropertyWallet :nodeData="nodeData" :lf="lf" @onClose="handleClose" v-else-if="$props.nodeData.type == 'taskWallet' "/>
	<PropertyWalletSend :nodeData="nodeData" :lf="lf" @onClose="handleClose" v-else-if="$props.nodeData.type == 'taskWalletSend' "/>
	
	<PropertyCookie :nodeData="nodeData" :lf="lf" @onClose="handleClose" v-else-if="$props.nodeData.type == 'taskCookie' "/>
	<PropertyRoller :nodeData="nodeData" :lf="lf" @onClose="handleClose" v-else-if="$props.nodeData.type == 'taskRoller' "/>
	<PropertyScreenshot :nodeData="nodeData" :lf="lf" @onClose="handleClose" v-else-if="$props.nodeData.type == 'taskScreenshot' "/>
	<PropertyUpload :nodeData="nodeData" :lf="lf" @onClose="handleClose" v-else-if="$props.nodeData.type == 'taskUpload' "/>
	<PropertyKey :nodeData="nodeData" :lf="lf" @onClose="handleClose" v-else-if="$props.nodeData.type == 'taskKey' "/>
	
	<PropertyWinClick :nodeData="nodeData" :lf="lf" @onClose="handleClose" v-else-if="$props.nodeData.type == 'taskWinClick' "/>
	<PropertyWinInput :nodeData="nodeData" :lf="lf" @onClose="handleClose" v-else-if="$props.nodeData.type == 'taskWinInput' "/>
	<PropertyWinOpen :nodeData="nodeData" :lf="lf" @onClose="handleClose" v-else-if="$props.nodeData.type == 'taskWinOpen' "/>
	<PropertyWinClose :nodeData="nodeData" :lf="lf" @onClose="handleClose" v-else-if="$props.nodeData.type == 'taskWinClose' "/>

	<Property :nodeData="nodeData" :lf="lf" @onClose="handleClose" v-else/>
  </div>
</template>
<script>
import Property from './Property.vue'
import PropertyWait from './PropertyWait.vue'
import PropertyIf from './PropertyIf.vue'
import PropertyLine from './PropertyLine.vue'
import PropertyWeb from './PropertyWeb.vue'
import PropertySwitch from './PropertySwitch.vue'
import PropertyJdbc from './PropertyJdbc.vue'
import PropertyCopy from './PropertyCopy.vue'
import PropertyWallet from './PropertyWallet.vue'
import PropertyWalletSend from './PropertyWalletSend.vue'
import PropertySelect from './PropertySelect.vue'
import PropertyCookie from './PropertyCookie.vue'
import PropertyRoller from './PropertyRoller.vue'
import PropertyScreenshot from './PropertyScreenshot.vue'
import PropertyUpload from './PropertyUpload.vue'
import PropertyKey from './PropertyKey.vue'

import PropertyWinClick from './PropertyWinClick.vue'
import PropertyWinInput from './PropertyWinInput.vue'
import PropertyWinOpen from './PropertyWinOpen.vue'
import PropertyWinClose from './PropertyWinClose.vue'



export default {
  name: 'PropertyDialog',
  components: {PropertyWinClose,PropertyWinOpen,PropertyWinInput,PropertyWinClick,PropertyKey,PropertyScreenshot,PropertyUpload,PropertyCookie,PropertyRoller,Property, PropertySelect, 
				PropertyWait, PropertyIf, PropertyLine,PropertyWeb,PropertySwitch,PropertyJdbc,
				PropertyCopy,PropertyWallet,PropertyWalletSend},
  props: {
    nodeData: Object,
    lf: Object
  },
  data () {
    return {}
  },
  methods: {
    handleClose () {
      this.$emit('setPropertiesFinish')
    }
  }
}
</script>
<style>
.property-dialog{
  padding: 20px;
}
</style>
