import { twMerge } from 'tailwind-merge'

const colorStyle = {
  primary: 'bg-black text-white disabled:bg-gray-300',
  outline:
    'bg-white text-black disabled:text-gray-300 border border-black disabled:border-gray-300',
  danger: 'bg-red-800 text-white disabled:bg-gray-300',
}

const commonBtnStyle = [
  'flex justify-center items-center',
  'cursor-pointer disabled:cursor-not-allowed',
  'rounded-md',
  'py-2 px-2',
  'hover:scale-[1.02] active:scale-[0.98] disabled:hover:scale-100 transition-all',
]

export const getPrimayButtonClasses = (cls: string) => {
  return twMerge(
    colorStyle.primary,
    ...commonBtnStyle,
    cls
  )
}
