import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, X } from 'lucide-react';
import { useToast } from '../ui/use-toast';

interface NewsletterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NewsletterModal = ({ isOpen, onClose }: NewsletterModalProps) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name) return;

    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Welcome to our community!",
        description: "You've successfully joined our newsletter. Namaste! 🧘‍♀️",
      });
      
      setEmail('');
      setName('');
      onClose();
    } catch (error) {
      toast({
        title: "Oops! Something went wrong",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Mail className="w-5 h-5 text-secondary" />
            <span>Join Our Wellness Community</span>
          </DialogTitle>
          <DialogDescription>
            Stay connected with YIPN™ and receive wellness tips, event updates, and exclusive content.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="flex space-x-2 pt-4">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? 'Joining...' : 'Join Newsletter'}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewsletterModal;