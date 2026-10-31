'use client';

import { useEffect } from 'react';
import { useCatalog } from '@/store/catalogStore';
import { useCustomerStore } from '@/store/customerStore';
import { useSettingsStore } from '@/store/settingsStore';

export function RemoteSync() {
  useEffect(() => {
    void useSettingsStore.getState().syncFromRemote();
    void useCatalog.getState().load();
    void useCustomerStore.getState().init();
  }, []);
  return null;
}
