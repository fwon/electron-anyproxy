//Local lang
import en from './en.js';
import zh from './zh-CN.js';

//Element lang
import Een from 'element-ui/lib/locale/lang/en'
import Ezh from 'element-ui/lib/locale/lang/zh-CN'

module.exports = {
    'zh-CN': Object.assign(zh, Ezh),
    'en': Object.assign(en, Een)
}