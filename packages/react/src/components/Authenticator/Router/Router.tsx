import * as React from 'react';

import { useAuthenticator } from '../hooks/useAuthenticator';
import { ConfirmSignUp } from '../ConfirmSignUp';
import { ForceNewPassword } from '../ForceNewPassword';
import { SetupTOTP } from '../SetupTOTP';
import { SignInSignUpTabs } from '../shared';
import { ConfirmVerifyUser, VerifyUser } from '../VerifyUser';
import { ConfirmSignIn } from '../ConfirmSignIn/ConfirmSignIn';
import { ConfirmResetPassword, ResetPassword } from '../ResetPassword';
import { isSignInOrSignUpRoute } from '../utils';
import { RouterProps } from './types';

type RouteComponent = (props: Omit<RouterProps, 'children'>) => JSX.Element;

function RenderNothing(): JSX.Element {
  return null;
}

const getRouteComponent = (route: string): RouteComponent => {
  switch (route) {
    case 'authenticated':
    case 'idle':
    case 'setup':
    case 'autoSignIn':
      return RenderNothing;
    case 'confirmSignUp':
      return ConfirmSignUp;
    case 'confirmSignIn':
      return ConfirmSignIn;
    case 'setupTOTP':
      return SetupTOTP;
    case 'signIn':
    case 'signUp':
      return SignInSignUpTabs;
    case 'forceNewPassword':
      return ForceNewPassword;
    case 'resetPassword':
      return ResetPassword;
    case 'confirmResetPassword':
      return ConfirmResetPassword;
    case 'verifyUser':
      return VerifyUser;
    case 'confirmVerifyUser':
      return ConfirmVerifyUser;
    default:
      // eslint-disable-next-line no-console
      console.warn(
        `Unhandled Authenticator route - please open an issue: ${route}`
      );
      return RenderNothing;
  }
};

export function useRouterChildren(
  children: RouterProps['children']
): RouteComponent {
  const { route, signOut, user } = useAuthenticator(
    ({ route, signOut, user }) => [route, signOut, user]
  );

  return React.useMemo(() => {
    const isUnauthenticatedRoute = !(
      route === 'authenticated' || route === 'signOut'
    );

    if (isUnauthenticatedRoute) {
      return getRouteComponent(route);
    }

    // `Authenticator` might not have user defined `children` for non SPA use cases.
    if (!children) {
      return RenderNothing;
    }

    return () =>
      (typeof children === 'function'
        ? children({ signOut, user }) // children is a render prop
        : children) as JSX.Element;
  }, [children, route, signOut, user]);
}

export function Router({
  children,
  className,
  hideSignUp,
  variation,
}: RouterProps): JSX.Element {
  const { route } = useAuthenticator(({ route }) => [route]);
  const RouterChildren = useRouterChildren(children);

  return (
    <RouterChildren
      className={className}
      hideSignUp={isSignInOrSignUpRoute(route) ? hideSignUp : undefined}
      variation={variation}
    />
  );
}
