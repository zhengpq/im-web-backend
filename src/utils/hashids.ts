import Hashids from 'hashids';

const hashids = new Hashids();

export const encode = (value: number) => hashids.encode(value);

export const decode = (value: string) => hashids.decode(value);
