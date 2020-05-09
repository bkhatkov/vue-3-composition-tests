// let product = {
//     price: 5,
//     quantity: 2,
// };
//
// let total = 0;
// // let dep = new Set();
// // let depsMap = new Map();
const targetMap = new WeakMap();


function track(target, key) {
    let depsMap = targetMap.get(target);

    if (!depsMap) {
        targetMap.set(target, (depsMap = new Map()));
    }

    let dep = depsMap.get(key);

    if (!dep) {
        depsMap.set(key, (dep = new Set()));
    }

    dep.add(effect);
}

function trigger(target, key) {
    const depsMap = targetMap.get(target);

    if (!depsMap) {
        return;
    }

    let dep = depsMap.get(key);
    if (dep) {
        dep.forEach(effect => {
            effect();
        });
    }
}
//
// let effect = () => {
//     total = product.price * product.quantity;
// }
//
// track(product,'quantity')
// effect()
// console.log(total);
//
// product.quantity = 3;
// trigger(product,'quantity');
// console.log(total);

// STEP 1

// let proxiedProduct = new Proxy(product, {
//     get(target, key, receiver) {
//         console.log(`Get was called for key: ${key}`);
//         return Reflect.get(target, key, receiver);
//     },
//     set(target, key, value, receiver) {
//         console.log(`Set was called for key: ${key} and value: ${value}`);
//         return Reflect.set(target, key, value, receiver);
//     }
// });
// proxiedProduct.quantity = 4;
// console.log(proxiedProduct.quantity);

// STEP 2

// function reactive(target) {
//     const handler = {
//         get(target, key, receiver) {
//             console.log(`Get was called for key: ${key}`);
//             return Reflect.get(target, key, receiver);
//         },
//         set(target, key, value, receiver) {
//             console.log(`Set was called for key: ${key} and value: ${value}`);
//             return Reflect.set(target, key, value, receiver);
//         }
//     }
//     return new Proxy(target, handler);
// }
//
// let product = reactive({price: 5, quantity: 2});
// product.quantity = 100;
// console.log(product.quantity);

// STEP 3 - combine with track and trigger

function reactive(target) {
    const handler = {
        get(target, key, receiver) {
            console.log(`Get was called for key: ${key}`);
            let result = Reflect.get(target, key, receiver);
            track(target, key);
            return result;
        },
        set(target, key, value, receiver) {
            let oldValue = target[key];
            console.log(`Receiver is:`);
            console.log(receiver);
            let result = Reflect.set(target, key, value, receiver);
            console.log(`Set was called for key: ${key} and value: ${value}`);
            if (oldValue != result) {
                trigger(target, key);
            }
            return result;
        }
    }
    return new Proxy(target, handler);
}

let product = reactive({price: 5, quantity: 2});
let total = 0;

let effect = () => {
    total = product.price * product.quantity;
    console.log(`total is: ${total}`);
}

effect();

console.log(`before updated quantity total was: ${total}`);
product.quantity = 3;
console.log(`after updated quantity total is: ${total}`);



