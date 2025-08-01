import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { AlertTriangle, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function LimitReachedModal({ isOpen, onClose }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[var(--background-secondary)] border-[var(--glass-border)] text-white">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-yellow-500/10 flex items-center justify-center border-2 border-yellow-500/30">
              <AlertTriangle className="w-8 h-8 text-yellow-400" />
            </div>
          </div>
          <DialogTitle className="text-center text-2xl font-bold">Watchlist Limit Reached</DialogTitle>
          <DialogDescription className="text-center text-gray-400 pt-2">
            You've reached the maximum number of wallets for your current plan. To monitor more wallets, please upgrade your plan or remove some from your watchlist.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col sm:flex-row gap-3 mt-4">
          <Button variant="outline" onClick={onClose} className="w-full">
            Manage Watchlist
          </Button>
          <Button asChild className="w-full bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-black font-bold">
            <Link to={createPageUrl("Pricing")}>
              <Star className="w-4 h-4 mr-2" />
              Upgrade Your Plan
            </Link>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}