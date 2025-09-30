import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import Link from 'next/link';
import { Fragment, type Key } from 'react';

interface BreadcrumbHeaderProps {
  items: {
    id: Key;
    label: string;
    href: string;
  }[];
}

export const BreadcrumbHeader = ({
  items,
}: {
  items: BreadcrumbHeaderProps['items'];
}) => {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {items.map((item, index) => (
          <Fragment key={item.id}>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link
                  href={item.href}
                  className={`text-xl font-medium ${index === items.length - 1 ? 'text-foreground' : ''}`}
                >
                  {item.label}
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            {index < items.length - 1 && (
              <BreadcrumbSeparator className='text-foreground [&>svg]:size-4' />
            )}
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};
