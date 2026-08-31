export class DuplicateAuthenticationIdentityError extends Error {
  constructor() {
    super('Authentication identity already exists');
    this.name = 'DuplicateAuthenticationIdentityError';
  }
}
