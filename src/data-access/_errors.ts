export class PublicError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class AuthenticationError extends PublicError {
  constructor() {
    super("You must be logged in to view this content");
    this.name = "AuthenticationError";
  }
}

export class EmailInUseError extends PublicError {
  constructor() {
    super("Account already exists with email");
    this.name = "EmailInUseError";
  }
}

export class EmailNotFoundError extends PublicError {
  constructor() {
    super("No user has this email");
    this.name = "EmailNotFoundError";
  }
}

export class UserNotCreatedError extends PublicError {
  constructor() {
    super("Failed to create a new account");
    this.name = "UserCreationError";
  }
}

export class NotFoundError extends PublicError {
  constructor() {
    super("Resource not found");
    this.name = "NotFoundError";
  }
}

export class TokenExpiredError extends PublicError {
  constructor() {
    super("Token has expired");
    this.name = "TokenExpiredError";
  }
}

export class LoginError extends PublicError {
  constructor() {
    super("Invalid email or password");
    this.name = "LoginError";
  }
}
export class SomethingWentWrongError extends PublicError {
  constructor() {
    super("Something went wrong");
    this.name = "SomethingWentWrongError";
  }
}

export class EmailVerificationError extends PublicError {
  constructor() {
    super("Invalid or Expired verification code");
    this.name = "EmailVerificationError";
  }
}

export class CouldntCreateWorkspaceError extends PublicError {
  constructor() {
    super("Couldn't create workspace");
    this.name = "CouldntCreateWorkspaceError";
  }
}

export class CouldntCreateProfileError extends PublicError {
  constructor() {
    super("Couldn't create profile");
    this.name = "CouldntCreateProfileError";
  }
}

export class CouldntSetSelectedWorkspaceError extends PublicError {
  constructor() {
    super("Couldn't open selected workspace");
    this.name = "CouldntSetSelectedWorkspaceError";
  }
}

export class CouldntUpdateLeadError extends PublicError {
  constructor() {
    super("Couldn't update lead");
    this.name = "CouldntUpdateAccountError";
  }
}

export class CouldntDeleteLeadError extends PublicError {
  constructor() {
    super("Couldn't delete lead");
    this.name = "CouldntDeleteLeadError";
  }
}

export class WorkspaceNotFoundError extends PublicError {
  constructor() {
    super("Workspace not found");
    this.name = "WorkspaceNotFoundError";
  }
}

export class CouldntCreateAccountError extends PublicError {
  constructor() {
    super("Couldn't create account");
    this.name = "CouldntCreateAccountError";
  }
}