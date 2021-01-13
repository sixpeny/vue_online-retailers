import axios from 'axios'
import { Message } from 'element-ui'

//创建axios实例
const service = axios.create({
    baseURL: 'http://timemeetyou.com:8889/api/private/v1',
    timeout: 30 * 1000
});

//request拦截器
service.interceptors.request.use(
    config => {
        config.headers['authorization'] = window.sessionStorage.getItem('token');
        return config;
    },
    error => {
        Message.error('请求超时，请重试');
        return Promise.reject(error);
    }
);

//response拦截器
service.interceptors.response.use(
    response => {
        const res = response.data;
         if(res.meta.status !== 200){
            if(res.meta.status !== 201){
                Message({
                    type: 'error',
                    message: res.meta.msg
                });
                return;
            }
        }
        return res;
    },
    error => {
        Message.error('请求失败，请稍后重试');
        return Promise.reject(error);
    }
);

export default service
