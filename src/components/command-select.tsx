'use client';

import { Button } from '@/components/ui/button';
import {
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  ResponsiveCommandDialog,
} from '@/components/ui/command';
import { cn } from '@/lib/utils';
import { ChevronsUpDown } from 'lucide-react';
import { useState, type ReactNode } from 'react';

interface Option<T extends string = string> {
  id: string;
  value: T;
  label: ReactNode;
}

interface CommandSelectProps<T extends string = string> {
  options?: Option<T>[];
  value?: T;
  placeholder?: string;
  className?: string;
  onSelect?: (value: T) => void;
  onSearch?: (value: string) => void;
}

export const CommandSelect = <T extends string = string>({
  options,
  value,
  placeholder,
  onSelect,
  onSearch,
  ...props
}: CommandSelectProps<T>) => {
  const [open, setOpen] = useState(false);
  const [internalValue, setInternalValue] = useState(value);
  const currentValue = value ?? internalValue;

  return (
    <>
      <Button
        {...props}
        type='button'
        variant={'outline'}
        onClick={() => {
          setOpen(true);
        }}
        className={cn(
          'justify-between px-2 text-base font-normal md:text-sm',
          !currentValue && 'text-muted-foreground',
          props.className,
        )}
      >
        {currentValue || placeholder}
        <ChevronsUpDown />
      </Button>
      <ResponsiveCommandDialog
        shouldFilter={!onSearch}
        open={open}
        onOpenChange={(open) => {
          onSearch?.('');
          setOpen(open);
        }}
      >
        <CommandInput placeholder='Search...' onValueChange={onSearch} />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup>
            {options?.map((item) => (
              <CommandItem
                key={item.id}
                onSelect={() => {
                  setInternalValue(item.value);
                  onSelect?.(item.value);
                  setOpen(false);
                }}
                value={item.value}
              >
                {item.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </ResponsiveCommandDialog>
    </>
  );
};
