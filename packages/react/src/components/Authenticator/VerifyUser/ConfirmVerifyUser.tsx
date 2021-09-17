import { getActorState, SignInState } from '@aws-amplify/ui';
import { I18n } from 'aws-amplify';

import { useAmplify, useAuth } from '../../../hooks';
import {
  ConfirmationCodeInput,
  RemoteErrorMessage,
  TwoButtonSubmitFooter,
} from '../shared';

export const ConfirmVerifyUser = (): JSX.Element => {
  const amplifyNamespace = 'Authenticator.ConfirmVerifyUser';
  const {
    components: { Flex, FieldGroup, Form, Heading },
  } = useAmplify(amplifyNamespace);

  const [_state, send] = useAuth();
  const actorState: SignInState = getActorState(_state);
  const isPending = actorState.matches('confirmVerifyUser.pending');

  const headerText = I18n.get(
    'Account recovery requires verified contact information'
  );

  return (
    <Form
      data-amplify-authenticator-confirmverifyuser=""
      method="post"
      onSubmit={(event) => {
        event.preventDefault();

        const formData = new FormData(event.target);

        send({
          type: 'SUBMIT',
          // @ts-ignore Property 'fromEntries' does not exist on type 'ObjectConstructor'. Do you need to change your target library? Try changing the `lib` compiler option to 'es2019' or later.ts(2550)
          data: Object.fromEntries(formData),
        });
      }}
    >
      <Flex direction="column">
        <Heading level={3}>{headerText}</Heading>

        <FieldGroup direction="column" disabled={isPending}>
          <ConfirmationCodeInput amplifyNamespace={amplifyNamespace} />
        </FieldGroup>

        <RemoteErrorMessage amplifyNamespace={amplifyNamespace} />

        <TwoButtonSubmitFooter
          amplifyNamespace={amplifyNamespace}
          isPending={isPending}
          cancelButtonText={I18n.get('Skip')}
          cancelButtonSendType="SKIP"
        />
      </Flex>
    </Form>
  );
};
