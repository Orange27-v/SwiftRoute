'use client';

import type { DeliveryOrder, UserRole } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Package, DollarSign, CalendarDays, User, CheckCircle, XCircle, AlertTriangle, Hourglass, Truck } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { acceptDeliveryOrder, updateOrderStatus } from '@/lib/actions/order.actions';
import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface OrderCardProps {
  order: DeliveryOrder;
  currentUserRole: UserRole; // To tailor actions/display
  onActionComplete?: () => void; // Callback after an action
}

const statusColors: Record<DeliveryOrder['status'], string> = {
  pending_acceptance: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  pending_payment: 'bg-blue-100 text-blue-800 border-blue-300',
  in_escrow: 'bg-green-100 text-green-800 border-green-300',
  delivered: 'bg-purple-100 text-purple-800 border-purple-300',
  confirmed_by_business: 'bg-teal-100 text-teal-800 border-teal-300',
  cancelled_by_business: 'bg-red-100 text-red-800 border-red-300',
  cancelled_by_logistics: 'bg-red-100 text-red-800 border-red-300',
  disputed: 'bg-orange-100 text-orange-800 border-orange-300',
};

const statusIcons: Record<DeliveryOrder['status'], React.ElementType> = {
  pending_acceptance: Hourglass,
  pending_payment: DollarSign,
  in_escrow: Truck,
  delivered: Package,
  confirmed_by_business: CheckCircle,
  cancelled_by_business: XCircle,
  cancelled_by_logistics: XCircle,
  disputed: AlertTriangle,
};

export function OrderCard({ order, currentUserRole, onActionComplete }: OrderCardProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleAcceptOrder = async () => {
    setIsLoading(true);
    try {
      const result = await acceptDeliveryOrder(order.id);
      if (result.success) {
        toast({ title: "Order Accepted", description: result.message, variant: "default" });
        onActionComplete?.();
      } else {
        toast({ title: "Failed to Accept", description: result.message, variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "An unexpected error occurred.", variant: "destructive" });
    }
    setIsLoading(false);
  };

  const handleMarkDelivered = async () => {
    setIsLoading(true);
    try {
      const result = await updateOrderStatus(order.id, 'delivered');
      if (result.success) {
        toast({ title: "Order Marked Delivered", description: result.message, variant: "default" });
        onActionComplete?.();
      } else {
        toast({ title: "Failed to Update Status", description: result.message, variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "An unexpected error occurred.", variant: "destructive" });
    }
    setIsLoading(false);
  };
  
  const handleConfirmDelivery = async () => {
    setIsLoading(true);
    try {
      const result = await updateOrderStatus(order.id, 'confirmed_by_business');
      if (result.success) {
        toast({ title: "Delivery Confirmed", description: "Payment will be released shortly.", variant: "default" });
        onActionComplete?.();
      } else {
        toast({ title: "Failed to Confirm", description: result.message, variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "An unexpected error occurred.", variant: "destructive" });
    }
    setIsLoading(false);
  };


  const formatCurrency = (amount: number, currency: string = "NGN") => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: currency }).format(amount / 100);
  };

  const StatusIcon = statusIcons[order.status] || AlertTriangle;

  return (
    <Card className="w-full shadow-sm hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">Order #{order.id.slice(-6)}</CardTitle>
            <CardDescription>
              Created {formatDistanceToNow(new Date(order.created_at), { addSuffix: true })}
            </CardDescription>
          </div>
          <Badge className={`${statusColors[order.status]} text-xs px-2 py-1 flex items-center`}>
            <StatusIcon className="h-3 w-3 mr-1" />
            {order.status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="flex items-start">
          <MapPin className="h-4 w-4 mr-2 mt-0.5 text-primary flex-shrink-0" />
          <div>
            <span className="font-medium">From:</span> {order.pickup_address}
          </div>
        </div>
        <div className="flex items-start">
          <MapPin className="h-4 w-4 mr-2 mt-0.5 text-accent flex-shrink-0" />
          <div>
            <span className="font-medium">To:</span> {order.dropoff_address}
          </div>
        </div>
        <div className="flex items-center">
          <Package className="h-4 w-4 mr-2 text-muted-foreground flex-shrink-0" />
          <div>
            <span className="font-medium">Item:</span> {order.item_description}
          </div>
        </div>
        <div className="flex items-center">
          <DollarSign className="h-4 w-4 mr-2 text-green-600 flex-shrink-0" />
          <div>
            <span className="font-medium">Price:</span> {formatCurrency(order.price)}
          </div>
        </div>
        {currentUserRole === 'logistics' && order.business_name && (
          <div className="flex items-center">
            <User className="h-4 w-4 mr-2 text-muted-foreground flex-shrink-0" />
            <div>
              <span className="font-medium">Client:</span> {order.business_name}
            </div>
          </div>
        )}
         {currentUserRole === 'business' && order.logistics_name && (
          <div className="flex items-center">
            <Truck className="h-4 w-4 mr-2 text-muted-foreground flex-shrink-0" />
            <div>
              <span className="font-medium">Provider:</span> {order.logistics_name}
            </div>
          </div>
        )}
        <div className="flex items-center text-xs text-muted-foreground">
          <CalendarDays className="h-3 w-3 mr-1.5 flex-shrink-0" />
          Last Updated: {format(new Date(order.updated_at), "MMM d, yyyy HH:mm")}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        {currentUserRole === 'logistics' && order.status === 'pending_acceptance' && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button size="sm" variant="default" className="bg-primary hover:bg-primary/90" disabled={isLoading}>
                {isLoading ? 'Accepting...' : 'Accept Order'}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Accept this Delivery Order?</AlertDialogTitle>
                <AlertDialogDescription>
                  You are about to accept order #{order.id.slice(-6)} for {formatCurrency(order.price)}.
                  The business will be notified to make payment into escrow.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleAcceptOrder} className="bg-primary hover:bg-primary/90">Confirm Acceptance</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
        {currentUserRole === 'logistics' && order.status === 'in_escrow' && (
           <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button size="sm" variant="outline" disabled={isLoading}>
                {isLoading ? 'Updating...' : 'Mark as Delivered'}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Mark Order as Delivered?</AlertDialogTitle>
                <AlertDialogDescription>
                  Confirm that order #{order.id.slice(-6)} has been successfully delivered. 
                  The business will be notified to confirm receipt.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleMarkDelivered}>Confirm Delivery</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
        {currentUserRole === 'business' && order.status === 'delivered' && (
           <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button size="sm" className="bg-accent hover:bg-accent/90" disabled={isLoading}>
                {isLoading ? 'Confirming...' : 'Confirm Delivery & Release Payment'}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirm Delivery and Release Payment?</AlertDialogTitle>
                <AlertDialogDescription>
                  By confirming, you acknowledge receipt of order #{order.id.slice(-6)}. 
                  The payment of {formatCurrency(order.price)} will be released to the logistics provider. This action is final.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleConfirmDelivery} className="bg-accent hover:bg-accent/90">Confirm & Release Funds</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
        {currentUserRole === 'business' && order.status === 'pending_payment' && (
          <Button size="sm" variant="default" className="bg-green-600 hover:bg-green-700 text-white" disabled={isLoading}>
            {/* This would link to Paystack payment page */}
            Pay {formatCurrency(order.price)} into Escrow
          </Button>
        )}
        {/* Add more actions based on status and role, e.g., Cancel Order, Raise Dispute */}
      </CardFooter>
    </Card>
  );
}
