export class Car {
  private _name: string;
  constructor(name: string) {
    this._name = name;
  }

  get name() {
    return this._name;
  }

  set name(name: string) {
    if (name.length <= 4) {
      throw new Error("name length should be more than 4");
    }
    this._name = name;
  }
}
