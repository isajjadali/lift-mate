import path from'path';

export default function (router) {
    router.get('/*', function (req, res) {
        res.sendFile(path.join(__dirname, '../../dist', 'index.html'));
    });
};
