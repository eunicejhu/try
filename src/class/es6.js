export class Car {
    constructor(name) {
        this._name = name;
    }
    get name() {
        return this._name;
    }
    set name(name) {
        if (name.length <= 4) {
            throw "name length should be more than 4";
        }
        this._name = name;
    }
}
const car = new Car("1");
