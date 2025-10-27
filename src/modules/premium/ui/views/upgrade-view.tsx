'use client';

import { ErrorState } from '@/components/error-state';
import { LoadingState } from '@/components/loading-state';
import { authClient } from '@/lib/auth-client';
import { PricingCard } from '@/modules/premium/ui/components/pricing-card';
import { useTRPC } from '@/trpc/client';
import { useSuspenseQuery } from '@tanstack/react-query';
import type { ReactNode } from 'react';

export const UpgradeView = () => {
  const trpc = useTRPC();
  const getCurrentSubscription = useSuspenseQuery(
    trpc.premium.getCurrentSubscription.queryOptions(),
  );
  const getProducts = useSuspenseQuery(trpc.premium.getProducts.queryOptions());

  return (
    <div className='flex flex-col gap-6 p-4 md:px-8'>
      <h5 className='text-center text-2xl font-medium md:text-3xl'>
        You are on the{' '}
        <span className='font-semibold text-blue-700'>
          {getCurrentSubscription.data?.name ?? 'Free'}
        </span>{' '}
        plan
      </h5>
      <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
        {getProducts.data.map((product) => {
          const isCurrentProduct =
            getCurrentSubscription.data?.id === product.id;
          const isPremium = !!getCurrentSubscription.data;
          let buttonText = 'Upgrade';
          let onClick = () => authClient.checkout({ products: [product.id] });

          if (isCurrentProduct) {
            buttonText = 'Manage';
            onClick = () => authClient.customer.portal();
          } else if (isPremium) {
            buttonText = 'Change plan';
            onClick = () => authClient.customer.portal();
          }

          return (
            <PricingCard
              key={product.id}
              buttonText={buttonText}
              onClick={onClick}
              variant={
                product.metadata.variant === 'highlighted'
                  ? 'highlighted'
                  : 'default'
              }
              title={product.name}
              price={
                product.prices[0].amountType === 'fixed'
                  ? product.prices[0].priceAmount / 100
                  : 0
              }
              description={product.description ?? undefined}
              priceSuffix={`/${product.prices[0].recurringInterval}`}
              features={product.benefits.map((benefit) => benefit.description)}
              badge={product.metadata.badge as string}
            />
          );
        })}
      </div>
    </div>
  );
};

function StateContainer(props: { children: ReactNode }) {
  return (
    <div className='flex h-full items-center justify-center'>
      {props.children}
    </div>
  );
}

export function UpgradeViewLoading() {
  return (
    <StateContainer>
      <LoadingState title='Loading' description='This may take a few seconds' />
    </StateContainer>
  );
}

export function UpgradeViewError() {
  return (
    <StateContainer>
      <ErrorState title='Error' description='Please try again later' />
    </StateContainer>
  );
}
