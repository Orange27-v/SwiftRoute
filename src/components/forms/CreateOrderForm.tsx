'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { createDeliveryOrder } from '@/lib/actions/order.actions';
import type { CreateDeliveryOrderInput } from '@/types';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  pickup_address: z.string().min(10, {
    message: 'Pickup address must be at least 10 characters.',
  }),
  dropoff_address: z.string().min(10, {
    message: 'Dropoff address must be at least 10 characters.',
  }),
  item_description: z.string().min(5, {
    message: 'Item description must be at least 5 characters.',
  }).max(500, { message: 'Item description must be less than 500 characters.'}),
  price: z.coerce.number().positive({
    message: 'Price must be a positive number.',
  }),
  // Optional: Add fields for pickup_lat, pickup_lng, dropoff_lat, dropoff_lng if using map input
});

type CreateOrderFormValues = z.infer<typeof formSchema>;

export function CreateOrderForm() {
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<CreateOrderFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pickup_address: '',
      dropoff_address: '',
      item_description: '',
      price: 0,
    },
  });

  const {isSubmitting} = form.formState;

  async function onSubmit(values: CreateOrderFormValues) {
    // Here, you would ideally use getAddressDetails from src/services/google-maps.ts
    // to convert addresses to lat/lng if your backend requires it.
    // For this example, we'll pass addresses directly.
    // const pickupDetails = await getAddressDetails(values.pickup_address);
    // const dropoffDetails = await getAddressDetails(values.dropoff_address);

    const orderInput: CreateDeliveryOrderInput = {
      ...values,
      // pickup_lat: pickupDetails.lat,
      // pickup_lng: pickupDetails.lng,
      // dropoff_lat: dropoffDetails.lat,
      // dropoff_lng: dropoffDetails.lng,
    };
    
    try {
      const result = await createDeliveryOrder(orderInput);
      if (result.success && result.order) {
        toast({
          title: 'Order Created!',
          description: `Your delivery order #${result.order.id.slice(-5)} has been successfully created.`,
          variant: 'default',
        });
        form.reset();
        router.push('/dashboard/business/orders'); // Redirect to orders page or order detail
      } else {
        toast({
          title: 'Error Creating Order',
          description: result.message || 'An unexpected error occurred.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error("Error in onSubmit:", error);
      toast({
        title: 'Error',
        description: 'Failed to create delivery order. Please try again.',
        variant: 'destructive',
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="pickup_address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pickup Address</FormLabel>
              <FormControl>
                <Input placeholder="e.g., 123 Main St, Anytown, CA 90210" {...field} />
              </FormControl>
              <FormDescription>
                Enter the full address for package pickup.
                {/* TODO: Integrate Google Maps Autocomplete here */}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="dropoff_address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dropoff Address</FormLabel>
              <FormControl>
                <Input placeholder="e.g., 456 Oak Ave, Otherville, NY 10001" {...field} />
              </FormControl>
              <FormDescription>
                Enter the full address for package delivery.
                {/* TODO: Integrate Google Maps Autocomplete here */}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="item_description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Item Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe the item(s) to be delivered (e.g., 'Box of books, fragile', 'Office documents')"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Provide a clear description of the contents and any special handling instructions.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Offered Price (e.g. NGN)</FormLabel>
              <FormControl>
                <Input type="number" placeholder="50.00" {...field} step="0.01" />
              </FormControl>
              <FormDescription>
                Enter the amount you are offering for this delivery. This will be held in escrow.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Create Delivery Order
        </Button>
      </form>
    </Form>
  );
}
