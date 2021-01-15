import Vue from 'vue'
import VueI18n from 'vue-i18n'

import axios from 'axios'

Vue.use(VueI18n)
const locales = {
    en: require('../lang/en'),

    zh: require('../lang/zh')

    
}
const DEFAULT_LANG = 'en'
export const i18n = new VueI18n({
    locale: DEFAULT_LANG,
    // 设置语言环境
    fallbackLocale: 'en', //未设置默认语言的话就从这里面找
    messages: locales // 设置语言环境信息
})

const loadedLanguages = [DEFAULT_LANG] // 我们的预装默认语言

function setI18nLanguage(lang) {
    i18n.locale = lang
        //设置i18的默认语言
    axios.defaults.headers.common['Accept-Language'] = lang
        //设置ajax请求的语言
    document.querySelector('html').setAttribute('lang', lang)
        //设置html语言
    return lang
}

export function loadLanguageAsync(lang) {
    if (i18n.locale !== lang) {
        //如果传入的变量 不等于i18插件的语言值（切换过一次，在切换第二遍就不会再去加载一遍了）

        if (!loadedLanguages.includes(lang)) {

            //如果加载的这个语言不包含在默认加载的语言里面
            return import (`../lang/${lang}`)
                // 去引入这个值对应的翻译文件
                //去异步加载他

            .then(msgs => {

                    //设置i18语言去切换成这个
                    i18n.setLocaleMessage(lang, msgs)
                        // 本地已经加载的语言加入loadedLanguages
                    loadedLanguages.push(lang)
                        // 返回设置的这个语言
                    return setI18nLanguage(lang)

                })
                .catch(() => {

                })
        }

        return Promise.resolve(setI18nLanguage(lang))
    }
    return Promise.resolve(lang)
}


export default i18n
