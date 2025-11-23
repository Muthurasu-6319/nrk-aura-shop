
import React, { useEffect, useState, useMemo } from 'react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { getProductRomanceCopy } from '../services/geminiService';
import { VirtualTryOn } from '../components/VirtualTryOn';
import { StarRating } from '../components/StarRating';

interface ProductDetailsProps {
  product: Product;
  onBack: () => void;
  onNavigate: (page: string) => void;
}

export const ProductDetails: React.FC<ProductDetailsProps> = ({ product, onBack, onNavigate }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { isAuthenticated, user } = useAuth();
  const { reviews, addReview } = useData();
  
  const [romanceCopy, setRomanceCopy] = useState<string>(product.description);
  const [isGenerating, setIsGenerating] = useState(true);
  const [showTryOn, setShowTryOn] = useState(false);
  
  // Review State
  const [userRating, setUserRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);
  
  const isWishlisted = isInWishlist(product.id);

  // Filter reviews for this product
  const productReviews = useMemo(() => {
    return reviews.filter(r => r.productId === product.id).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [reviews, product.id]);

  const averageRating = useMemo(() => {
    if (productReviews.length === 0) return 0;
    const sum = productReviews.reduce((acc, r) => acc + r.rating, 0);
    return Math.round(sum / productReviews.length);
  }, [productReviews]);

  useEffect(() => {
    const fetchCopy = async () => {
        setIsGenerating(true);
        const copy = await getProductRomanceCopy(product);
        setRomanceCopy(copy);
        setIsGenerating(false);
    };
    fetchCopy();
  }, [product]);

  const handleAddToCart = () => {
    if (isAuthenticated) {
      addToCart(product);
    } else {
      onNavigate('login');
    }
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated || !user) {
      onNavigate('login');
      return;
    }
    
    if (userRating === 0) {
      alert("Please select a star rating.");
      return;
    }

    const newReview = {
      id: Date.now().toString(),
      productId: product.id,
      userId: user.id,
      userName: user.name,
      rating: userRating,
      comment: reviewComment,
      date: new Date().toISOString().split('T')[0]
    };

    addReview(newReview);
    setReviewComment('');
    setUserRating(0);
    setShowReviewForm(false);
  };

  return (
    <div className="min-h-screen bg-brand-50 py-16 px-4 animate-[fadeIn_0.5s_ease-out]">
        {showTryOn && <VirtualTryOn product={product} onClose={() => setShowTryOn(false)} />}
        
      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden">
        <div className="flex flex-col md:flex-row border-b border-brand-50">
            {/* Image */}
            <div className="md:w-1/2 relative bg-brand-50 group overflow-hidden p-10 flex items-center justify-center">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl w-full">
                    <img src={product.image} alt={product.name} className="w-full h-auto object-cover transition-transform duration-[2s] group-hover:scale-110" />
                </div>
                <div className="absolute bottom-10 left-0 right-0 flex justify-center z-10">
                    <button 
                        onClick={() => setShowTryOn(true)}
                        className="bg-white/90 backdrop-blur text-brand-800 px-8 py-3 rounded-full shadow-lg flex items-center gap-3 hover:bg-brand-800 hover:text-white transition-all uppercase text-xs font-bold tracking-widest transform hover:-translate-y-1"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        </svg>
                        Try On AR
                    </button>
                </div>
            </div>

            {/* Info */}
            <div className="md:w-1/2 p-12 flex flex-col justify-center bg-white">
                <button onClick={onBack} className="self-start text-brand-400 hover:text-brand-600 mb-10 flex items-center gap-2 text-xs uppercase tracking-widest font-bold">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back
                </button>

                <div className="mb-4 flex justify-between items-center">
                    <span className="bg-brand-50 text-brand-600 px-4 py-1 rounded-full uppercase tracking-widest text-[10px] font-bold">{product.category}</span>
                    <StarRating rating={averageRating} count={productReviews.length} showCount />
                </div>
                <h1 className="font-serif text-5xl text-brand-900 mb-8">{product.name}</h1>

                <div className="mb-12 relative pl-6 border-l-2 border-gold-400">
                    <p className={`text-gray-600 leading-loose font-sans text-lg ${isGenerating ? 'animate-pulse' : ''}`}>
                        {romanceCopy}
                    </p>
                </div>

                <div className="flex items-center flex-wrap gap-3 mb-12">
                     {product.tags.map(tag => (
                         <span key={tag} className="text-gray-400 bg-gray-50 px-3 py-1 rounded-lg text-[10px] uppercase tracking-wide">#{tag}</span>
                     ))}
                </div>

                <div className="border-t border-gray-100 pt-10 flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">Price</span>
                        <span className="text-3xl font-serif font-bold text-brand-800">₹{product.price.toLocaleString('en-IN')}</span>
                        {product.shippingCost && product.shippingCost > 0 ? (
                           <span className="text-xs text-gray-500 mt-1">+ ₹{product.shippingCost} Shipping</span>
                        ) : (
                           <span className="text-xs text-green-600 mt-1 font-bold">Free Shipping</span>
                        )}
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => toggleWishlist(product)}
                            className={`p-4 rounded-full border transition-all duration-300 group shadow-sm ${isWishlisted ? 'bg-red-50 border-red-200 text-red-500 shadow-inner' : 'bg-white border-brand-200 text-brand-300 hover:border-brand-400 hover:text-brand-600 hover:shadow-md'}`}
                            title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className={`w-6 h-6 transition-transform duration-300 ${isWishlisted ? 'fill-current scale-110' : 'fill-none group-hover:scale-110'}`} viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </button>

                        <button 
                            onClick={handleAddToCart}
                            className="bg-brand-900 text-white px-10 py-4 uppercase tracking-widest text-xs font-bold hover:bg-brand-700 transition-all duration-300 shadow-xl rounded-full hover:shadow-brand-500/20 hover:-translate-y-0.5"
                        >
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        </div>

        {/* Reviews Section */}
        <div className="p-12 bg-gray-50/50">
          <div className="flex justify-between items-center mb-10">
            <h2 className="font-serif text-3xl text-brand-900">Reviews & Ratings</h2>
            <button 
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="text-brand-600 font-bold text-xs uppercase tracking-widest border-b border-brand-200 pb-1 hover:text-brand-900"
            >
              {showReviewForm ? 'Cancel Review' : 'Write a Review'}
            </button>
          </div>

          {/* Review Form */}
          {showReviewForm && (
            <div className="bg-white p-8 rounded-2xl shadow-lg mb-12 animate-[fadeIn_0.3s_ease-out]">
              {isAuthenticated ? (
                <form onSubmit={handleSubmitReview}>
                  <h3 className="font-serif text-xl mb-6 text-brand-900">Share your experience</h3>
                  <div className="mb-6">
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Your Rating</label>
                    <StarRating rating={userRating} editable onChange={setUserRating} size="lg" />
                  </div>
                  <div className="mb-6">
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Your Review</label>
                    <textarea 
                      required
                      rows={4}
                      className="w-full bg-brand-50 border border-brand-200 rounded-xl p-4 focus:outline-none focus:border-brand-500"
                      placeholder="Tell us about the craftsmanship, comfort, and style..."
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                    ></textarea>
                  </div>
                  <button 
                    type="submit" 
                    className="bg-brand-900 text-white px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-brand-800 shadow-lg"
                  >
                    Submit Review
                  </button>
                </form>
              ) : (
                 <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">Please sign in to leave a review.</p>
                    <button onClick={() => onNavigate('login')} className="bg-brand-900 text-white px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest">Login</button>
                 </div>
              )}
            </div>
          )}

          {/* Reviews List */}
          <div className="space-y-6">
            {productReviews.length > 0 ? (
              productReviews.map((review) => (
                <div key={review.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-800 font-bold font-serif">
                        {review.userName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-brand-900 text-sm">{review.userName}</p>
                        <p className="text-xs text-gray-400">{review.date}</p>
                      </div>
                    </div>
                    <StarRating rating={review.rating} size="sm" />
                  </div>
                  <p className="text-gray-600 leading-relaxed text-sm">
                    "{review.comment}"
                  </p>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-gray-400 italic">
                No reviews yet. Be the first to review this masterpiece.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
