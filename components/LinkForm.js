import { StorageContext } from "../pages/_app.js";
import Button from './Button.js';
import Input from './Input.js';
import TextButton from './TextButton.js';

import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';

import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    TouchSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Link field configuration
const LINK_CONFIG = {
    twitter: { label: "X", placeholder: "scav" },
    linkedin: { label: "LinkedIn", placeholder: "fairchildmattie" },
    github: { label: "GitHub", placeholder: "scaviefae" },
    telegram: { label: "Telegram", placeholder: "scav" },
    instagram: { label: "Instagram", placeholder: "scav" },
    venmo: { label: "Venmo", placeholder: "scav" },
    custom: { label: "Link", placeholder: "https://example.com" },
};

const DEFAULT_ORDER = ['twitter', 'linkedin', 'github', 'telegram', 'instagram', 'venmo', 'custom'];
const ORDER_STORAGE_KEY = 'linkOrder';

// Sortable input wrapper
function SortableInput({ id, label, placeholder, value, onChange }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div ref={setNodeRef} style={style} className="flex items-start gap-2 mb-4">
            <button
                type="button"
                className="mt-7 p-2 cursor-grab active:cursor-grabbing touch-none
                text-slate-400 hover:text-slate-600"
                {...attributes}
                {...listeners}
            >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <circle cx="4" cy="3" r="1.5" />
                    <circle cx="12" cy="3" r="1.5" />
                    <circle cx="4" cy="8" r="1.5" />
                    <circle cx="12" cy="8" r="1.5" />
                    <circle cx="4" cy="13" r="1.5" />
                    <circle cx="12" cy="13" r="1.5" />
                </svg>
            </button>
            <div className="flex-1">
                <Input
                    name={id}
                    label={label}
                    type="text"
                    value={value}
                    placeholder={placeholder}
                    onChange={onChange}
                />
            </div>
        </div>
    );
}

export default function LinkForm({ contactId, initialLinkValues }) {
    const router = useRouter();
    const { setContact, getContact } = useContext(StorageContext);

    const [formfield, setFormfield] = useState({
        twitter: "",
        linkedin: "",
        github: "",
        telegram: "",
        instagram: "",
        venmo: "",
        custom: ""
    });

    // Load order from localStorage or use default
    const [order, setOrder] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem(ORDER_STORAGE_KEY);
            if (saved) {
                try {
                    const parsed = JSON.parse(saved);
                    // Ensure all keys are present (in case we add new platforms)
                    const allKeys = new Set([...parsed, ...DEFAULT_ORDER]);
                    return [...allKeys].filter(k => DEFAULT_ORDER.includes(k));
                } catch {
                    return DEFAULT_ORDER;
                }
            }
        }
        return DEFAULT_ORDER;
    });

    // Sensors for mouse, touch, and keyboard
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 8 },
        }),
        useSensor(TouchSensor, {
            activationConstraint: { delay: 200, tolerance: 5 },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            setOrder((items) => {
                const oldIndex = items.indexOf(active.id);
                const newIndex = items.indexOf(over.id);
                const newOrder = arrayMove(items, oldIndex, newIndex);

                // Persist to localStorage
                localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(newOrder));
                return newOrder;
            });
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormfield(prevState => ({
            ...prevState,
            [name]: value,
        }));
    }

    // Get usernames from links
    const processDisplayName = (inputString) => {
        let current = inputString;
        const maxIterations = 10;

        for (let i = 0; i < maxIterations; i++) {
            const matchResult = current.match(/\/([^/?]+)(?:\?.*)?$/);
            if (matchResult) {
                current = matchResult[1];
            } else {
                break;
            }
        }

        const textBeforeQuery = current.split('?')[0];
        const textAfterAt = textBeforeQuery.replace(/^@/, '');
        return textAfterAt;
    }

    const handleSubmit = (event) => {
        event.preventDefault();

        if (contactId !== 'new' && !getContact(contactId)) {
            console.error('[LinkForm] Cannot save - invalid contact ID:', contactId);
            router.push('/');
            return;
        }

        const processedLinks = Object.fromEntries(
            Object.entries(formfield).map(([key, value]) => {
                if (key == "custom") {
                    return [key, value];
                } else {
                    return [key, processDisplayName(value)];
                }
            })
        );

        setContact(contactId, { linkValues: processedLinks });

        gtag("event", "form_submit", {
            "form_id": "linkForm",
            "form_name": "Link form",
            "destination": "/links"
        });

        router.push(`/preview?id=${contactId}`);
    }

    const cancel = () => {
        router.push(`/preview?id=${contactId}`);
    }

    useEffect(() => {
        if (initialLinkValues) {
            setFormfield({
                twitter: initialLinkValues.twitter || "",
                linkedin: initialLinkValues.linkedin || "",
                github: initialLinkValues.github || "",
                telegram: initialLinkValues.telegram || "",
                instagram: initialLinkValues.instagram || "",
                venmo: initialLinkValues.venmo || "",
                custom: initialLinkValues.custom || ""
            });
        }
    }, [initialLinkValues]);

    return (
        <form id="linkForm" name="Link form" className="w-full max-w-md flex flex-col px-2"
            onSubmit={handleSubmit}>
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext items={order} strategy={verticalListSortingStrategy}>
                    {order.map((key) => (
                        <SortableInput
                            key={key}
                            id={key}
                            label={LINK_CONFIG[key].label}
                            placeholder={LINK_CONFIG[key].placeholder}
                            value={formfield[key]}
                            onChange={handleChange}
                        />
                    ))}
                </SortableContext>
            </DndContext>
            <Button type="submit" className="self-center my-4 shadow-none">Save links</Button>
            <TextButton onClick={cancel} className="self-center">Cancel</TextButton>
        </form>
    );
}
