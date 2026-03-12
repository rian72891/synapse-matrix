import { useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';

interface GumroadCheckoutProps {
  productUrl: string;
  buttonText: string;
  className?: string;
  variant?: 'default' | 'outline';
}

export function GumroadCheckout({ productUrl, buttonText, className, variant = 'default' }: GumroadCheckoutProps) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { checkSubscription } = useSubscription();

  useEffect(() => {
    // Load Gumroad overlay script
    if (!document.getElementById('gumroad-script')) {
      const script = document.createElement('script');
      script.id = 'gumroad-script';
      script.src = 'https://gumroad.com/js/gumroad.js';
      script.async = true;
      document.head.appendChild(script);
    }
  }, []);

  // Listen for Gumroad purchase success
  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      // Gumroad sends a message when purchase completes
      if (event.data && typeof event.data === 'string') {
        try {
          const data = JSON.parse(event.data);
          if (data.post_message_name === 'sale' || data.success) {
            console.log('[GUMROAD] Purchase completed!');
            // Wait a moment for webhook to process
            setTimeout(async () => {
              await checkSubscription();
              navigate('/obrigado');
            }, 3000);
          }
        } catch {
          // Not a JSON message, ignore
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [checkSubscription, navigate]);

  const handleClick = useCallback(() => {
    setLoading(true);
    
    // Append user email to Gumroad URL for pre-fill
    const url = new URL(productUrl);
    if (user?.email) {
      url.searchParams.set('email', user.email);
    }

    // Try Gumroad overlay first, fallback to new tab
    const gumroadOverlay = (window as any).GumroadOverlay;
    if (gumroadOverlay) {
      gumroadOverlay.show({ url: url.toString() });
    } else {
      // Open in new tab and poll for completion
      const popup = window.open(url.toString(), '_blank');
      
      // Poll to check if subscription was activated
      const pollInterval = setInterval(async () => {
        await checkSubscription();
        // The subscription check will update the context
      }, 5000);

      // Stop polling after 10 minutes
      setTimeout(() => {
        clearInterval(pollInterval);
      }, 600000);
    }

    setTimeout(() => setLoading(false), 2000);
  }, [productUrl, user?.email, checkSubscription]);

  return (
    <a
      href={productUrl + (user?.email ? `?email=${encodeURIComponent(user.email)}` : '')}
      className="gumroad-button"
      onClick={(e) => {
        e.preventDefault();
        handleClick();
      }}
    >
      <Button
        disabled={loading}
        variant={variant}
        className={className}
        asChild={false}
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : buttonText}
      </Button>
    </a>
  );
}
