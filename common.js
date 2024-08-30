import moment from 'moment';
import exportFromJSON from 'export-from-json';

export const APP_NAME = '[-[app-name]-]';

// export function setItemOnLocalStorage(key, value) {
//     this.$$window.localStorage.setItem(`${APP_NAME}::${key}`, value);
// }

// export function getItemFromLocalStorage(key) {
//     return this.$$window.localStorage.getItem(`${APP_NAME}::${key}`);
// }

// export function removeItemOnLocalStorage(key) {
//     return this.$$window.localStorage.removeItem(`${APP_NAME}::${key}`);
// }

export function formatDate(date, dateOnly = false, format='llll') {
    return moment(date)
        .add(dateOnly ? 1 : 0, 'days')
        .utcOffset(0)
        .format(dateOnly ? 'dddd ll' : format);
}

// export function clearDataFromLocalStorage() {
//     const local = this.$$window.localStorage;
//     const object = {};
//     for (const key in local) {
//         if (key.includes('Headers-For')) {
//             object[key] = local[key];
//         }
//     }
//     local.clear();
//     Object.entries(object).forEach((entry) => {
//         this.$$window.localStorage.setItem(entry[0], entry[1]);
//     });
// }

export const excelParser = () => {
    function exportDataFromJSON(data, newFileName, fileExportType) {
        if (!data) return;
        try {
            const fileName = newFileName || 'exported-data';
            const exportType = exportFromJSON.types[fileExportType || 'csv'];
            exportFromJSON({ data, fileName, exportType });
        } catch (e) {
            throw new Error('Parsing failed!');
        }
    }

    return {
        exportDataFromJSON,
    };
};
