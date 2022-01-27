export interface User {
  email: string;
  name: string;
  enterprise: string;
  postalCode: string;
  telephone: string;
  password: string;
  passwordConfirmation: string;
  termsConditions: boolean;
  id?: string;
}

export type UserDoc = firebase.default.firestore.DocumentSnapshot<User>;
