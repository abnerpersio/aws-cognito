import { env } from '@/config/constants';
import { cognitoClient } from '@/libs/cognito';
import { bodyParser } from '@/utils/body-parser';
import { response } from '@/utils/response';
import { ForgotPasswordCommand } from '@aws-sdk/client-cognito-identity-provider';
import type { APIGatewayProxyEventV2 } from 'aws-lambda';

type Data = {
  email: string;
};

export async function handler(event: APIGatewayProxyEventV2) {
  const { email } = bodyParser<Data>(event.body);

  try {
    const command = new ForgotPasswordCommand({
      ClientId: env.cognitoClientId,
      Username: email,
    });

    await cognitoClient.send(command);

    return response(204);
  } catch (error) {
    return response(500);
  }
}
