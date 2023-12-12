
 if (window.ethereum) {
  try {
	await (window.ethereum as any).request({
	  method: 'wallet_switchEthereumChain',
	  params: [{
		chainId: "0x82751" // 目标链ID
	  }]
	})
	//console.log('wallet_switchEthereumChain');
  } catch (e) {
	//console.log('(e as any).code', (e as any).code);
	if ((e as any).code === 4902) {
	  try {
		//console.log('wallet_addEthereumChain');
		await (window.ethereum as any).request({
			method: 'wallet_addEthereumChain',
			params: [
			  {
				chainId: "0x82751", // 目标链ID
				chainName: 'Scroll Alpha Testnet',
				nativeCurrency: {
				  name: 'ETH',
				  symbol: 'ETH',
				  decimals: 18
				},
				rpcUrls: ['https://alpha-rpc.scroll.io/l2'], // 节点
				blockExplorerUrls: ['https://blockscout.scroll.io']
			  }
			]
		  })
	  } catch (ee) {
		//
	  }
	} else if ((e as any).code === 4001) return
  }
}