import { Skeleton } from "@/components/ui/skeleton"

export default function VehicleDetailLoading() {
  return (
    <div className="bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Skeleton className="h-6 w-32" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Vehicle details skeleton */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border overflow-hidden">
              <Skeleton className="aspect-[16/9]" />
              <div className="p-6 space-y-6">
                <div className="flex justify-between">
                  <div className="space-y-1">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <div className="text-right space-y-1">
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>

                <Skeleton className="h-4 w-64" />

                <div className="grid grid-cols-3 gap-4">
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                </div>

                <div className="space-y-4">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-32 w-full" />
                </div>
              </div>
            </div>
          </div>

          {/* Booking form skeleton */}
          <div>
            <div className="bg-white rounded-lg border overflow-hidden">
              <div className="p-6 space-y-6">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

