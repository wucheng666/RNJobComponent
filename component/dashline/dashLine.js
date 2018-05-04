/**
 * 画一条横/竖的虚线（解决 ios/android 端不同字符（哈哈哈22AAAaa）出现线不直现象 textDecorationLine: "line-through" 的不兼容）
 *
 * 用法：
 * <DashLine style={{ backgroundColor: "#ffffff", marginLeft: 6}}
 *           lineStyle={{backgroundColor: "#999999"}}
 *           type="row"
 *           height={1}
 *           width={2}
 *           space={3}
 *           length={59}
 *           />
 */
import React, { Component } from "react"
import { Dimensions, StyleSheet, View } from "react-native"

export default class DashLine extends Component {
    static defaultProps = {
        type: "row", // 默认行, 列为：column
        height: 2, // 必填，虚线的高度
        width: 1, // 必填，虚线的宽度
        space: 3, // 必填，虚线间间距
        style: {}, //必填，虚线的背景颜色
        lineStyle: {}, //必填，虚线的样式（主要用于设置线的颜色）
        length: Dimensions.get("window").width //虚线要展示的最大长度，默认屏宽
    }

    render() {
        let width = this.props.type == "row" ? this.props.width : this.props.height
        let height = this.props.type == "row" ? this.props.height : this.props.width

        //获取虚线的渲染个数
        let len = Math.ceil(this.props.length / ((this.props.type == "row" ? width : height) + this.props.space))
        let arr = []
        for (let i = 0; i < len; i++) {
            arr.push(i)
        }

        let parentStyle =
            this.props.type == "row"
                ? { flexDirection: "row", width: this.props.length }
                : { flexDirection: "column", width: width }

        let type = this.props.type == "row" ? { marginRight: this.props.space } : { marginTop: this.props.space }

        return (
            <View style={[this.props.style, parentStyle]}>
                {arr.map((item, index) => {
                    return (
                        <View
                            key={"dash" + index}
                            style={[{ height: height, width: width }, this.props.lineStyle, type]}
                        />
                    )
                })}
            </View>
        )
    }
}

const styles = StyleSheet.create({})
