'use client';

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import Flag from "../../public/flag.png";

type MessageEvent = {
  origin: string;
  data: any;
}

const isValidMessageEvent = (event: unknown): event is MessageEvent => {
  if (typeof event === 'object' && event !== null) {
    if ('origin' in event && 'data' in event) {
      return true;
    }
  }
  return false;
}

export function Yoink({ 
  lastYoinkedBy, 
  pfpUrl, 
  totalYoinks 
}: { 
  lastYoinkedBy: string; 
  pfpUrl?: string; 
  totalYoinks: string; 
}) {
  const [yoinked, setYoinked] = useState(false);

  const close = () => {
    window.parent.postMessage({
      jsonrpc: "2.0",
      id: "01ef6570-5a51-48fa-910c-f419400a6d0d", // todo sdk or use uuid
      method: "fc_close",
    }, "*");      
  }

  useEffect(() => {
    window.parent.postMessage({
      jsonrpc: "2.0",
      id: "01ef6570-5a51-48fa-910c-f419400a6d0d", // todo sdk or use uuid
      method: "fc_hide_splash_screen",
    }, "*");      

    window.parent.postMessage({
      jsonrpc: "2.0",
      id: "01ef6570-5a51-48fa-910c-f419400a6d0d", // todo sdk or use uuid
      method: "fc_setPrimaryButton",
      params: {
        text: 'Yoink'
      }
    }, "*");

  }, []);

  const yoinkOnchain = useCallback(async () => {
    const params = new URLSearchParams({
      // todo request address
      address: (window as any).farcaster.address ?? "0xcA698e19280DFB59084A15f7E891778c483Be0DC",
    });

    const res = await fetch(`/api/yoink-tx?${params}`)
    if (res.status !== 200) {
      const error = await res.json();
      alert(error.message);
      return;
    }

    const tx = await res.json();

    const id = "01ef6570-5a51-48fa-910c-f419400a6daa";
    window.parent.postMessage({
      jsonrpc: "2.0",
      id,
      method: "fc_requestWalletAction",
      params: {
        action: tx
      }
    }, "*");

    const handleMessage = (event: unknown) => {
      if (isValidMessageEvent(event)) {
        if (event.data.id === id) {
          if (!yoinked) {
            setYoinked(true);
            window.parent.postMessage({
              jsonrpc: "2.0",
              id: "01ef6570-5a51-48fa-910c-f419400a6d0a", // todo sdk or use uuid
              method: "fc_setPrimaryButton",
              params: {
                text: 'Close'
              }
            }, "*");
          } else {
            close();
          }
        }
      }
    };

    document.addEventListener("ReactNativeWebViewCallback", handleMessage);
  }, [yoinked]);

  useEffect(() => {
    const handleMessage = (event: unknown) => {
      if (isValidMessageEvent(event)) {
        if (event.data.id === 'primary-button-clicked') {
          if (!yoinked) {
            void yoinkOnchain();
            // setYoinked(true);
            // window.parent.postMessage({
            //   jsonrpc: "2.0",
            //   id: "01ef6570-5a51-48fa-910c-f419400a6d0a", // todo sdk or use uuid
            //   method: "fc_setPrimaryButton",
            //   params: {
            //     text: 'Close'
            //   }
            // }, "*");
          } else {
            close();
          }
        }
      }
    };

    document.addEventListener("ReactNativeWebViewCallback", handleMessage);

    return () => {
      document.removeEventListener("ReactNativeWebViewCallback", handleMessage);
    }
  }, [yoinkOnchain, yoinked])

  if (yoinked) {
    return (
      <div className="p-3">
        <div className="bg-[#F3F3F3] rounded-lg p-6">
          <div className="text-lg text-[#BA181B] font-semibold">
            You have the flag
          </div>
        </div>
        <div className="hidden mt-3 grid-cols-4 gap-2 ">
          <div className="flex flex-col items-center bg-[#F7F7F7] border border-[#E1E1E1] p-[10px] rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <g clip-path="url(#clip0_1844_1230)">
              <path d="M10 11.6667C11.841 11.6667 13.3333 10.1743 13.3333 8.33333C13.3333 6.49238 11.841 5 10 5C8.15906 5 6.66668 6.49238 6.66668 8.33333C6.66668 10.1743 8.15906 11.6667 10 11.6667Z" fill="#24292E"/>
              <path fill-rule="evenodd" clip-rule="evenodd" d="M0.0430327 9.07297C0.0144686 9.37989 0 9.6892 0 10C0 11.028 0.158291 12.0397 0.461374 13.0025C0.463731 13.01 0.466096 13.0174 0.468471 13.0249C0.650324 13.5979 0.883501 14.1534 1.16515 14.6846C1.62695 15.5556 2.21907 16.3612 2.92893 17.0711C3.13405 17.2762 3.34716 17.4715 3.56753 17.6566C3.95451 17.9818 4.36389 18.2756 4.79168 18.5366L4.86576 18.5814C6.40462 19.502 8.17664 20 10 20C11.8527 20 13.6524 19.4859 15.2083 18.5366L15.2388 18.518C15.6651 18.2558 16.0729 17.9609 16.4583 17.6348C16.6695 17.4562 16.874 17.2681 17.0711 17.0711C17.7589 16.3832 18.3362 15.6055 18.7915 14.7654C18.8017 14.7466 18.8119 14.7278 18.8219 14.7089C19.0626 14.2579 19.2684 13.7893 19.4373 13.3072C19.4566 13.252 19.4755 13.1966 19.4939 13.141C19.8261 12.137 20 11.0774 20 10C20 9.5383 19.9681 9.07989 19.9054 8.62773C19.9006 8.59288 19.8956 8.55807 19.8904 8.5233C19.8167 8.0295 19.7063 7.54345 19.5608 7.06902C19.086 5.52026 18.2375 4.09536 17.0711 2.92893C15.1957 1.05357 12.6522 0 10 0C7.34784 0 4.8043 1.05357 2.92893 2.92893C1.71532 4.14255 0.845855 5.63599 0.383364 7.25761C0.376851 7.28044 0.370419 7.3033 0.364067 7.32619C0.208232 7.88773 0.101089 8.46431 0.0452271 9.04969C0.0444866 9.05745 0.0437552 9.06521 0.0430327 9.07297ZM3.30272 14.6003C3.49167 14.8754 3.69817 15.1397 3.92148 15.3914C4.11402 14.9842 4.37643 14.609 4.70105 14.2844C5.44338 13.542 6.4502 13.125 7.50001 13.125H12.5C13.5498 13.125 14.5566 13.542 15.299 14.2844C15.6236 14.609 15.886 14.9842 16.0785 15.3914C16.3353 15.1019 16.5699 14.7958 16.7811 14.4757C15.3665 13.8721 14.375 12.4685 14.375 10.8333C14.375 8.92132 15.7306 7.32593 17.5332 6.95591C17.1284 5.95417 16.524 5.03355 15.7452 4.25476C14.2215 2.73102 12.1549 1.875 10 1.875C7.84512 1.875 5.77849 2.73102 4.25476 4.25476C3.49157 5.01794 2.89589 5.91733 2.49138 6.89578C4.48579 7.10002 6.04167 8.78498 6.04167 10.8333C6.04167 12.594 4.89217 14.0861 3.30272 14.6003Z" fill="#24292E"/>
              </g>
              <defs>
              <clipPath id="clip0_1844_1230">
              <rect width="20" height="20" fill="white"/>
              </clipPath>
              </defs>
            </svg>
            <div className="text-xs mt-1">Join channel</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3">
      <div className="p-8 flex flex-col items-center">
        {!!pfpUrl && (
          <div className="relative mb-1">
            <div className="flex object-cover rounded-full">
              <Image src={pfpUrl} className="rounded-full" alt="avatar" width="112" height="112" />
            </div>
            <div className="absolute right-0 bottom-0 flex items-center justify-center bg-[#F7F7F7] border border-[#F5F3F4] rounded-full h-[36px] w-[36px]">
              <Image src={Flag} width={14.772} height={19.286} alt="yoink flag" />
            </div>
          </div>
        )}
        <div className="flex text-2xl font-black text-[#BA181B] uppercase mb-1">Yoink!</div>
        <div className="mb-1 font-bold text-sm text-center">
          {lastYoinkedBy} has the flag
        </div>
        <div className="text-xs">
          The flag has been yoinked <span className="text-[#BA181B]">{totalYoinks} times</span>
        </div>
      </div>
    </div>
  );
}


