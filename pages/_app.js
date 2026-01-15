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
    // Custom setter: storage and state
    const setFormValues = (value) => {
        safeSetItem(STORAGE_KEYS.FORM_VALUES, value);
        _setFormValues(value);
    }

    const [linkValues, _setLinkValues] = useState(null);
    // Custom setter: storage and state
    const setLinkValues = (value) => {
        safeSetItem(STORAGE_KEYS.LINK_VALUES, value);
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
    }, [])

    useEffect(() => {
        if (formValues !== null) {
            setLoading(false);
        }
    }, [formValues]);

    return (
        loading ? null :
            <StorageContext.Provider value={{ formValues, setFormValues, linkValues, setLinkValues }} >
                <Analytics />
                <Component {...pageProps} />
            </StorageContext.Provider>
    )
}

export default MyApp;
