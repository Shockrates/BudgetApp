export const Colors = [
    'red',
    'blue',
    'amber',
    'green',
    'purple',
    'pink',
    'indigo',
    'teal',
    'orange'
] as const;

export type Color = typeof Colors[number];