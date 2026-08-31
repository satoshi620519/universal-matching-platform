export interface PasswordPolicyViolation {
  readonly code: string;
}

export abstract class PasswordPolicy {
  abstract validate(password: string): PasswordPolicyViolation[];
}

export class MinimumPasswordPolicy extends PasswordPolicy {
  validate(password: string): PasswordPolicyViolation[] {
    const violations: PasswordPolicyViolation[] = [];

    if (password.length < 12) {
      violations.push({ code: 'minimum_length' });
    }

    if (password.length > 1024) {
      violations.push({ code: 'maximum_length' });
    }

    return violations;
  }
}
