import React from "react";

export function ActionButtonContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="fixed bottom-0 left-0 right-0 max-w-screen-sm mx-auto h-[100px] p-4 pb-6 bg-[#FDF6F5] border-t border-[#DBDBDB] z-20">
      {children}
    </div>
  );
}
