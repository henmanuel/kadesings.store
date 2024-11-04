import {LoginInterface} from './LoginInterface';

export function LoginValidators(values: LoginInterface): LoginInterface {

    let errors: LoginInterface = {};

    if (!values.username) {
        errors.username = 'AUTH__ERROR_USER_MESSAGE';
    }

    if (!values.password) {
        errors.password = 'AUTH__ERROR_PASSWORD_MESSAGE';
    }

    return errors;
}
