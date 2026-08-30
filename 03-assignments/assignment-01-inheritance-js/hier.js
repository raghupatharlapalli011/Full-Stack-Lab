class Animal {
    eat() {
        console.log("Animal can eat");
    }
}

class Dog extends Animal {
    bark() {
        console.log("Dog can bark");
    }
}

class Cat extends Animal {
    meow() {
        console.log("Cat can meow");
    }
}

let dog = new Dog();
let cat = new Cat();

dog.eat();
dog.bark();

cat.eat();
cat.meow();