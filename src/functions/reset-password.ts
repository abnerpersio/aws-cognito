import { env } from '@/config/constants';
import { cognitoClient } from '@/libs/cognito';
import { bodyParser } from '@/utils/body-parser';
import { response } from '@/utils/response';
import {
  ConfirmForgotPasswordCommand,
  InitiateAuthCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import type { APIGatewayProxyEventV2 } from 'aws-lambda';

type Data = {
  email: string;
  code: string;
  password: string;
};

export async function handler(event: APIGatewayProxyEventV2) {
  const { email, code, password } = bodyParser<Data>(event.body);

  try {
    const command = new ConfirmForgotPasswordCommand({
      ClientId: env.cognitoClientId,
      Username: email,
      ConfirmationCode: code,
      Password: password,
    });

    await cognitoClient.send(command);

    const authCommand = new InitiateAuthCommand({
      ClientId: env.cognitoClientId,
      AuthFlow: 'USER_PASSWORD_AUTH',
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password,
      },
    });

    const { AuthenticationResult } = await cognitoClient.send(authCommand);

    if (!AuthenticationResult) {
      return response(401, { message: 'Invalid credentials' });
    }

    return response(200, {
      accessToken: AuthenticationResult.AccessToken,
      refreshToken: AuthenticationResult.RefreshToken,
    });
  } catch (error) {
    return response(500);
  }
}
