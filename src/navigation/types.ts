import type { NavigatorScreenParams } from '@react-navigation/native';

export type RatgeberStackParamList = {
  RatgeberList: undefined;
  ArticleDetail: { id: string };
};

export type LoginStackParamList = {
  LoginHome: undefined;
  Register: undefined;
  Account: undefined;
  Paywall: undefined;
  Privacy: undefined;
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
