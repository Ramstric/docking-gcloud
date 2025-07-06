import {useState, useCallback} from 'react';

import {useInput} from 'ink';

interface NavigationOptions {
	items: any[];
	initialIndex?: number;
	onSelect?: (item: any, index: number) => void;
	loop?: boolean;
	disabled?: boolean;
}

interface NavigationState<T> {
	selectedItem: T | null;
	selectedIndex: number;
	setSelectedIndex: (index: number) => void;
	setSelectedItem: (item: T) => void;
}

export function useNavigation<T>({ items, initialIndex = 0, onSelect, loop = true, disabled = false }: NavigationOptions): NavigationState<T> {
	const [selectedIndex, setSelectedIndex] = useState<number>( Math.max(0, Math.min(initialIndex, items.length - 1)) );

	const selectedItem = items[selectedIndex] || null;

	const handleSetSelectedIndex = useCallback(
		(index: number) => {
			const clampedIndex = Math.max(0, Math.min(index, items.length - 1));
			setSelectedIndex(clampedIndex);
		}, [items.length],
	);

	const handleSetSelectedItem = useCallback(
		(item: T) => {
			const index = items.findIndex(i => i === item);
			if (index !== -1) {
				setSelectedIndex(index);
			}
		}, [items],
	);

	useInput(
		(_input, key) => {
			if (items.length === 0) return;

			if (key.upArrow) {
				const newIndex = loop
					? (selectedIndex - 1 + items.length) % items.length
					: Math.max(0, selectedIndex - 1);

				setSelectedIndex(newIndex);
			} else if (key.downArrow) {
				const newIndex = loop
					? (selectedIndex + 1) % items.length
					: Math.min(items.length - 1, selectedIndex + 1);

				setSelectedIndex(newIndex);
			} else if (key.return && onSelect) {
				onSelect(selectedItem, selectedIndex);
			}
		}, {isActive: !disabled},
	);

	return {
		selectedItem,
		selectedIndex,
		setSelectedIndex: handleSetSelectedIndex,
		setSelectedItem: handleSetSelectedItem,
	};
}
