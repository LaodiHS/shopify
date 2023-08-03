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
    } else if(fucName, data, location) {
      console.error(`no Listener with  ${fucName} name in dictionary.`);

    }
  }
}

const appContext = new SetData();

export const Context = appContext;

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

export class SubscriptionChecker {
  constructor(subscriptions) {
    if(!subscriptions){
   
      throw new Error('no subscriptions', JSON.stringify(subscriptions))

  } 
  this.subscriptions = subscriptions;
  }

  checkFeatureAccess(requiredSubscriptions) {
  if(!requiredSubscriptions){
   
      throw Error('no subscriptions', JSON.stringify(requiredSubscriptions))
      
  } 
    const hasAccess = requiredSubscriptions.some(subscription =>

      this.subscriptions.includes(subscription)
    ) ;

    if (hasAccess) {
      return {
        hasAccess: true,
        message:(label)=> label
        

      };
    } else {
  
      const required = requiredSubscriptions.slice();  
      
      if(required.length > 1){
          required[required.length-1] = 'or '+ required[required.length-1] ;
                }
        const requiredLabel =  required.join(", ");

         return {
        hasAccess: false,
        message:(label) => `${label}: ( with ${requiredLabel } subscription. )`,
        some:()=>  `Some Features Require A ${requiredLabel} Subscription.`
      };

    }
  }
}

// Example usage
// const userSubscriptions = ['basic', 'crafted', 'premium'];




// const result = checker.checkFeatureAccess(['basic', 'crafted', 'advanced'], 'Feature A');
// console.log(result);

// const result2 = checker.checkFeatureAccess(['premium'], 'Feature B');
// console.log(result2);



