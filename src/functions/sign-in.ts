import { env } from '@/config/constants';
import { cognitoClient } from '@/libs/cognito';
import { bodyParser } from '@/utils/body-parser';
import { response } from '@/utils/response';
import {
  InitiateAuthCommand,
  NotAuthorizedException,
  UserNotConfirmedException,
  UserNotFoundException,
} from '@aws-sdk/client-cognito-identity-provider';
import type { APIGatewayProxyEventV2 } from 'aws-lambda';

type Data = {
  email: string;
  password: string;
};

export async function handler(event: APIGatewayProxyEventV2) {
  const { email, password } = bodyParser<Data>(event.body);

  try {
    const command = new InitiateAuthCommand({
      ClientId: env.cognitoClientId,
      AuthFlow: 'USER_PASSWORD_AUTH',
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password,
      },
    });

    const { AuthenticationResult } = await cognitoClient.send(command);

    if (!AuthenticationResult) {
      return response(401, { message: 'Invalid credentials' });
    }

    return response(200, {
      accessToken: AuthenticationResult.AccessToken,
      refreshToken: AuthenticationResult.RefreshToken,
    });
  } catch (error) {
    if (error instanceof NotAuthorizedException) {
      return response(401, { message: 'Invalid credentials' });
    }

    if (error instanceof UserNotFoundException) {
      return response(401, { message: 'Invalid credentials' });
    }

    if (error instanceof UserNotConfirmedException) {
      return response(401, {
        message: 'You need to confirm your account before sign in',
      });
    }

    return response(500);
  }
}
