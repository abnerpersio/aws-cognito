import { env } from '@/config/constants';
import { cognitoClient } from '@/libs/cognito';
import { bodyParser } from '@/utils/body-parser';
import { response } from '@/utils/response';
import { SignUpCommand } from '@aws-sdk/client-cognito-identity-provider';
import type { APIGatewayProxyEventV2 } from 'aws-lambda';

type Data = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};

export async function handler(event: APIGatewayProxyEventV2) {
  const body = bodyParser<Data>(event.body);

  const command = new SignUpCommand({
    ClientId: env.cognitoClientId,
    Username: body.email,
    Password: body.password,
    UserAttributes: [
      { Name: 'given_name', Value: body.firstName },
      { Name: 'family_name', Value: body.lastName },
    ],
  });

  const { UserSub } = await cognitoClient.send(command);

  return response(201, {
    userId: UserSub,
  });
}
