import config from './config.js';

export default fn => (req, res, next, ...rest) => {
    Promise
        .resolve(fn(req, res, next, ...rest))
        .catch(error => {
            console.log('<<<<<--------------Start-------------------->>>>>');
            console.log(error, '<<<=====');
            console.log('<<<<<---------------End--------------------->>>>>');
            let statusCode = error.statusCode;
            delete error.statusCode;
            let err;

            for (let key of Object.keys(config)) {
                if (error[key]) {
                    err = config[key](error, key);
                    break;
                }

                let errorKeyFound = false;
                key.split(',')
                    .map(item => item.trim())
                    .some(subKey => {
                        if (error[subKey]) {
                            err = config[key](error, subKey);
                            errorKeyFound = true;
                            return true;
                        }
                    });

                if (errorKeyFound) {
                    break;
                }

                err = error;
            }
            res[`http${statusCode || 500}`](typeof err === 'number' ? `${err}` : err);
        });
};
