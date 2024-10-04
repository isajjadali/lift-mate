import bunyan from 'bunyan'

export default bunyan.createLogger({
    'name': process.env.APP_NAME_SPACED,
    'level': 10,
});
