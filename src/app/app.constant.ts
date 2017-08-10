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
    STATUS: 'status',
    TRUCK: 'truck',
    LIST_BIN: 'list-bin',
    CURRENT_JOB: 'current_job',
    LAST_VIEW_ASSIGNMENT: 'last_view_assignment',
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
    FORMAT_DATETIME: 'YYYY/MM/DD hh:mm A',
    FORMAT_DATETIME_WITH_SECOND: 'YYYY/MM/DD hh:mm:ss A',
    FORMAT_DATE: 'YYYY/MM/DD',
    FORMAT_TIME: 'HH:mm',
    FORMAT_TIME_FULL: 'HH:mm:ss',
    SERVER_FORMAT_DATE: 'YYYY-MM-DD',
    SERVER_FORMAT_DATE_WITH_SPLASH: 'YYYY/MM/DD',
    PICTURE_MAX_SIZE_MB: 5,
    MARKER_IMAGE: {
        START: 'www/assets/images/marker-start.png',
        END: 'www/assets/images/marker-end.png',
        TRUCK: 'www/assets/images/marker-truck.png',
        CURRENT_LOCATION: 'www/assets/images/marker-current-location.png'
    },
    GET_LOCATION_TIMEOUT: 5000,
    WATCH_POSITION_INTERVAL: 30000,
    NOTIFICATION_TYPE: {
        PREFIX: 'notification:',
        REQUEST_ORDER: 'request_order',
        ASSIGN_TRUCK_DELIVERY: 'assign_truck_delivery',
        ASSIGN_TRUCK_COLLECTION: 'assign_truck_collection',
        ASSIGN_TRUCK_UNASSIGNED: 'assign_truck_unassigned',
        USER_COMPLETED_PICKUP_CHARGE: 'user_completed_pickup_charge'
    },
    EVENT_TOPIC: {
        USER_ACTIVE: 'user:active',
        DIRECTION_STATION: 'direction:station',
        DELIVERY_COMPLETED: 'delivery:completed',
        COLLECTION_NEXTSTATION: 'collection:nextStation'
    },
    CODE_PREFIX: {
        LUGGAGE: 'B-',
        BIN: 'L-',
        ORDER: 'O-'
    },
    ASSIGNMENT_MODE: {
        COLLECTION: 1,
        DELIVERY: 2,
        UNASSIGNED: 0
    }
};
