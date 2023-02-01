import { FaRegComment } from 'react-icons/fa';

export const Replies = ({ count }: { count: number }) => {
  return (
    <div className="flex flex-row items-center gap-2">
      <button className="flex flex-row items-center gap-2">
        <FaRegComment className="w-4 h-4 text-gray-500" />
        <p className="text-neutral-500">{count}</p>
      </button>
    </div>
  );
};