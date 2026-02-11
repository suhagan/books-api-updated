// const numbers = [1, 2, 3];

const person = {
  name: "Ahmad",
};

const isObject = (value: any): boolean =>
  typeof value === "object" && value !== null;

console.log(isObject(person));
