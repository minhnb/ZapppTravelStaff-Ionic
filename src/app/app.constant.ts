export const AppConstant = {
    ACCESS_TOKEN: 'access_token',
    REFRESH_TOKEN: 'refresh_token',
    EXPIRED_AT: 'expired_at',
    ROLE: 'role',
    USER_ROLE: {
        DRIVER: 'DRIVER',
        ATTENDANT: 'ATTENDANT',
        ZAPPPER: 'ZAPPPER'
    },
    PATTERN: {
        ONLY_DIGIT: '^[0-9]*$',
        VALID_USERNAME: '^[a-zA-Z][0-9a-zA-Z_.]+$',
        VALID_SWIFTCODE: '^[a-zA-Z]{6}[a-zA-Z0-9]{2}([a-zA-Z0-9]{3})?$'
    },
    KEYCODE: {
        UP: 38,
        DOWN: 40,
        ENTER: 13
    },
    FORMAT_DATETIME: 'MM/DD/YYYY HH:mm',
    FORMAT_DATETIME_WITH_SECOND: 'MM/DD/YYYY HH:mm:ss',
    FORMAT_DATE: 'MM/DD/YYYY',
    FORMAT_TIME: 'HH:mm',
    FORMAT_TIME_FULL: 'HH:mm:ss',
    SERVER_FORMAT_DATE: 'YYYY-MM-DD',
    SERVER_FORMAT_DATE_WITH_SPLASH: 'YYYY/MM/DD',
    PICTURE_MAX_SIZE_MB: 5
};
