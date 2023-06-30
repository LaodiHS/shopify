import { createContext } from "react";

export const DataContext = createContext();

class SetData {
  constructor() {
    this.parent = {};
  }

  listen(name, func) {
    this.parent[name] = func;
  }

  setData(fucName, data) {
    this.getData(fucName, data);
  }

  getData(fucName, data) {
    this.parent[fucName](data, fucName);
  }
}

const appContext = new SetData();

export const Context = appContext;
