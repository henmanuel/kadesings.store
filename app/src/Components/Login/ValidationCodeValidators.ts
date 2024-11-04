import {LoginInterface} from './LoginInterface';
import {RegisterValidators} from './RegisterValidators';
export function ValidationCodeValidators(values:LoginInterface):LoginInterface {
  let errors:LoginInterface = RegisterValidators(values);

  if (!values.confirmationCode) {
    errors.confirmationCode = 'AUTH__ERROR_CODE_REQUIRED';
  }

  return errors;
}
