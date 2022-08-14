import { watchEffect, nextTick } from "vue-demi";

class TestReactivity<T> {
  constructor(private target: () => T) {}

  public trigger(fn: () => void): Promise<T> {
    return new Promise((resolve) => {
      let valueToBeResolved: T;

      watchEffect(() => {
        valueToBeResolved = this.target();
      });

      fn();

      nextTick(() => {
        resolve(valueToBeResolved);
      });
    });
  }
}

export const testReactivity = <T>(target: () => T) =>
  new TestReactivity(target);
