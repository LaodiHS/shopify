import { createContext } from "react";

export const DataContext = createContext();

class SetData {
  constructor() {
    this.parent = {};
  }

  listen(name, func) {
    this.parent[name] = func;
  }

  sendData(fucName, data, location) {
    this.setData(fucName, data, location);
  }

  setData(fucName, data, location) {
    this.parent[fucName](data, location);
  }
}

const appContext = new SetData();

export const Context = appContext;

export class Data {
  constructor(){
  this.serverOptions= {}
  this.includeProductDetails= {}
  this.optionRequirements= {}
  }

  clearSharedData() {
    this.serverOptions = {};
    this.includeProductDetails = {};
    this.optionRequirements = {};
  }
};

const TransmitData = new Data();

export const SharedData= TransmitData;