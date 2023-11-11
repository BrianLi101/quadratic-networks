import { resolveAddressToENS } from '@/helpers/ens';
import { useEffect, useState } from 'react';

interface ReadableAddressRowProps {
  address: string;
  className?: string;
}
export const ReadableAddressRow = ({
  address,
  className,
}: ReadableAddressRowProps) => {
  const [text, setText] = useState<string>(address);
  useEffect(() => {
    if (address) {
      resolveAddressToENS(address).then((ens) => {
        ens && setText(ens);
      });
    }
  }, [address]);
  return <p className={className}>{text}</p>;
};
