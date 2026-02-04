import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      position="bottom-right"
      richColors
      closeButton
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-white group-[.toaster]:text-gray-950 group-[.toaster]:border-gray-200 group-[.toaster]:shadow-lg group-[.toaster]:rounded-xl",
          description: "group-[.toast]:text-gray-500",
          actionButton:
            "group-[.toast]:bg-gray-900 group-[.toast]:text-gray-50",
          cancelButton:
            "group-[.toast]:bg-gray-100 group-[.toast]:text-gray-500",
          success: "group-[.toast]:border-brand-green group-[.toast]:bg-green-50",
          error: "group-[.toast]:border-red-200 group-[.toast]:bg-red-50",
          info: "group-[.toast]:border-blue-200 group-[.toast]:bg-blue-50",
          warning: "group-[.toast]:border-yellow-200 group-[.toast]:bg-yellow-50",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };

