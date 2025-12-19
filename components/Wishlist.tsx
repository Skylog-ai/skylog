import React, { useState } from 'react';
import { PlusIcon, TrashIcon, ShareIcon, ClipboardDocumentIcon } from './icons';

interface WishlistProps {
  wishlist: string[];
  setWishlist: React.Dispatch<React.SetStateAction<string[]>>;
}

const Wishlist: React.FC<WishlistProps> = ({ wishlist, setWishlist }) => {
  const [newItem, setNewItem] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (newItem.trim() && !wishlist.includes(newItem.trim())) {
      setWishlist([...wishlist, newItem.trim()].sort());
      setNewItem('');
    }
  };

  const handleRemoveItem = (itemToRemove: string) => {
    setWishlist(wishlist.filter(item => item !== itemToRemove));
  };

  const handleShare = () => {
    const shareText = `Here's my travel wishlist on SkyLog: ${wishlist.join(', ')}. What are your dream destinations? #SkyLog #TravelWishlist`;
    navigator.clipboard.writeText(shareText).then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg">
      <div className="p-4 sm:p-6 border-b border-slate-200 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">Travel Wishlist</h2>
        {wishlist.length > 0 && (
            <button 
                onClick={handleShare}
                className="flex items-center text-sm font-semibold text-teal-600 hover:text-teal-800"
            >
                {isCopied ? <ClipboardDocumentIcon className="w-4 h-4 mr-1" /> : <ShareIcon className="w-4 h-4 mr-1" />}
                {isCopied ? 'Copied!' : 'Share'}
            </button>
        )}
      </div>
      <div className="p-4 sm:p-6">
        <form onSubmit={handleAddItem} className="flex items-center gap-2 mb-4">
          <input
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            placeholder="Add a country or city..."
            className="flex-grow bg-slate-100 border border-slate-300 rounded-md shadow-sm py-2 px-3 text-slate-900 focus:outline-none focus:ring-teal-500 focus:border-teal-500"
          />
          <button type="submit" className="bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-md p-2 shadow-sm" aria-label="Add to wishlist">
            <PlusIcon className="h-6 w-6" />
          </button>
        </form>
        {wishlist.length > 0 ? (
          <ul className="space-y-2">
            {wishlist.map(item => (
              <li key={item} className="flex items-center justify-between bg-slate-50 p-3 rounded-md animate-fade-in">
                <span className="font-medium text-slate-700">{item}</span>
                <button onClick={() => handleRemoveItem(item)} className="text-slate-400 hover:text-red-500" aria-label={`Remove ${item} from wishlist`}>
                  <TrashIcon className="h-5 w-5" />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-6">
            <h3 className="text-lg font-semibold text-slate-800">Your Wishlist is Empty</h3>
            <p className="mt-1 text-slate-500 text-sm">Add your dream destinations to start planning!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;