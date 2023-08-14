import { createContext } from "react";

export const DataContext = createContext();

class SetData {
  constructor() {
    this.funcDictionary = {};
  }

  listen(name, callback) {
    if (callback) {
      this.funcDictionary[name] = callback;
    } else {
      console.error("no function name" + name);
    }
  }

  sendData(fucName, data, location) {
    if (fucName) {
      this.setData(fucName, data, location);
    } else {
      console.error("no function fucName" + fucName);
    }
  }

  setData(fucName, data, location) {
    if (this.funcDictionary[fucName]) {
      this.funcDictionary[fucName](data, location);
    } else if ((fucName, data, location)) {
      console.error(`no Listener with  ${fucName} name in dictionary.`);
    }
  }
}

const appContext = new SetData();

const Context = appContext;
export { Context };

export class Data {
  constructor() {
    this.serverOptions = {};
    this.includeProductDetails = {};
    this.optionRequirements = {};
  }

  clearSharedData() {
    this.serverOptions = {};
    this.includeProductDetails = {};
    this.optionRequirements = {};
  }
}

const TransmitData = new Data();

export const SharedData = TransmitData;

