import { env } from '@/config/constants';
import { cognitoClient } from '@/libs/cognito';
import { response } from '@/utils/response';
import { AdminGetUserCommand } from '@aws-sdk/client-cognito-identity-provider';
import { APIGatewayProxyEventV2WithJWTAuthorizer } from 'aws-lambda';

type UserProfile = {
  email: string;
  email_verified: string;
  family_name: string;
  given_name: string;
  sub: string;
};

export async function handler(event: APIGatewayProxyEventV2WithJWTAuthorizer) {
  const { authorizer } = event.requestContext;
  const userId = authorizer.jwt.claims.username as string;

  const command = new AdminGetUserCommand({
    UserPoolId: env.cognitoPoolId,
    Username: userId,
  });

  const { UserAttributes } = await cognitoClient.send(command);

  if (!UserAttributes) {
    return response(401, { message: 'Invalid user' });
  }

  const profile = Object.fromEntries(
    UserAttributes.map(({ Name, Value }) => [Name, Value])
  ) as UserProfile;

  return response(200, { profile });
}
