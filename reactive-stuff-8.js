// let product = {
//     price: 5,
//     quantity: 2,
// };
//
// let total = 0;
// // let dep = new Set();
// // let depsMap = new Map();
const targetMap = new WeakMap();
let activeEffect = null;




function track(target, key) {
    if (activeEffect) { // important to track active effect
        console.log(`track key ${key} with target:`);
        console.log(target);
        let depsMap = targetMap.get(target);

        if (!depsMap) {
            targetMap.set(target, (depsMap = new Map()));
        }

        let dep = depsMap.get(key);

        if (!dep) {
            depsMap.set(key, (dep = new Set()));
        }

        dep.add(activeEffect); // important to track active effect
    }
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
            // console.log(`Receiver is:`);
            // console.log(receiver);
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

function ref(raw) {
    const r = {
        get value() {
            track(r, 'value');
            return raw;
        },
        set value(newVal) {
            raw = newVal;
            trigger(r, 'value');
        },
    }
    return r;
}


function computed(getter) {
    let result = ref();

    effect(() => (result.value = getter()));

    return result;
}

function effect(eff) {
    activeEffect = eff;
    activeEffect();
    activeEffect = null;
}

let product = reactive({price: 5, quantity: 2});

console.log('make salePrice computed');
let salePrice = computed(() => {
    return product.price * 0.9
});

console.log('make total computed');
let total = computed(() => {
    return salePrice.value * product.quantity;
});



// effect(() => {
//     salePrice.value = product.price * 0.9;
// })
//
// effect(() => {
//     total = salePrice.value * product.quantity;
// })

console.log(targetMap)
// effect();

console.log(`---before updated total = ${total.value} salePrice = ${salePrice.value}`);
product.quantity = 3;
console.log(`---after updated total = ${total.value} salePrice = ${salePrice.value}`);
product.price = 10;
console.log(`---after updated total = ${total.value} salePrice = ${salePrice.value}`);

product.name = 'Shoes';

effect(() => {
    console.log(`Product name is now ${product.name}`);
});

product.name = 'Socks';

console.log(targetMap);



