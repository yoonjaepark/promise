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
  fn(this.constructor.resolve.bind(this), this.constructor.reject.bind(this));
}

Promise.resolve = function (value) {
  this.value = value;
};

Promise.reject = function (value) {
  this.value = value;
};

Promise.prototype.then = function (callback) {
  callback(this.value)
};

Promise.prototype.catch = function () {};

Promise.prototype.finally = function () {};

Promise.all = function () {};

export {
  Promise
}