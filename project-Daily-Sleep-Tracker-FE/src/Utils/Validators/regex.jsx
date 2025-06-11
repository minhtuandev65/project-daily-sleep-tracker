export const emailRegex =
  /^(?=.{5,70}$)(?!.*\.\.)(?!\.)(?!.*\.$)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+$/;

export const passwordRegex =
  /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
export const displayNameRegex = /^(?=(?:.*[A-Za-z]){2,})[A-Za-z]{4,50}$/;
// Check có nhập số hay không
export const containsNumberRegex = /\d/;
