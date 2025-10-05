"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface RequestServiceDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  service: any
}

export default function RequestServiceDialog({ isOpen, onOpenChange, service }: RequestServiceDialogProps) {
  if (!service) return null

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>طلب خدمة: {service.title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p>{service.description}</p>
          <p className="font-bold text-brand-blue">السعر: {service.price} ج.م</p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
