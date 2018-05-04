/**
 * 针对RN的flatList再封装一层
 */
import React, { Component } from "react"
import { FlatList, NativeModules, View, StyleSheet } from "react-native"
import { MainStyle } from "/configs"
import { NavigationComponent } from "/base"
import NoContent from "../../default-page/noContent"
import Loading from "../../default-page/loading"
import LoadingError from "../../default-page/loadingError"

export default class IFlatList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            //缺省页状态
            isLoading: true, // 加载页
            hasNoContent: false, // 暂无内容页
            isLoadingError: false //加载失败页
        }
    }

    static defaultProps = {
        // this.state中需要定义缺省页状态 ： isLoading : true, hasNoContent : false, isLoadingError : false,
        // this.state中canSearch用来控制是否有下拉搜索
        style: {}, // 必填，flatList的样式
        children: "", // 必填，行能具体结构
        data: {}, //必填，为所有数据对象 (这里需要在 this.state中定义，格式为：data : {dataList : [], pageNum : 0, totalCount : 0})
        id: "", // 必填，行唯一主键的字段名
        cellHeight: 86, //必填，行高度
        // methodName: "", //必填，渲染调用的接口名为Api下面的
        condition: "", //必填，查询列表接口入参 (这里需要在 this.state中定义，格式为：condition : {pageNum : 0,pageSize : 10} 这里condition中至少包含pageNum,pageSize二个字段)
        refreshing: "", //必填，同flatList (这里需要在 this.state中定义)
        isScrollEnabled: true, //非必填， 判断flatList是否可以滚动 (有侧滑时需要传)
        requestFn: () => {} //请求数据的接口
    }

    componentDidMount() {
        console.log("子组件，，，，")
        this._queryList(this.props.condition)
    }

    render() {
        let dataList = this.props.data.dataList

        return this.state.isLoading ? (
            <Loading />
        ) : this.state.hasNoContent ? (
            <NoContent />
        ) : this.state.isLoadingError ? (
            <LoadingError reload={() => this._queryProductList(this.state.condition)} />
        ) : (
            <FlatList
                style={this.props.style}
                extraData={dataList}
                data={dataList}
                renderItem={this.props.children}
                keyExtractor={(item, index) => "IFlatList_" + item[this.props.id] + "_" + index}
                getItemLayout={this._getItemLayout}
                initialNumToRender={Math.floor(MainStyle.device.height / this.props.cellHeight)}
                ItemSeparatorComponent={this._separator}
                ListFooterComponent={this._separator}
                onEndReached={this._pullUpLoad.bind(this, this.props.condition)}
                onEndReachedThreshold={0.15}
                onRefresh={this._pullDownRefresh.bind(this, this.props.condition)}
                refreshing={this.props.refreshing}
                scrollEnabled={this.props.isScrollEnabled}
            />
        )
    }

    _separator = () => {
        return (
            <View
                style={{
                    borderBottomColor: "#EEEEEE",
                    borderBottomWidth: MainStyle.border.size.assit1 // StyleSheet.hairlineWidth
                }}
            />
        )
    }

    _getItemLayout = (data, index) => {
        return { length: this.props.cellHeight, offset: (this.props.cellHeight + 1) * index, index }
    }

    // 下拉刷新中；
    _pullDownRefresh = condition => {
        //是否需要下拉搜索
        this.props.callBack({ canSearch: true })

        if (__DEV__) {
            console.log("下拉刷新中111。。。")
        }

        this.props.callBack({ refreshing: true })

        condition.pageNum = 0
        this._queryList(condition)
    }

    // 上拉加载中；
    _pullUpLoad = condition => {
        let that = this
        if (__DEV__) {
            console.log("上拉刷新中222。。。")
        }

        this.props.callBack({ refreshing: true })

        let totalPage = Math.ceil(this.props.data.totalCount / condition.pageSize)
        if (condition.pageNum <= totalPage - 1 || condition.pageNum === 0) {
            this._queryList(condition)
        } else {
            this.props.callBack({ refreshing: false })
        }
    }

    _queryList = params => {
        let _self = this

        this.props.requestFn(
            params,
            (data, flag) => {
                if (__DEV__) {
                    //console.log(`queryAuntList-- data-->>${data}, flag-->>${flag}`);
                }

                let result = {}
                result.dataList = params.pageNum > 0 ? _self.props.data.dataList.concat(data.dataList) : data.dataList
                result.totalCount = data.totalCount

                let hasNoContent = false

                if (data.totalCount == 0) {
                    hasNoContent = true
                } else {
                    hasNoContent = false
                }

                if (flag) {
                    this.props.callBack({
                        data: result,
                        refreshing: false
                    })

                    this.setState({
                        //去除缺省页
                        isLoading: false,
                        hasNoContent: hasNoContent,
                        isLoadingError: false
                    })

                    params.pageNum = data.pageNum + 1
                    this.props.callBack(params)
                } else {
                    this.props.callBack({
                        refreshing: false
                    })

                    this.setState({
                        isLoadingError: true,
                        isLoading: false,
                        hasNoContent: false
                    })
                }
                this.props.callBack({ refreshing: false })
            },
            true
        )
    }
}
