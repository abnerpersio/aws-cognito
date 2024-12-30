import { env } from '@/config/constants';
import { cognitoClient } from '@/libs/cognito';
import { bodyParser } from '@/utils/body-parser';
import { response } from '@/utils/response';
import { InitiateAuthCommand } from '@aws-sdk/client-cognito-identity-provider';
import type { APIGatewayProxyEventV2 } from 'aws-lambda';

type Data = {
  refreshToken: string;
};

export async function handler(event: APIGatewayProxyEventV2) {
  const { refreshToken } = bodyParser<Data>(event.body);

  try {
    const command = new InitiateAuthCommand({
      ClientId: env.cognitoClientId,
      AuthFlow: 'REFRESH_TOKEN_AUTH',
      AuthParameters: {
        REFRESH_TOKEN: refreshToken,
      },
    });

    const { AuthenticationResult } = await cognitoClient.send(command);

    if (!AuthenticationResult) {
      return response(401, { message: 'Invalid credentials' });
    }

    return response(200, {
      accessToken: AuthenticationResult.AccessToken,
    });
  } catch (error) {
    return response(500);
  }
}
