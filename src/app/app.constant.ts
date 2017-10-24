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
    USER_ID: "user_id",
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
        CURRENT_LOCATION: 'www/assets/images/marker-current-location.png',
        DEFAULT_AVATAR: 'www/assets/images/no-photo.png',
    },
    DEFAULT_AVATAR: 'assets/images/no-photo.png',
    GET_LOCATION_TIMEOUT: 10000,
    WATCH_POSITION_INTERVAL: 30000,
    GOOGLE_TRAVEL_MODE: {
        DRIVING: "DRIVING",
        WALKING: "WALKING",
        BICYCLING: "BICYCLING",
        TRANSIT: "TRANSIT"
    },
    GOOGLE_DIRECTION_STATUS: {
        OK: 'OK',
        ZERO_RESULTS: 'ZERO_RESULTS'
    },
    NOTIFICATION_TYPE: {
        PREFIX: 'notification:',
        REQUEST_ORDER: 'request_order',
        REQUEST_CANCEL: 'request_cancel',
        REQUEST_CANCEL_BY_USER: 'request_cancel_by_user',
        ASSIGN_TRUCK_DELIVERY: 'assign_truck_delivery',
        ASSIGN_TRUCK_COLLECTION: 'assign_truck_collection',
        ASSIGN_TRUCK_UNASSIGNED: 'assign_truck_unassigned',
        ASSIGN_TRUCK_TRANSFER: 'assign_truck_transfer',
        USER_COMPLETED_PICKUP_CHARGE: 'user_completed_pickup_charge',
        USER_CHARGE_BY_WE_CHAT: 'user_will_charge_by_wechat',
        LOGGED_IN_FROM_ANOTHER_DEVICE: 'your_account_logged_in_from_another_device',
        SHOW_FREEZING_MESSAGE: 'send_broadcast',
        HIDE_FREEZING_MESSAGE: 'stop_broadcast'
    },
    BACKGROUND_NOTIFICATION_TYPE: {
        PREFIX: 'background-notification:',
        REQUEST_ORDER: 'request_order'
    },
    EVENT_TOPIC: {
        APP_RESUMING: 'app:resuming',
        APP_PAUSING: 'app:pausing',
        USER_ACTIVE: 'user:active',
        DIRECTION_STATION: 'direction:station',
        DELIVERY_COMPLETED: 'delivery:completed',
        COLLECTION_NEXTSTATION: 'collection:nextStation',
        INPUT_MANUAL: 'input:manual',
        REFRESH_TOKEN_INVALID: 'reftreshToken:invalid',
        USER_INVALID: 'user:invalid',
        CURRENT_LOCATION_FIRST_UPDATE: 'currentLocation:firstUpdate',
        CHAT_INCOMING_MESSAGE: 'chat:incomingMessage',
        CHAT_CONNECT: 'chat:connect',
        CHAT_DISCONNECT: 'chat:disconnect',
        CHAT_WARNING_MESSAGE: 'chat:warningMessage'
    },
    CODE_PREFIX: {
        LUGGAGE: 'B-',
        BIN: 'L-',
        ORDER: 'O-'
    },
    DISPLAY_LUGGAGE_CODE_LENGTH: 4,
    DISPLAY_ORDER_ID_LENGTH: 8,
    ASSIGNMENT_MODE: {
        COLLECTION: 1,
        DELIVERY: 2,
        UNASSIGNED: 0
    },
    ORDER_STATUS: {
        ACCEPTED: "accept",
		CANCELED: "cancel",
		DROPPED_OFF: "dropoff",
		EXPIRED: "expired",
		NEW: "new",
		PICKED_UP: "pickup"
    },
    PAYMENT_STATUS: {
        INIT: "payment_init",
		FAILED: "payment_failed",
        SUCCESS: "payment_success"
    },
    PRODUCTION_ENVIRONMENT: "production",
    SOCKET_EVENT: {
        SUBSCRIBE: 'subscribe',
        SEND_MESSAGE: 'send_message',
        SUBSCRIBE_CALLBACK: 'subscribe_callback',
        DISCONNECT: 'disconnect',
        CONNECT_TIMEOUT: 'connect_timeout',
        CONNECT: 'connect',
        RECONNECT: 'reconnect'
    }
};
