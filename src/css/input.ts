import { twMerge } from 'tailwind-merge'

export const getDefaultInputClasses = (cls: string) => {
  return twMerge(
    'border px-3 py-[5px] rounded text-base leading-[24px]',
    'focus:outline-black',
    cls
  )
}