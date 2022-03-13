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
  /** @type {any} */
  this.value = null;
  
  fn(this.constructor.resolve.bind(this), this.constructor.reject.bind(this));
}

Promise.resolve = function (value) {
  handleCallback.call(this, STATUS.FULFILLED, value);
};

Promise.reject = function (value) {
  handleCallback.call(this, STATUS.REJECTED, value);
};

Promise.prototype.catch = function (cb) {
  return handleMethod.call(this, 'catch', cb);
};

Promise.prototype.finally = function (cb) {
  return handleMethod.call(this, 'finally', cb);
};

Promise.prototype.then = function (cb) {
  return handleMethod.call(this, 'then', cb);
};

Promise.all = function (arr) {
  return new Promise(function (resolve, reject) {
    const result = arr.map(() => ({
      state: STATUS.PENDING
    }));
    arr.forEach((iter, idx) => {
      if (iter instanceof Promise === false) {
        result[idx] = {
          state: STATUS.FULFILLED,
          value: iter
        };
        const isDone = !result.some(v => v.state === STATUS.FULFILLED);
        if (isDone) resolve(result.map(v => v.value));
        return;
      }
      iter.then(value => {
        result[idx] = {
          state: STATUS.FULFILLED,
          value
        };
        const isDone = !result.some(v => v.state === STATUS.PENDING);
        if (isDone) resolve(result.map(v => v.value));
      }).catch(err => {
        reject(err);
      });
    });
  });
};

function getLastInstance(instance, value) {
  if (instance.onRejectedCallback === null && instance.promiseInstance) {
    return getLastInstance(instance.promiseInstance, value);
  }
  return instance;
}

function handleCallback(status, value) {
  this.status = status;
  this.value = value;

  if (status === STATUS.FULFILLED) {
    if (this.onFulfilledCallback) {
      this.onFulfilledCallback(value);
      if (this.promiseInstance.onFinallyCallback !== null) {
        this.promiseInstance.onFinallyCallback(value);
      }
    }
  }

  if (status === STATUS.REJECTED) {
    if (this.onRejectedCallback !== null) {
      this.onRejectedCallback(value);
    } else {
      const instance = getLastInstance(this.promiseInstance, value);
      instance.onRejectedCallback(value)
      if (instance.onFinallyCallback !== null) {
        instance.onFinallyCallback(value);
      }
    }
  }
}

function handleMethod(method, cb) {
  if (method === 'catch') {
    if (this.status === STATUS.PENDING) {
      this.onRejectedCallback = cb;
    }
    if (this.status === STATUS.REJECTED) {
      cb(this.value);
    }
    return this;
  }

  if (method === 'finally') {
    if (this.status === STATUS.PENDING) {
      this.onFinallyCallback = cb;
      return;
    }
    cb(this.value);
  }

  if (method === 'then') {
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
    }.bind(this));

    return this.promiseInstance;
  }
}

export {
  Promise
};