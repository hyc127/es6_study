let target = {}

//陷阱只在访问原型时才会触发
let newTarget = Object.create(new Proxy(target, {
    //trapTarget behalf of the target, receiver behalf of the newTarget
    get(trapTarget, key, receiver) {
        throw new ReferenceError(`${ key } does not exist`)
    },
    //只在创建新属性的时候会触发
    set(trapTarget, key, value, receiver) {
        return Reflect.set(trapTarget, key, value, receiver)
    },

    //只在用in检查实例不存在的属性的时候才会触发
    has(trapTarget, key) {
        return Reflect.has(trapTarget, key)
    }
}))

newTarget.name = 'newTarget'

// console.log(newTarget.name)
// console.log(newTarget.age)



// --------------------------模拟Vue------------------------------>

class Vue {
    constructor(argObj) {
        let _data = argObj.data()
        for (let key in _data) {
            Object.defineProperty(this, key, {
                get() {
                    return _data[key]
                },
                set(value) {
                    _data[key] = value
                }
            })
        }
        for (let m of Object.getOwnPropertyNames(argObj.methods)) {
            this[m] = argObj.methods[m]
        }
    }
}

let app = new Vue({
    data() {
        return { name: 'hyc', age: 18 }
    },
    methods: {
        say() {
            console.log(this.age)
        }
    }
})

app.say()
console.log(app.age)



