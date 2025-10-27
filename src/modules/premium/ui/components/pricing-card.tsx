import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import { CircleCheck } from 'lucide-react';

const pricingCardVariants = cva('rounded-lg border p-4 py-6', {
  variants: {
    variant: {
      default: 'bg-white text-black',
      highlighted: 'from-primary to-primary/50 bg-linear-to-br text-white',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const pricingCardIconVariants = cva('size-5', {
  variants: {
    variant: {
      default: 'fill-primary text-white',
      highlighted: 'fill-white text-black',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const pricingCardSecondaryTextVariants = cva('text-neutral-700', {
  variants: {
    variant: {
      default: 'text-neutral-700',
      highlighted: 'text-neutral-300',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const pricingCardBadgeVariants = cva('p-1 text-xs font-normal text-black', {
  variants: {
    variant: {
      default: 'bg-primary/20',
      highlighted: 'bg-[#f5b797]',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

interface PricingCardProps extends VariantProps<typeof pricingCardVariants> {
  badge?: string;
  price: number;
  features: string[];
  title: string;
  description?: string;
  priceSuffix: string;
  buttonText: string;
  className?: string;
  onClick?: () => void;
}

export const PricingCard = ({
  badge,
  price,
  features,
  title,
  description,
  priceSuffix,
  buttonText,
  className,
  onClick,
  variant,
}: PricingCardProps) => {
  return (
    <div
      className={cn(
        'flex flex-col gap-4',
        pricingCardVariants({ variant }),
        className,
      )}
    >
      <div className='flex flex-col gap-4'>
        <div className='flex items-center gap-2'>
          <h6 className='text-xl font-medium'>{title}</h6>
          {badge && (
            <Badge className={cn(pricingCardBadgeVariants({ variant }))}>
              {badge}
            </Badge>
          )}
        </div>
        <div className='flex justify-between gap-2'>
          <p
            className={cn(
              'text-xs',
              pricingCardSecondaryTextVariants({ variant }),
            )}
          >
            {description || ''}
          </p>
          <h4 className='text-3xl font-medium'>
            {Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
              minimumFractionDigits: 0,
            }).format(price)}
            <span
              className={cn(
                'text-base font-normal',
                pricingCardSecondaryTextVariants({ variant }),
              )}
            >
              {priceSuffix}
            </span>
          </h4>
        </div>
      </div>
      <Separator className='bg-primary/60' />
      <Button
        onClick={onClick}
        size='lg'
        variant={variant === 'highlighted' ? 'default' : 'outline'}
        className='w-full'
      >
        {buttonText}
      </Button>
      <div className='flex flex-col gap-2.5'>
        <p className='font-medium uppercase'>Features</p>
        <ul
          className={cn(
            'flex flex-col gap-2',
            pricingCardSecondaryTextVariants({ variant }),
          )}
        >
          {features.map((feature) => (
            <li key={feature} className='flex items-center gap-2'>
              <CircleCheck
                className={cn(pricingCardIconVariants({ variant }))}
              />
              {feature}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
