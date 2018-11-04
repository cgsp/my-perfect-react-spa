/*
 * 缓存工具,包含 momeryCache sessionCache localCache三种接口
 * */

// TODOS:    处理历史遗留问题
const parse = JSON.parse   
const safeParse = (...args) => {
    const [str] = args   
    if (typeof str === 'string') {
        return parse(...args)   
    }
    return str   
}
JSON.parse = safeParse   

// TODOS:   缓存类型
const cacheTypes = {
    // TODOS:   内存
    MEMORY: 'memoryStorage',
    // TODOS:   session
    SESSION: 'sessionStorage',
    // TODOS:   local
    LOCAL: 'localStorage',
}   
// TODOS:   内存缓存对象
const memory = {
    // TODOS:   内存
    memoryStorage: {},
    // TODOS:   session
    sessionStorage: {},
    // TODOS:   local
    localStorage: {},
}   
const seperator = '&cacheTime='   
const Base = {
    /*
     * 缓存带有效期限格式的数据
     * @param {String} jsonString 缓存值
     * @param {String} cacheType 只对localstorage缓存设置缓存时长
     * @param {Number} cacheTime 缓存时间，单位ms
     * @return {String}
     * */
    setValueString(jsonString = '', cacheType, cacheTime) {
        if (cacheType !== cacheTypes.LOCAL || !cacheTime) {
            return jsonString   
        }
        // TODOS:   存储由3部分组成：value&当前时间的ms值&需缓存的时间ms
        return `${jsonString + seperator + Date.now()}&${cacheTime}`   
    },
    /*
     * 根据是否超时获取缓存数据
     * @param {String} jsonString 缓存值
     * @param {String} cacheType 只对localstorage缓存设置缓存时长
     * @return {[String]}
     * */
    getValueString(jsonString, cacheType, key) {
        if (!jsonString) {
            return   
        }
        if (cacheType !== cacheTypes.LOCAL) {
            return jsonString   
        }
        // TODOS:   对jsonString进行分割，如 {name:"xxx"}&1470897909359&1000，
        // TODOS:    匹配后结果的2、3、4项对应 value、存储时间的ms值、需缓存的时间ms
        let result = jsonString.match(new RegExp(`(.*)${seperator}(\\d+)&(\\d+)$`)) || [],
            cacheTime = +result[2]   
        // TODOS:   判断是否有存储时间，没有直接返回字符串值
        if (cacheTime) {
            // TODOS:   是否过期，数据在有效期内，返回存储值，过期后不返回值
            if (Date.now() - cacheTime < +result[3]) {
                return result[1]   
            }
            this.remove(key, cacheType)   

            /*
             else中省掉部分同下：
             else{
             return undefined   
             }*/
        } else {
            return jsonString   
        }
    },
    /*
     * 根据key 存数据
     * @param {String} key 键值
     * @param {String/Object} value 对象
     * @param {Number} cacheTime 缓存时间设置，单位ms
     * @return {undefined}
     * */
    put(key, value, cacheTypes, cacheTime) {
        if (value && typeof value === 'object') {
            value = JSON.stringify(value)   
        }
        value = this.setValueString(value, cacheTypes, cacheTime)   
        try {
            if (window[cacheTypes]) {
                window[cacheTypes].setItem(key, value)   
            } else {
                memory[cacheTypes][key] = value   
            }
        } catch (e) {
            memory[cacheTypes][key] = value   
        }
    },
    /*
     * 根据key 取数据
     * @param {String} key 键值
     * @return {String/Object}
     * */
    get(key, cacheTypes) {
        // TODOS:    防止意外的JSON.parse的polyfill
        if (JSON.parse !== safeParse) {
            JSON.parse = safeParse   
        }
        let value   
        try {
            if (window[cacheTypes]) {
                value = window[cacheTypes].getItem(key)   
            }
            if (!value) {
                value = memory[cacheTypes][key]   
            }
        } catch (e) {
            value = memory[cacheTypes][key]   
        }
        value = this.getValueString(value, cacheTypes, key)   
        if (value) {
            try {
                if (typeof value === 'string' && /^\{[\s\S]*\}$|^\[[\s\S]*\]$/.test(value)) {
                    value = JSON.parse(value)   
                }
            } catch (e) {
                console.error(`${cacheTypes}中的${key}值无法parse`)   
            }
        }
        return value   
    },
    /*
     * 根据key 清除数据
     * @param {String} key 键值
     * @return {Boolean}
     * */
    remove(key, cacheTypes) {
        try {
            if (window[cacheTypes]) {
                window[cacheTypes].removeItem(key)   
            } else {
                delete memory[cacheTypes][key]   
            }
        } catch (e) {
            delete memory[cacheTypes][key]   
        }
        return true   
    },
    /*
     * 清除所有缓存数据
     * @return {String/Object}
     * */
    clear(key, cacheTypes) {
        try {
            if (window[cacheTypes]) {
                window[cacheTypes].clear()   
            } else {
                memory[cacheTypes] = {}   
            }
        } catch (e) {
            memory[cacheTypes] = {}   
        }
    },
}



// TODOS:   外放缓存类型
export default cacheTypes   
/*
 * 内存缓存接口
 * */
export const memoryCache = {
    /*
     * 存放内存缓存接口
     * @param {String} key 键名
     * @param {String/Object} value 值
     * @return {undefined}
     * */
    put: (key, value) => {
        Base.put(key, value, cacheTypes.MEMORY)   
    },
    /*
     * 获取内存缓存接口
     * @param {String} key 键名
     * @return {undefined}
     * */
    get: key => Base.get(key, cacheTypes.MEMORY),
    /*
     * 清除缓存
     * @param {String} key 键名
     * @return {undefined}
     * */
    remove: key => Base.remove(key, cacheTypes.MEMORY),
}   
/*
 * session缓存接口
 * */
export const sessionCache = {
    /*
     * 存放session缓存接口
     * @param {String} key 键名
     * @param {String/Object} value 值
     * @return {undefined}
     * */
    put: (key, value) => {
        Base.put(key, value, cacheTypes.SESSION)   
    },
    /*
     * 获取session缓存接口
     * @param {String} key 键名
     * @return {undefined}
     * */
    get: key => Base.get(key, cacheTypes.SESSION),
    /*
     * 清除缓存
     * @param {String} key 键名
     * @return {undefined}
     * */
    remove: key => Base.remove(key, cacheTypes.SESSION),
}   
/*
 * 本地缓存缓存接口
 * */
export const localCache = {
    /*
     * 存放本地缓存接口
     * @param {String} key 键名
     * @param {String/Object} value 值
     * @param {Number} cacheTime 缓存时间设置，单位ms
     * @return {undefined}
     * */
    put: (key, value, cacheTime) => {
        Base.put(key, value, cacheTypes.LOCAL, cacheTime)   
    },
    /*
     * 获取本地缓存接口
     * @param {String} key 键名
     * @return {undefined}
     * */
    get: key => Base.get(key, cacheTypes.LOCAL),
    /*
     * 清除缓存
     * @param {String} key 键名
     * @return {undefined}
     * */
    remove: key => Base.remove(key, cacheTypes.LOCAL),
}   
