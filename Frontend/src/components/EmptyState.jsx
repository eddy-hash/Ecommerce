import { FiInbox } from 'react-icons/fi'

export default function EmptyState({ title, message, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
        <FiInbox className="w-10 h-10 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
      {message && <p className="text-gray-500 dark:text-gray-400 mt-1 max-w-md">{message}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}