interface Subscriber{
    update(column:string);
    name:string;
}

interface Publisher{
    // Map 集合的键为栏目信息，值为该栏目下的订阅者集合
    subs:Map<string,Subscriber[]>;
    listen(column:string,sub:Subscriber);
    trigger(column:string);
    unsubscribe(column:string,sub:Subscriber);
}

class SomePublisher implements Publisher{
    subs:Map<string,Subscriber[]>;
    constructor(){
        this.subs = new Map();
    }
    // 向 subs 中存放订阅者信息
    listen(column:string,sub:Subscriber){
        if(!this.subs.has(column)){
            this.subs.set(column,[]);
        }
        this.subs.get(column).push(sub);
    }
    // 推送消息
    trigger(column:string){
        if(!this.subs.has(column)) return;
        // 只对当前栏目下的订阅者进行推送
        const columnSubs = this.subs.get(column);
        // 推送时传递栏目参数（或者你想要的其他参数）
        columnSubs.forEach(sub => sub.update(column));
    }

    // 取消订阅
    unsubscribe(column:string,sub:Subscriber){
        let columnSubs = this.subs.get(column);
        const { name } = sub;
        // 对该订阅者取消订阅
        columnSubs = columnSubs.filter(sub => sub.name !== name);
        this.subs.set(column,columnSubs);
    }
}

class SomeSubscriber implements Subscriber{
    name:string;
    constructor(name){
        this.name = name;
    }
    // 对发布者的消息推送进行响应
    update(column:string){
        console.log(`${this.name}：我收到了 ${column} 的新消息~`)
    }
}

// 创建发布者实例
const pub1 = new SomePublisher();
// 创建订阅者实例
const sub1 = new SomeSubscriber("订阅者1")
const sub2 = new SomeSubscriber("订阅者2")
const sub3 = new SomeSubscriber("订阅者3")
// 保存订阅者信息
pub1.listen("科学",sub1);
pub1.listen("文学",sub2);
pub1.listen("财经",sub3);
// 推送消息
pub1.trigger("科学")
pub1.trigger("文学")
pub1.trigger("财经")
console.log("==================")
// 取消订阅
pub1.unsubscribe("科学",sub1);
// 推送消息
pub1.trigger("科学")
pub1.trigger("文学")
pub1.trigger("财经")