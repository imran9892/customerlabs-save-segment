export type Option = {
  value: string;
  label: string;
  traits: string;
};

export const allOptions: Option[] = [
  {
    value: 'first_name',
    label: 'First Name',
    traits: '/green-dot.png',
  },
  {
    value: 'last_name',
    label: 'Last Name',
    traits: '/green-dot.png',
  },
  {
    value: 'gender',
    label: 'Gender',
    traits: '/green-dot.png',
  },
  {
    value: 'age',
    label: 'Age',
    traits: '/green-dot.png',
  },
  {
    value: 'account_name',
    label: 'Account Name',
    traits: '/red-dot.png',
  },
  {
    value: 'city',
    label: 'City',
    traits: '/red-dot.png',
  },
  {
    value: 'state',
    label: 'State',
    traits: '/red-dot.png',
  },
];
