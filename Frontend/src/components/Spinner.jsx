export default function Spinner({ size = 'md' }) {
  const sizes = { sm: 'h-5 w-5', md: 'h-8 w-8', lg: 'h-12 w-12' }
  return (
    <div className="flex justify-center items-center p-8">
      <div className={`${sizes[size]} animate-spin rounded-full border-2 border-brand-600 border-t-transparent`} />
    </div>
  )
}