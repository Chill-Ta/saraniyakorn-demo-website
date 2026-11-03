export function getAuthErrorMessage(error: unknown): string {
  const code =
    typeof error === 'object' && error !== null && 'code' in error
      ? String(error.code)
      : '';

  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/user-not-found':
    case 'auth/wrong-password':
      return 'The email or password is incorrect.';
    case 'auth/email-already-in-use':
      return 'This email is already registered. Please sign in.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/weak-password':
    case 'auth/password-does-not-meet-requirements':
      return 'Choose a stronger password that meets your account requirements.';
    case 'auth/popup-closed-by-user':
    case 'auth/cancelled-popup-request':
      return 'Google sign-in was cancelled. Please try again.';
    case 'auth/popup-blocked':
      return 'Allow popups for this site, then try Google sign-in again.';
    case 'auth/account-exists-with-different-credential':
      return 'This email uses another sign-in method. Sign in with that method first.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please wait a little before trying again.';
    case 'auth/network-request-failed':
      return 'Check your internet connection and try again.';
    case 'auth/unauthorized-domain':
      return 'This domain is not enabled for sign-in. Contact the site administrator.';
    case 'auth/operation-not-allowed':
      return 'This sign-in method is not enabled. Contact the site administrator.';
    default:
      return 'Something went wrong. Please try again.';
  }
}
