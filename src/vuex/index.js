// 主文件的作用一般就是整合操作
import {mapState,mapGetters,mapActions,mapMutations} from './helpers';
import {Store,install} from './store';



export default {
    Store,
    install,
    mapState,
    mapGetters,
    mapActions,
    mapMutations
}

export {
    Store,
    install,
    mapState,
    mapGetters,
    mapMutations,
    mapActions
}


// 两种方式都可以 可以采用默认导入，也可以采用 解构使用
