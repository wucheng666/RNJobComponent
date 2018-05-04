import request from '/utils/request';
import Constants from '/configs/constants'

module.exports = {

    /**
     * 查询列表；
     * @param data
     */
    queryList: (data, successCallback) => {
        request.post(`${Constants.apiHost}/xx/xxx/queryList`, data, successCallback, true);
    }
};