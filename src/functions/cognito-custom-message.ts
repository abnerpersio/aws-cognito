import { CustomMessageTriggerEvent } from 'aws-lambda';

export async function handler(event: CustomMessageTriggerEvent) {
  const { userAttributes } = event.request;

  const code = event.request.codeParameter;
  const name = userAttributes?.given_name ?? '';
  const email = userAttributes?.email ?? '';

  if (event.triggerSource === 'CustomMessage_SignUp') {
    event.response.emailSubject = `Confirme a sua conta ${name}`;
    event.response.emailMessage = `
      <h1>Seja muito bem-vindo(a) ${name}</h1>
      <br/ > <br />
      <p>Use este código para confirmar a sua conta:</p>

      <strong>${code}</strong>
    `;
  }

  if (event.triggerSource === 'CustomMessage_ForgotPassword') {
    event.response.emailSubject = 'Recuperação de conta';
    event.response.emailMessage = `
      <h1>Para recuperar a sua conta acesse:</h1>
      <br/ > <br />

      <strong>https://meuapp.com.br/reset?email=${encodeURIComponent(
        email
      )}&code=${code}</strong>
    `;
  }

  return event;
}
