export const APIResponseCodeEnum = {
    user_error: 400,
    expired_token: 401,
    invalid_token: 402,
    not_found: 404,
    server_error: 500,
    invalid_oauth_token: 403,
} as const;
export type APIResponseCodeEnum = typeof APIResponseCodeEnum[keyof typeof APIResponseCodeEnum];
