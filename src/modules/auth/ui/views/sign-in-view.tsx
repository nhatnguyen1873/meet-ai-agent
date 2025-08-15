'use client';

import { useForm } from 'react-hook-form';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle } from '@/components/ui/alert';
import { OctagonAlert } from 'lucide-react';
import { useState } from 'react';
import { authClient } from '@/lib/auth-client';
import { Container } from '@/modules/auth/ui/components/container';
import { ContainerWrap } from '@/modules/auth/ui/components/container-wrap';
import { ContainerHeader } from '@/modules/auth/ui/components/container-header';
import { ContainerHeaderTitle } from '@/modules/auth/ui/components/container-header-title';
import { ContainerHeaderDescription } from '@/modules/auth/ui/components/container-header-description';
import {
  DividerWithText,
  DividerWithTextContent,
} from '@/components/divider-with-text';
import { ContainerProviders } from '@/modules/auth/ui/components/container-providers';
import { ContainerFooter } from '@/modules/auth/ui/components/container-footer';
import { ContainerFooterLink } from '@/modules/auth/ui/components/container-footer-link';
import type { SocialProvider } from 'better-auth/social-providers';
import { socialProviders } from '@/lib/social-proivders';
import { useRouter } from 'next/navigation';

const formSchema = z.object({
  email: z.email(),
  password: z.string().min(1, { error: 'Password is required' }),
});

type FormValues = z.infer<typeof formSchema>;

export const SignInView = () => {
  const router = useRouter();
  const [error, setError] = useState<string | undefined>(undefined);
  const [isPending, setIsPending] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (data: FormValues) => {
    setError(undefined);
    setIsPending(true);

    authClient.signIn.email(
      {
        email: data.email,
        password: data.password,
      },
      {
        onSuccess: () => {
          router.push('/');
        },
        onError: (ctx) => {
          setError(ctx.error.message);
        },
        onResponse: () => {
          setIsPending(false);
        },
      },
    );
  };

  const onSocial = (provider: SocialProvider) => {
    setError(undefined);
    setIsPending(true);

    authClient.signIn.social(
      {
        provider,
        callbackURL: '/',
      },
      {
        onError: (ctx) => {
          setError(ctx.error.message);
        },
        onResponse: () => {
          setIsPending(false);
        },
      },
    );
  };

  return (
    <Container>
      <ContainerWrap>
        <ContainerHeader>
          <ContainerHeaderTitle>Welcome back</ContainerHeaderTitle>
          <ContainerHeaderDescription>
            Log into your account
          </ContainerHeaderDescription>
        </ContainerHeader>

        <Form {...form}>
          <form
            noValidate
            onSubmit={form.handleSubmit(onSubmit)}
            className='flex flex-col gap-3'
          >
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type={'email'}
                      placeholder='n@example.com'
                      autoComplete={'email'}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type={'password'}
                      placeholder='********'
                      autoComplete={'current-password'}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {error != null && (
              <Alert variant='destructive'>
                <OctagonAlert className='size-4' />
                <AlertTitle>{error}</AlertTitle>
              </Alert>
            )}
            <Button type='submit' disabled={isPending}>
              Sign in
            </Button>
          </form>
        </Form>

        <DividerWithText>
          <DividerWithTextContent>Or continue with</DividerWithTextContent>
        </DividerWithText>

        <ContainerProviders>
          {socialProviders.map((item) => (
            <Button
              key={item.id}
              variant={'outline'}
              disabled={isPending}
              onClick={() => {
                onSocial(item.provider);
              }}
            >
              {<item.icon />}
              {item.label}
            </Button>
          ))}
        </ContainerProviders>

        <ContainerFooter>
          Don&apos;t have an account?{' '}
          <ContainerFooterLink href='/sign-up'>Sign up</ContainerFooterLink>
        </ContainerFooter>
      </ContainerWrap>
    </Container>
  );
};
