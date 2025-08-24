import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle, Download, Mail } from 'lucide-react';

interface PurchaseConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  purchaseDetails: {
    type: 'ticket' | 'merchandise';
    itemName: string;
    quantity: number;
    totalPrice: number;
    buyerName: string;
    buyerEmail: string;
    ticketNumbers?: string[];
  };
}

const PurchaseConfirmationModal = ({ isOpen, onClose, purchaseDetails }: PurchaseConfirmationModalProps) => {
  const { type, itemName, quantity, totalPrice, buyerName, buyerEmail, ticketNumbers } = purchaseDetails;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-wellness">
            <CheckCircle className="w-6 h-6" />
            <span>Purchase Confirmed!</span>
          </DialogTitle>
          <DialogDescription>
            Thank you for your purchase. Your order has been processed successfully.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 mt-6">
          {/* Purchase Summary */}
          <div className="bg-muted/50 p-4 rounded-lg space-y-3">
            <h3 className="font-semibold text-foreground">Order Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Item:</span>
                <span className="font-medium">{itemName}</span>
              </div>
              <div className="flex justify-between">
                <span>Quantity:</span>
                <span className="font-medium">{quantity}</span>
              </div>
              <div className="flex justify-between">
                <span>Total:</span>
                <span className="font-bold text-secondary">KSh {totalPrice.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Customer Details */}
          <div className="bg-muted/50 p-4 rounded-lg space-y-2">
            <h3 className="font-semibold text-foreground">Customer Details</h3>
            <div className="text-sm space-y-1">
              <p><span className="text-muted-foreground">Name:</span> {buyerName}</p>
              <p><span className="text-muted-foreground">Email:</span> {buyerEmail}</p>
            </div>
          </div>

          {/* Ticket Numbers (if applicable) */}
          {type === 'ticket' && ticketNumbers && (
            <div className="bg-wellness/10 p-4 rounded-lg space-y-2">
              <h3 className="font-semibold text-foreground">Your Ticket Numbers</h3>
              <div className="grid grid-cols-1 gap-2">
                {ticketNumbers.map((ticketNumber, index) => (
                  <div key={index} className="bg-background p-2 rounded border text-center font-mono text-sm">
                    {ticketNumber}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Next Steps */}
          <div className="bg-background border border-border p-4 rounded-lg space-y-3">
            <h3 className="font-semibold text-foreground flex items-center space-x-2">
              <Mail className="w-4 h-4" />
              <span>What&apos;s Next?</span>
            </h3>
            <div className="text-sm text-muted-foreground space-y-2">
              <p>✓ Confirmation email sent to {buyerEmail}</p>
              {type === 'ticket' && (
                <>
                  <p>✓ Bring your ticket numbers to the event</p>
                  <p>✓ Don&apos;t forget your yoga mat and water bottle</p>
                </>
              )}
              {type === 'merchandise' && (
                <p>✓ Your items will be available for pickup at our next event</p>
              )}
            </div>
          </div>

          <div className="flex space-x-2">
            <Button onClick={onClose} className="flex-1">
              Continue Shopping
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Receipt
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PurchaseConfirmationModal;