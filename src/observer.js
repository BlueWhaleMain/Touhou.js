
// 需要一个观察者，创建一个事件容器，并准备on等方法
export default function Observer() {
    this.msg = {};
}
// 向事件容器中添加事件，消息
Observer.prototype.addEventListener = function (type, cb) {
    if (type) {
        // 判断事件容器中，有没有当前传进来的这个类型
        const handledListener = this.msg[type];
        // 如何没有，走else
        if (handledListener) {
            // 如果有，直接给第一次设置的这个数组，添加个新数据
            handledListener.push(cb);
        } else {
            // 给他设置一个对应的属性，同时，属性值需要提前写成数组
            this.msg[type] = [cb];
        }
    } else {
        throw new Error("Must require event type.")
    }
};
Observer.prototype.dispatchEvent = function (type, detail) {
    if (type) {
        // 首先判断事件容器中是不是已经记录
        const handledListener = this.msg[type];
        if (handledListener && handledListener.length > 0) {
            // 如果已经记录了信息，那么就去执行这个消息对应的所有的处理函数
            for (let i = 0; i < handledListener.length; i++) {
                handledListener[i].call(this, {
                    type: type,
                    detail: detail
                });
            }
        }
    } else {
        throw new Error("Must require event type.")
    }
};
Observer.prototype.removeEventListener = function (type, cb) {
    if (type) {
        // 首先判断事件容器中是不是已经记录
        const handledListener = this.msg[type];
        if (handledListener) {
            // 准备保存符合传参的处理函数的索引
            let i = 0;
            // 遍历，判断，当前类型对应的每一个处理函数，依次作比较
            const onOff = handledListener.some((val, idx) => {
                i = idx;
                return val === cb;
            });
            // 判断是否获取到重复的函数
            if (onOff) {
                // 如果有，那么就在当前的消息处理函数的队列中，删除这个函数
                handledListener.splice(i, 1);
            }
        }
    } else {
        throw new Error("Must require event type.")
    }
};
Observer.prototype.clearEventListener = function (type) {
    if (type) {
        this.msg[type] = null
    } else {
        this.msg = {}
    }
};
// 默认全局观察者
export const ob = new Observer();
