import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Trash2 } from 'lucide-react';
import { useLocale } from '@/hooks/use-locale';

interface DeleteConfirmDialogProps {
  onConfirm: () => void;
  disabled?: boolean;
}

export default function DeleteConfirmDialog({ onConfirm, disabled }: DeleteConfirmDialogProps) {
  const { t } = useLocale();
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button disabled={disabled} className="text-muted-foreground hover:text-destructive transition-colors disabled:opacity-50">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-background border-border">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-mono text-sm">{t('deleteConfirmTitle') || 'Delete this slice?'}</AlertDialogTitle>
          <AlertDialogDescription className="font-mono text-xs text-muted-foreground">
            {t('deleteConfirmDesc') || 'This action cannot be undone. The slice will be permanently removed from your vault.'}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="font-mono text-xs">{t('cancel') || 'Cancel'}</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className="font-mono text-xs bg-destructive text-destructive-foreground hover:bg-destructive/90">
            {t('deleted') || 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
