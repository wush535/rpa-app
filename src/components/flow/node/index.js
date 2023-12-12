
// image绘制图片节点
import start from './start.js'
import end from './end.js'

import taskGo from './taskGo.js'
import taskClick from './taskClick.js'
import taskSend from './taskSend.js'
import taskCopy from './taskCopy.js'
import taskWallet from './taskWallet.js'
import taskJdbc from './taskJdbc.js'

import taskWait from './taskWait.js'
import taskIf from './taskIf.js'

import taskSwitch from './taskSwitch.js'

import taskWalletSend from './taskWalletSend.js'

import taskSelect from './taskSelect.js'
import taskCookie from './taskCookie.js'
import taskRoller from './taskRoller.js'

import taskUpload from './taskUpload.js'
import taskScreenshot from './taskScreenshot.js'
import taskKey from './taskKey.js'


import taskWinClick from './taskWinClick.js'
import taskWinOpen from './taskWinOpen.js'
import taskWinInput from './taskWinInput.js'
import taskWinClose from './taskWinClose.js'


export const registerCustomElement = (lf) => {
  lf.register(start)
  lf.register(end)
  lf.register(taskGo)
  lf.register(taskClick)
  lf.register(taskSend)
  lf.register(taskCopy)
  lf.register(taskWallet)
  lf.register(taskJdbc)
  lf.register(taskWait)
  lf.register(taskIf)
  lf.register(taskSwitch)
  lf.register(taskWalletSend)
  lf.register(taskSelect)
  lf.register(taskCookie)
  lf.register(taskRoller)
  lf.register(taskUpload)
  lf.register(taskScreenshot)
  lf.register(taskKey)
  
  lf.register(taskWinClick)
  lf.register(taskWinOpen)
  lf.register(taskWinInput)
  lf.register(taskWinClose)
  
  // 注册边
/*  lf.register(Ployline)
  lf.register(Line)
  lf.register(Bezier) */
}

