import {LoginInterface} from './LoginInterface';
import {LoginValidators} from './LoginValidators';
export function RegisterValidators(values:LoginInterface):LoginInterface {
  let errors:LoginInterface = LoginValidators(values);

  if (values.password) {
    if (values.password.length < 8) {
      errors.password = 'AUTH__ERROR_PASSWORD'
    }
  }

  let phone = values.phoneNumber || '';
  phone = phone.replace(/\s/g, '');
  phone = phone.replace(/-/g, '');

  if (!values.phoneNumber) {
    errors.phoneNumber = 'AUTH__ERROR_PHONE_REQUIRED';
  } else if (!/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/im.test(phone)){
    errors.phoneNumber = 'AUTH__ERROR_PHONE_INCORRECT';
  }

  if (!values.email) {
    errors.email = 'AUTH__ERROR_EMAIL_REQUIRED';
  } else if (!/\S+@\S+\.\S+/.test(values.email)) {
    errors.email = 'AUTH__ERROR_EMAIL_INCORRECT';
  }

  return errors;
}
