export const promisify = (inner) => {
    return new Promise((resolve, reject) => {
        inner((error, result) => {
            if (error) {
                reject(error)
            }
            resolve(result);
        });
    })
};

export const promiseWithTimeout = (millis, promise) => {
    const timeout = new Promise((resolve, reject) =>
        setTimeout(
            () => reject(`promise.timeout`),
            millis));
    return Promise.race([
        promise,
        timeout
    ]);
};
