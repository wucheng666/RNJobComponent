/**
 * 用例，这只是一个样例，并不能运行，
 * **/
import React from "react"
import {
    Alert,
    FlatList,
    LayoutAnimation,
    Modal,
    PanResponder,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableHighlight,
    TouchableNativeFeedback,
    TouchableOpacity,
    View
} from "react-native"
import { MainStyle } from "/configs"
import { NavigationComponent } from "/base"

import { DateTimePicker, Form, Input, Label, Picker, Region } from "/modules"
import RowCell from "./components/rowCell2"
import Api from './api';

import IFlatList from "./iFlatList"

class Product extends NavigationComponent {
    constructor(props) {
        super(props)

        this.state = {
            refreshing: false,

            condition: {
                name: "",
                state: "1",

                pageNum: 0,
                pageSize: 10
            },
            //真实数据（已上架）
            data: {
                dataList: [],
                pageNum: 0,
                totalCount: 0
            }
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={{ flex: 1 }}>
                    <IFlatList
                        style={styles.flatList}
                        data={this.state.data}
                        id={"id"}
                        cellHeight={86}
                        condition={this.state.condition}
                        refreshing={this.state.refreshing}
                        requestFn={Api.queryProductList}
                        callBack={this._iflatListCallBack}>
                        {this._renderItem}
                    </IFlatList>
                </View>
            </View>
        )
    }

    //回调，用户设置state中的值
    _iflatListCallBack = obj => {
        this.setState(obj)
    }

    //这里是行内具体的布局
    _renderItem = ({ item, index }) => {
        return (
            <RowCell
                optId={this.optId}
                ref={component => {
                    this.reflist.push(component)
                }}
                id={item.id}
                item={item}
                getDetail={this._getProductDetail}
                deleteProduct={this._delete}
                updateProductState={this._updateProductState}
                pre_hide={this.pre_hide}
                pre_id={this.pre_id}
                stopDropdown={this._stopDropdown}
            />
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: MainStyle.background.color.main
    },
    flatList: {
        backgroundColor: MainStyle.background.color.main,
        marginTop: 10
    }
})

export default Product
