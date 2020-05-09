let product = {
    price: 5,
    quantity: 2,
};
let total = 0;
// let dep = new Set();
let depsMap = new Map();

function track(key) {
    let dep = depsMap.get(key);

    if (!dep) {
        depsMap.set(key, (dep = new Set()));
    }

    dep.add(effect);
}

function trigger(key) {
    let dep = depsMap.get(key);
    dep.forEach(effect => {
        effect();
    });
}

let effect = () => {
    total = product.price * product.quantity;
}

track('quantity')
effect()
console.log(total);

product.quantity = 3;
trigger('quantity');
console.log(total);
