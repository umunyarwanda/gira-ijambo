const getHostUrl = () => {
    const browserWindow: any = typeof window !== 'undefined' ? window : null;
    let host = browserWindow ? window.location.host : '';
    return host;
}
const isLocalHost = getHostUrl().startsWith("localhost");
export const BASE_API_URL: string = isLocalHost ? 'http://localhost:3091/' : getHostUrl() == '' ? '' : '';
export const LOGO_URL='https://res.cloudinary.com/umunyarwanda/image/upload/v1730154822/logo_yievnj.png';
export const GIRA_IJAMBO_EMAIL = 'ourmail@mail.com'

export const getBaseUrl = (host?: string) => {
    const isLocalHost = host ? host?.startsWith("localhost") : getHostUrl().startsWith("localhost");
    if (isLocalHost) {
        return 'http://localhost:3091/'
    } else if (host) {
        return host == '' ? '' : '';
    } else {
        return getHostUrl() == '' ? '' : '';
    }
};


export const BaseUrl = {
    API: BASE_API_URL,
}

export enum UserApiUrl {
    CONTROLLER = 'users',
    CREATE_USER = '/create',
    CREATE_SYSTEM_USER = '/create/system',
    GET_USER = '/get',
    GET_USERS = '/get/all',
    UPDATE_USER = '/update',
    DELETE_USER = '/delete',
    SEND_MAIL = '/send-mail',
    GET_MY_ACCOUNT = '/get/my/account',
    UPDATE_MY_ACCOUNT = '/update/my/account',
    GET_ANALYTICS = '/get/analytics/all',
}

export enum AgencyApiUrl {
    CONTROLLER = 'agencies',
    CREATE_AGENCY = '/create',
    GET_AGENCIES = '/get/all',
    GET_AGENCY = '/get',
    UPDATE_AGENCY = '/update',
    DELETE_AGENCY = '/delete',
}

export enum CategoryApiUrl {
    CONTROLLER = 'categories',
    CREATE_CATEGORY = '/create',
    GET_CATEGORY = '/get',
    GET_CATEGORIES = '/get/all',
    GET_CATEGORIES_WITH_COMPLAIN_COUNT = '/get/all/with/complain/count',
    UPDATE_CATEGORY = '/update',
    DELETE_CATEGORY = '/delete',
}

export enum ComplaintApiUrl {
    CONTROLLER = 'complaints',
    CREATE_COMPLAINT = '/create',
    GET_COMPLAINTS = '/get/all',
    GET_COMPLAINT = '/get',
    GET_BULK_COMPLAINTS = '/get/in/bulk',
    UPDATE_COMPLAINT = '/update',
    DELETE_COMPLAINT = '/delete',
    RESPOND_COMPLAINT = '/respond',
}
export enum AuthApiUrl {
    CONTROLLER = 'auth',
    LOGIN = '/login',
    LOGOUT = '/logout',
    REFRESH_TOKEN = '/refresh-token',
    TEST_GUARD = '/test-guard',
    FORGOT_PASSWORD = '/forgot-password',
    RESET_PASSWORD = '/reset-password',
    VERIFY_FORGOT_PASSWORD = '/verify-forgot-password',
    SET_NEW_PASSWORD = '/set-new-password',
}

export enum UploadApiUrl {
    CONTROLLER = 'upload',
    UPLOAD_FILE = '/create',
    LIST_FILES = '/list',
    GET_FILE = '/get',
    DELETE_FILE = '/delete',
}

