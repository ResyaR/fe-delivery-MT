export function CategorySkeleton() {
  return (
    <div className="flex flex-col items-center bg-white text-center p-6 md:p-8 rounded-3xl border-0 shadow-lg animate-pulse">
      <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gray-200 mb-4 md:mb-6"></div>
      <div className="h-6 bg-gray-200 rounded w-32 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-24"></div>
    </div>
  );
}

export function TestimonialSkeleton() {
  return (
    <div className="flex flex-col p-8 bg-white rounded-xl shadow-lg animate-pulse">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-14 h-14 rounded-full bg-gray-200"></div>
        <div className="flex-1">
          <div className="h-5 bg-gray-200 rounded w-24 mb-2"></div>
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-4 h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      </div>
    </div>
  );
}

export function RestaurantCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden animate-pulse">
      <div className="w-full h-48 bg-gray-200"></div>
      <div className="p-4">
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
        <div className="flex items-center justify-between">
          <div className="h-6 bg-gray-200 rounded w-24"></div>
          <div className="h-10 bg-gray-200 rounded w-28"></div>
        </div>
      </div>
    </div>
  );
}

export function MenuItemSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden animate-pulse">
      <div className="w-full h-48 bg-gray-200"></div>
      <div className="p-4">
        <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3 mb-3"></div>
        <div className="flex items-center justify-between">
          <div className="h-6 bg-gray-200 rounded w-20"></div>
          <div className="h-10 bg-gray-200 rounded w-24"></div>
        </div>
      </div>
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="flex flex-col items-center p-6 md:p-8 bg-white rounded-2xl shadow-lg animate-pulse">
      <div className="w-16 h-16 bg-gray-200 rounded-full mb-4"></div>
      <div className="h-12 bg-gray-200 rounded w-24 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-32"></div>
    </div>
  );
}

export function OrderCardSkeleton() {
  return (
    <div className="bg-white p-4 md:p-6 rounded-lg shadow-md animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="h-6 bg-gray-200 rounded w-32"></div>
        <div className="h-6 bg-gray-200 rounded w-20"></div>
      </div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
      <div className="mt-4 flex justify-between items-center">
        <div className="h-5 bg-gray-200 rounded w-24"></div>
        <div className="h-8 bg-gray-200 rounded w-20"></div>
      </div>
    </div>
  );
}

export default function SkeletonLoader({ type = "category", count = 1 }) {
  const skeletonMap = {
    category: CategorySkeleton,
    testimonial: TestimonialSkeleton,
    restaurant: RestaurantCardSkeleton,
    menu: MenuItemSkeleton,
    stat: StatCardSkeleton,
    order: OrderCardSkeleton,
  };

  const SkeletonComponent = skeletonMap[type] || CategorySkeleton;

  return (
    <>
      {[...Array(count)].map((_, index) => (
        <SkeletonComponent key={index} />
      ))}
    </>
  );
}

