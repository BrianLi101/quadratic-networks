import { resolveAddressToENS } from '@/helpers/ens';
import { useEffect, useState } from 'react';

interface ReadableAddressRowProps {
  address: string;
}
export const ReadableAddressRow = ({ address }: ReadableAddressRowProps) => {
  const [text, setText] = useState<string>(address);
  useEffect(() => {
    if (address) {
      resolveAddressToENS(address).then((ens) => {
        ens && setText(ens);
      });
    }
  }, [address]);
  return <p>{text}</p>;
};
