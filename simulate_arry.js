//simulate the array object

//convert the key to Unit32
function toUnit32(key) {
    return Math.floor(Math.abs(Number(key)) % Math.pow(2, 32))
}

//check the key can be a array index
function isArrayIndex(key) {
    let numericKey = Number(key)
    return numericKey === toUnit32(key) && numericKey < Math.pow(2, 32) - 1
}

class MyArray {
    constructor(length) {
        this.length = length
        return new Proxy(this, {
            set(trapTarget, key, value) {
                //get the length of the native object
                let currentLength = Reflect.get(trapTarget, 'length')
                if (isArrayIndex(key)) {
                    let numericKey = Number(key)
                    if (numericKey >= currentLength) {
                        Reflect.set(trapTarget, 'length', numericKey + 1)
                    }
                } else if (key === 'length') {
                    if (value < currentLength) {
                        for (let index = currentLength - 1; index >= value; index--) {
                            Reflect.deleteProperty(trapTarget, index)
                        }
                    }
                }
                return Reflect.set(trapTarget, key, value)
            }
        })
    }
}

let arr = new MyArray(3)
console.log(arr)
arr[0] = 'black'
arr[1] = 'red'
arr[2] = 'blue'
arr[3] = 'purple'
console.log(arr)
arr.length = 1
console.log(arr)