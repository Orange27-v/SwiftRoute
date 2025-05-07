'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { DeliveryOrder } from "@/types";
import { OrderCard } from "./OrderCard";
import { useState, useEffect } from "react";
import { getAvailableOrdersForLogistics, getLogisticsCompanyDeliveries } from "@/lib/actions/order.actions";
import { PackageSearch, Truck } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import { Card } from "../ui/card";


interface LogisticsOrdersTabsProps {
  initialAvailableOrders: DeliveryOrder[]; // Renamed from availableOrders
  initialMyDeliveries: DeliveryOrder[]; // Renamed from myDeliveries
}

export function LogisticsOrdersTabs({ initialAvailableOrders, initialMyDeliveries }: LogisticsOrdersTabsProps) {
  const [availableOrdersData, setAvailableOrdersData] = useState<DeliveryOrder[]>(initialAvailableOrders);
  const [myDeliveriesData, setMyDeliveriesData] = useState<DeliveryOrder[]>(initialMyDeliveries);
  const [isLoading, setIsLoading] = useState(false); 

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const [availOrders, myDelivs] = await Promise.all([
        getAvailableOrdersForLogistics(),
        getLogisticsCompanyDeliveries()
      ]);
      setAvailableOrdersData(availOrders);
      setMyDeliveriesData(myDelivs);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      // Optionally set an error state here to display to the user
    } finally {
      setIsLoading(false);
    }
  };

  // Initial data is now directly set, useEffect for fetching if undefined is removed
  // as props are guaranteed by the parent component.

  const handleActionComplete = () => {
    // Re-fetch orders after an action to update the lists
    fetchOrders();
  };
  
  const renderOrderList = (orders: DeliveryOrder[], listType: 'available' | 'mine') => {
    if (isLoading) {
      return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...Array(4)].map((_, i) => (
             <CardSkeleton key={i} />
          ))}
        </div>
      );
    }

    if (orders.length === 0) {
      const Icon = listType === 'available' ? PackageSearch : Truck;
      const message = listType === 'available' 
        ? "No new delivery requests available at the moment. Check back soon!"
        : "You don't have any active deliveries right now.";
      
      return (
        <Card className="col-span-full">
          <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground rounded-lg border-2 border-dashed border-border min-h-[200px]">
            <Icon className="w-16 h-16 mb-4 opacity-50" />
            <p className="text-lg font-medium">{message}</p>
          </div>
        </Card>
      );
    }
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {orders.map(order => (
          <OrderCard 
            key={order.id} 
            order={order} 
            currentUserRole="logistics" 
            onActionComplete={handleActionComplete}
          />
        ))}
      </div>
    );
  };


  return (
    <Tabs defaultValue="available" className="w-full">
      <TabsList className="grid w-full grid-cols-2 md:w-auto md:inline-flex mb-6">
        <TabsTrigger value="available">
          <PackageSearch className="mr-2 h-4 w-4" />
          Available Orders ({availableOrdersData.length})
        </TabsTrigger>
        <TabsTrigger value="my-deliveries">
          <Truck className="mr-2 h-4 w-4" />
          My Deliveries ({myDeliveriesData.filter(o => o.status !== 'confirmed_by_business' && o.status !== 'cancelled_by_business' && o.status !== 'cancelled_by_logistics').length})
        </TabsTrigger>
      </TabsList>
      <TabsContent value="available">
        <h2 className="text-xl font-semibold mb-4">New Delivery Requests</h2>
        {renderOrderList(availableOrdersData, 'available')}
      </TabsContent>
      <TabsContent value="my-deliveries">
         <h2 className="text-xl font-semibold mb-4">Your Active & Past Deliveries</h2>
        {renderOrderList(myDeliveriesData, 'mine')}
      </TabsContent>
    </Tabs>
  );
}


const CardSkeleton = () => (
  <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 space-y-4">
    <div className="flex justify-between items-start">
      <div>
        <Skeleton className="h-5 w-32 mb-1" />
        <Skeleton className="h-3 w-24" />
      </div>
      <Skeleton className="h-6 w-28 rounded-full" />
    </div>
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-3/4" />
    <Skeleton className="h-4 w-1/2" />
    <div className="flex justify-end">
      <Skeleton className="h-9 w-24 rounded-md" />
    </div>
  </div>
);
