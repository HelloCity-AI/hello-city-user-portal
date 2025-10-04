'use client';

import { Skeleton } from '@mui/material';

export default function MessageSkeleton() {
  return (
    <>
      <div className="flex w-full items-start justify-end gap-2 py-4 md:gap-3">
        <div className="flex w-full max-w-sm flex-col items-end gap-0 py-3 pl-0 pr-4 sm:max-w-md md:max-w-lg md:gap-2 lg:max-w-xl">
          <Skeleton variant="text" width="100%" height={20} />
          <Skeleton variant="text" width="85%" height={20} />
        </div>{' '}
        <Skeleton variant="circular" width={36} height={36} className="flex-shrink-0" />
      </div>
      <div className="flex w-full items-start gap-2 py-4 md:gap-3">
        <Skeleton variant="circular" width={36} height={36} className="flex-shrink-0" />
        <div className="flex w-full max-w-sm flex-col gap-0 py-3 pl-0 pr-4 sm:max-w-md md:max-w-lg md:gap-2 lg:max-w-xl">
          <Skeleton variant="text" width="100%" height={20} />
          <Skeleton variant="text" width="85%" height={20} />
          <Skeleton variant="text" width="65%" height={20} />
        </div>
      </div>
      <div className="flex w-full items-start justify-end gap-2 py-4 md:gap-3">
        <div className="flex w-full max-w-sm flex-col items-end gap-0 py-3 pl-0 pr-4 sm:max-w-md md:max-w-lg md:gap-2 lg:max-w-xl">
          <Skeleton variant="text" width="100%" height={20} />
          <Skeleton variant="text" width="85%" height={20} />
        </div>{' '}
        <Skeleton variant="circular" width={36} height={36} className="flex-shrink-0" />
      </div>
      <div className="flex w-full items-start gap-2 py-4 md:gap-3">
        <Skeleton variant="circular" width={36} height={36} className="flex-shrink-0" />
        <div className="flex w-[80%] max-w-screen-md flex-1 content-start gap-0 rounded-lg pl-0 md:gap-2">
          <Skeleton variant="rectangular" width="100%" height={150} className="rounded-lg" />
        </div>
      </div>
    </>
  );
}
