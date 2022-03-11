const STATUS = {
  // 연산 이행하거나 거부되지 않은 초기 상태.
  PENDING: 'pending',
  // 연산 완료 상태.
  FULFILLED: 'fulfilled',
  // 연산 실패 상태.
  REJECTED: 'rejected',
};

/**
 * Promise
 * @author yoonjaepark
 * @param {Function} fn
 */
function Promise(fn) {
  /** @type {STATUS} */
  this.status = STATUS.PENDING;
  /** @type {null|Function} */
  this.onFulfilledCallback = null;
  /** @type {null|Function} */
  this.onRejectedCallback = null;
  /** @type {null|Function} */
  this.onFinallyCallback = null;
  /** @type {Promise} */
  this.promiseInstance = null;
  fn(this.constructor.resolve.bind(this), this.constructor.reject.bind(this));
}

Promise.resolve = function (value) {
  this.status = STATUS.FULFILLED;
  this.value = value;
  if (this.onFulfilledCallback !== null) {
    this.onFulfilledCallback(value);
    if (this.promiseInstance.onFinallyCallback !== null) {
      this.promiseInstance.onFinallyCallback(value);
    }
  }
};

Promise.reject = function (value) {
  this.status = STATUS.REJECTED;
  this.value = value;
  if (this.onRejectedCallback !== null) {
    this.onRejectedCallback(value);
  } else {
    this.promiseInstance.reject(value);
  }
};

Promise.prototype.then = function (cb) {
  this.promiseInstance = new Promise(function (resolve, reject) {
    if (this.status === STATUS.PENDING) {
      this.onFulfilledCallback = function () {
        const result = cb(this.value);
        if (result instanceof Promise) {
          result.then(resolve, reject);
        } else {
          resolve(result);
        }
      }
    }
    if (this.status === STATUS.FULFILLED) {
      cb(this.value);
    }
  }.bind(this))

  return this.promiseInstance;
};

Promise.prototype.catch = function (cb) {
  if (this.status === STATUS.PENDING) {
    this.onRejectedCallback = cb;
  }
  if (this.status === STATUS.REJECTED) {
    cb(this.value);
  }
  return this;
};

Promise.prototype.finally = function (cb) {
  if (this.status === STATUS.PENDING) {
    this.onFinallyCallback = cb;
    return;
  }
  cb(this.value);
};

Promise.all = function () {};

export {
  Promise
};