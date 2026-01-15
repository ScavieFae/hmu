import '../styles/reset.css';
import '../dist/main.css';
import Analytics from '../components/Analytics';

import { createContext, useEffect, useState } from 'react';
import { safeGetItem, safeSetItem, STORAGE_KEYS } from '../utils/storage.js';
import { migrateFromSecureStorage } from '../utils/migration.js';

/**
 * Load data from plain localStorage.
 *
 * WHY: Replaced react-secure-storage with plain localStorage because encryption
 * using browser fingerprints caused data loss on Android when fingerprints changed.
 */
const loadLocalStorageData = (item) => {
    if (typeof window !== 'undefined') {
        const data = safeGetItem(item);
        console.log(`[App] Loaded ${item}:`, data);
        return data || "";
    }
    return "";
}

export const StorageContext = createContext(null);

function MyApp({ Component, pageProps }) {

    const [loading, setLoading] = useState(true);
    const [formValues, _setFormValues] = useState(null);
    const [linkValues, _setLinkValues] = useState(null);
    const [storageError, setStorageError] = useState(false);

    // Custom setter: storage and state with error handling
    // WHY: Surface write failures to user so they know data isn't being saved
    const setFormValues = (value) => {
        const success = safeSetItem(STORAGE_KEYS.FORM_VALUES, value);
        if (!success) {
            setStorageError(true);
            // Auto-dismiss after 10 seconds
            setTimeout(() => setStorageError(false), 10000);
        }
        _setFormValues(value);
    }

    // Custom setter: storage and state with error handling
    const setLinkValues = (value) => {
        const success = safeSetItem(STORAGE_KEYS.LINK_VALUES, value);
        if (!success) {
            setStorageError(true);
            // Auto-dismiss after 10 seconds
            setTimeout(() => setStorageError(false), 10000);
        }
        _setLinkValues(value);
    }

    // Load storage and set state once on mount
    useEffect(() => {
        // Run migration first - attempts to move data from react-secure-storage
        // to plain localStorage. Safe to run multiple times (idempotent).
        migrateFromSecureStorage();

        // Load data from plain localStorage
        _setFormValues(loadLocalStorageData(STORAGE_KEYS.FORM_VALUES));
        _setLinkValues(loadLocalStorageData(STORAGE_KEYS.LINK_VALUES));

        // Request persistent storage to reduce eviction risk on Android
        if (navigator.storage?.persist) {
            navigator.storage.persist().then(granted => {
                console.log(`[Storage] Persistence ${granted ? 'granted' : 'denied'}`);
            });
        }

        // Log storage quota and usage for diagnostics (helps debug future issues)
        if (navigator.storage?.estimate) {
            navigator.storage.estimate().then(estimate => {
                const usedMB = (estimate.usage / 1024 / 1024).toFixed(2);
                const quotaMB = (estimate.quota / 1024 / 1024).toFixed(2);
                const percentUsed = ((estimate.usage / estimate.quota) * 100).toFixed(1);
                console.log(`[Storage] Quota: ${quotaMB}MB, Used: ${usedMB}MB (${percentUsed}%)`);
            });
        }
    }, [])

    useEffect(() => {
        if (formValues !== null) {
            setLoading(false);
        }
    }, [formValues]);

    return (
        loading ? null :
            <StorageContext.Provider value={{ formValues, setFormValues, linkValues, setLinkValues, storageError, setStorageError }} >
                <Analytics />
                {storageError && (
                    <div style={{
                        position: 'fixed',
                        top: '16px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        backgroundColor: '#EF4444',
                        color: 'white',
                        padding: '12px 20px',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                        zIndex: 9999,
                        maxWidth: '90%',
                        textAlign: 'center',
                        fontSize: '14px',
                        fontWeight: '500'
                    }}>
                        Unable to save your data. Check browser storage settings.
                        <button
                            onClick={() => setStorageError(false)}
                            style={{
                                marginLeft: '12px',
                                background: 'rgba(255, 255, 255, 0.2)',
                                border: 'none',
                                color: 'white',
                                padding: '4px 8px',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '12px'
                            }}
                        >
                            Dismiss
                        </button>
                    </div>
                )}
                <Component {...pageProps} />
            </StorageContext.Provider>
    )
}

export default MyApp;
