import type { NavigatorScreenParams } from '@react-navigation/native';

export type RatgeberStackParamList = {
  RatgeberList: undefined;
  ArticleDetail: { id: string };
};

/** Tab to go back to after signing in or registering (instead of the account view). */
export type LoginReturnTo = 'Tagebuch' | 'KHRechner' | 'Sport';

export type LoginStackParamList = {
  LoginHome: { returnTo?: LoginReturnTo } | undefined;
  Register: { returnTo?: LoginReturnTo } | undefined;
  Account: undefined;
  Paywall: undefined;
  Privacy: undefined;
  Terms: undefined;
  Contact: undefined;
  ForgotPassword: undefined;
};

export type RootTabParamList = {
  Ratgeber: NavigatorScreenParams<RatgeberStackParamList>;
  KHRechner: undefined;
  Tagebuch: undefined;
  Sport: undefined;
  Login: NavigatorScreenParams<LoginStackParamList>;
};
