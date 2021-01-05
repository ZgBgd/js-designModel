import regeneratorRuntime from '../../../libs/regenerator-runtime/runtime.js'
import ajax from '../../../utils/ajax.js';
const app = getApp();
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		pageNum: 1,
		pageSize: 20,
		index:'',
		current:''
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	async onLoad(options) {
		const { ast } = options
	},

	/**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {
		const { list, total = 0 } = this.data
        if (!(list.length >= total)) {
            this.getList(true)
        }
    },

	searchInput(e) {
		const { value = '' } = e.detail;
		this.setData({ name: value, pageNum: 1 })
		this.getList()
    },

	async getList(pullDown) {
        ajax('xxxx')
	},

	goToDetail(e) {
		console.log('details')
	}
})

