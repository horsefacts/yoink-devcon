import React from "react";

export function ActionButtonContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="fixed bottom-0 left-0 right-0 max-w-screen-sm mx-auto p-3 bg-[#FDF6F5]">
      {children}
    </div>
  );
}
