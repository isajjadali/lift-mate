import ejs from 'ejs'

export default function renderEjs(fileName = '', variables = {}) {
    return new Promise((resolve, reject) => {
        ejs.renderFile(fileName, variables, function (err, data) {
            if (err) {
                return reject(err);
            }
            resolve(data);
        });
    });
};
