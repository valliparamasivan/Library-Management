"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY_RFID = "scanner:rfid:device";
const STORAGE_KEY_BOOK = "scanner:book:device";

const deviceKey = (device) =>
  `${device.vendorId}:${device.productId}:${device.productName || ""}`;

const findStoredDevice = async (storedKey) => {
  if (typeof navigator === "undefined" || !navigator.hid || !storedKey) return null;
  const devices = await navigator.hid.getDevices();
  return devices.find((d) => deviceKey(d) === storedKey) || null;
};

/**
 * Tracks whether the RFID reader and book scanner are physically connected via WebHID.
 *
 * The librarian pairs each device once (browser permission prompt). The chosen device
 * key is persisted in localStorage. After that, this hook reports live connect/disconnect
 * status by listening to navigator.hid events.
 *
 * `supported` is false in browsers without WebHID (e.g. Firefox, Safari) — in that case
 * status cannot be determined and both flags stay null.
 */
export const useScannerStatus = () => {
  const [supported, setSupported] = useState(true);
  const [isRfidScannerConnected, setIsRfidScannerConnected] = useState(null);
  const [isBookScannerConnected, setIsBookScannerConnected] = useState(null);

  const refresh = useCallback(async () => {
    if (typeof navigator === "undefined" || !navigator.hid) return;
    const rfidKey = localStorage.getItem(STORAGE_KEY_RFID);
    const bookKey = localStorage.getItem(STORAGE_KEY_BOOK);
    const [rfidDevice, bookDevice] = await Promise.all([
      findStoredDevice(rfidKey),
      findStoredDevice(bookKey),
    ]);
    setIsRfidScannerConnected(rfidKey ? !!rfidDevice : false);
    setIsBookScannerConnected(bookKey ? !!bookDevice : false);
  }, []);

  useEffect(() => {
    if (typeof navigator === "undefined" || !navigator.hid) {
      setSupported(false);
      setIsRfidScannerConnected(null);
      setIsBookScannerConnected(null);
      return;
    }

    refresh();

    const handleConnect = () => refresh();
    const handleDisconnect = () => refresh();
    navigator.hid.addEventListener("connect", handleConnect);
    navigator.hid.addEventListener("disconnect", handleDisconnect);
    return () => {
      navigator.hid.removeEventListener("connect", handleConnect);
      navigator.hid.removeEventListener("disconnect", handleDisconnect);
    };
  }, [refresh]);

  const pair = useCallback(
    async (storageKey, setter) => {
      if (typeof navigator === "undefined" || !navigator.hid) return false;
      try {
        const devices = await navigator.hid.requestDevice({ filters: [] });
        if (devices && devices.length > 0) {
          localStorage.setItem(storageKey, deviceKey(devices[0]));
          setter(true);
          return true;
        }
      } catch {
        // user dismissed the chooser
      }
      return false;
    },
    [],
  );

  const pairRfidScanner = useCallback(
    () => pair(STORAGE_KEY_RFID, setIsRfidScannerConnected),
    [pair],
  );
  const pairBookScanner = useCallback(
    () => pair(STORAGE_KEY_BOOK, setIsBookScannerConnected),
    [pair],
  );

  return {
    supported,
    isRfidScannerConnected,
    isBookScannerConnected,
    pairRfidScanner,
    pairBookScanner,
    refresh,
  };
};

export default useScannerStatus;
