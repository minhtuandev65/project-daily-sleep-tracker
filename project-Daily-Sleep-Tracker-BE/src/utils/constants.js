/**
 *
 *
 *
 * "Nơi lưu trữ các trạng thái, hằng số, biến toàn cục dùng chung trong ứng dụng"
 */

import { env } from '~/config/environment'

export const WEBSITE_DOMAIN =
    env.BUILD_MODE === 'production'
        ? env.WEBSITE_DOMAIN_PRODUCTION
        : env.WEBSITE_DOMAIN_DEVELOPMENT
export const APP_LOGO =
    'https://res.cloudinary.com/dyp1giiye/image/upload/v1748533208/main-logo_jjaqmh.jpg'
export const ROLE = {
    ADMIN: 'ADMIN',
    USER: 'USER'
}
