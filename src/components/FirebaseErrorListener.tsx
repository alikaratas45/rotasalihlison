// IMPORTANT: This file is a work in progress and should not be used in production.
'use client';

import { useEffect } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { useToast } from '@/hooks/use-toast';

export function FirebaseErrorListener() {
  const { toast } = useToast();
  useEffect(() => {
    const handlePermissionError = (error: FirestorePermissionError) => {
      console.error(error.message); // log to console for dev
      toast({
        title: 'Permission Denied',
        description:
          'You do not have permission to perform this action. Check the console for details.',
        variant: 'destructive',
      });
      // This will be caught by the Next.js error overlay
      throw error;
    };

    errorEmitter.on('permission-error', handlePermissionError);

    return () => {
      errorEmitter.removeListener('permission-error', handlePermissionError);
    };
  }, [toast]);

  return null;
}
