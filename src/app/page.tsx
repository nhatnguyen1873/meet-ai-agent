'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { authClient } from '@/lib/auth-client';
import { cn } from '@/lib/utils';
import { useState, type DetailedHTMLProps, type HTMLAttributes } from 'react';

export default function Home() {
  const authSession = authClient.useSession();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = () => {
    authClient.signUp.email(
      {
        email,
        password,
        name,
      },
      {
        onSuccess: () => {
          window.alert('Success');
        },
        onError: () => {
          window.alert('Error');
        },
      },
    );
  };

  if (authSession.isPending) {
    return <Container>Loading...</Container>;
  }

  if (authSession.data?.user) {
    return (
      <Container className='flex flex-col gap-4'>
        <p>Logged in as {authSession.data.user.email}</p>
        <Button
          onClick={() => {
            authClient.signOut();
          }}
        >
          Sign out
        </Button>
      </Container>
    );
  }

  return (
    <Container className='flex flex-col gap-4'>
      <Input
        name='name'
        placeholder='Name'
        value={name}
        onChange={(e) => {
          setName(e.target.value);
        }}
      />
      <Input
        name='email'
        placeholder='Email'
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
        }}
      />
      <Input
        name='password'
        placeholder='Password'
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
        }}
      />
      <Button onClick={onSubmit}>Sign up</Button>
    </Container>
  );
}

function Container(
  props: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
) {
  return <div {...props} className={cn('p-6', props.className)} />;
}
