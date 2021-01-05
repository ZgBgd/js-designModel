
import ajax from '@util/ajax'
import globalData from '@config/globalData'
export default class PageClass extends Component {
	constructor(props) {
		super(props)
		this.state = {
			pageNum: 1,
			pageSize: 20,
			index: '',
			current: ''
		}
	}

	componentDidMounted = async options => {
		const { ast } = options
	}
	onReachBottom = () => {
		const { list, total = 0 } = this.state
		if (!(list.length >= total)) {
			this.getList(true)
		}
	}
	searchInput = e => {
		const { value = '' } = e.detail
		this.setState({ name: value, pageNum: 1 })
		this.getList()
	}
	getList = async pullDown => {
		ajax('xxxx')
	}
	goToDetail = e => {
		console.log('details')
	}

	render() {
		const {
			pageNum,
			pageSize,
			index,
			current
		} = this.state
		return <div><div className="mmm">
	{show ? <div></div> : null}
	{5.map((item, index) => {
    return <div>
		<span>{item}</span>
	</div>
  })}
</div></div>
	}

}