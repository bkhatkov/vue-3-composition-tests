let product = {
    price: 5,
    quantity: 2,
};
let total = 0;
let dep = new Set();

function track() {
    dep.add(effect);
}

function trigger() {
    dep.forEach(effect => effect());
}

let effect = () => {
    total = product.price * product.quantity;
}

track()
effect()

product.price = 20;
console.log(total);
trigger();
console.log(total)
