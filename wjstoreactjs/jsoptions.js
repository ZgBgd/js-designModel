module.exports = {
    data:'state',
    onLoad:'componentDidMounted',
    onShow:'componentDidMounted',
    onHide:'componentWillUnmount',
    setData:'setState',
    WxService:'this.props.history',
    navigateTo:'push'
}