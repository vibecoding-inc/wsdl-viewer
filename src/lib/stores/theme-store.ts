/**
 * Theme Store - Manages color scheme selection and persistence
 */
import { writable, derived } from 'svelte/store';

// ============= Theme Types =============

export interface ThemeColors {
	/** Page background */
	base: string;
	/** Slightly lighter background (cards, surfaces) */
	surface0: string;
	/** Border / subtle separator */
	surface1: string;
	/** Hover / active surface */
	surface2: string;
	/** Muted/disabled text */
	subtext: string;
	/** Primary text */
	text: string;
	/** Primary accent */
	accent: string;
	/** Lighter accent (hover) */
	accentLight: string;
	/** Links */
	link: string;
	/** Success/green */
	green: string;
	/** Warning/yellow */
	yellow: string;
	/** Error/red */
	red: string;
	/** Purple accent */
	purple: string;
}

export interface Theme {
	id: string;
	name: string;
	isDark: boolean;
	colors: ThemeColors;
}

// ============= Theme Definitions =============

export const themes: Theme[] = [
	{
		id: 'catppuccin-mocha',
		name: 'Catppuccin Mocha',
		isDark: true,
		colors: {
			base: '#1e1e2e',
			surface0: '#313244',
			surface1: '#45475a',
			surface2: '#585b70',
			subtext: '#a6adc8',
			text: '#cdd6f4',
			accent: '#89b4fa',
			accentLight: '#b4d0fb',
			link: '#89dceb',
			green: '#a6e3a1',
			yellow: '#f9e2af',
			red: '#f38ba8',
			purple: '#cba6f7'
		}
	},
	{
		id: 'catppuccin-latte',
		name: 'Catppuccin Latte',
		isDark: false,
		colors: {
			base: '#eff1f5',
			surface0: '#ccd0da',
			surface1: '#bcc0cc',
			surface2: '#acb0be',
			subtext: '#6c6f85',
			text: '#4c4f69',
			accent: '#1e66f5',
			accentLight: '#7287fd',
			link: '#179299',
			green: '#40a02b',
			yellow: '#df8e1d',
			red: '#d20f39',
			purple: '#8839ef'
		}
	},
	{
		id: 'catppuccin-frappe',
		name: 'Catppuccin Frappé',
		isDark: true,
		colors: {
			base: '#303446',
			surface0: '#414559',
			surface1: '#51576d',
			surface2: '#626880',
			subtext: '#a5adce',
			text: '#c6d0f5',
			accent: '#8caaee',
			accentLight: '#babbf1',
			link: '#99d1db',
			green: '#a6d189',
			yellow: '#e5c890',
			red: '#e78284',
			purple: '#ca9ee6'
		}
	},
	{
		id: 'catppuccin-macchiato',
		name: 'Catppuccin Macchiato',
		isDark: true,
		colors: {
			base: '#24273a',
			surface0: '#363a4f',
			surface1: '#494d64',
			surface2: '#5b6078',
			subtext: '#a5adcb',
			text: '#cad3f5',
			accent: '#8aadf4',
			accentLight: '#b7bdf8',
			link: '#91d7e3',
			green: '#a6da95',
			yellow: '#eed49f',
			red: '#ed8796',
			purple: '#c6a0f6'
		}
	},
	{
		id: 'nord',
		name: 'Nord',
		isDark: true,
		colors: {
			base: '#2e3440',
			surface0: '#3b4252',
			surface1: '#434c5e',
			surface2: '#4c566a',
			subtext: '#d8dee9',
			text: '#eceff4',
			accent: '#88c0d0',
			accentLight: '#8fbcbb',
			link: '#81a1c1',
			green: '#a3be8c',
			yellow: '#ebcb8b',
			red: '#bf616a',
			purple: '#b48ead'
		}
	},
	{
		id: 'dracula',
		name: 'Dracula',
		isDark: true,
		colors: {
			base: '#282a36',
			surface0: '#44475a',
			surface1: '#6272a4',
			surface2: '#7082b4',
			subtext: '#bfbfbf',
			text: '#f8f8f2',
			accent: '#bd93f9',
			accentLight: '#d6bcfa',
			link: '#8be9fd',
			green: '#50fa7b',
			yellow: '#f1fa8c',
			red: '#ff5555',
			purple: '#ff79c6'
		}
	},
	{
		id: 'solarized-dark',
		name: 'Solarized Dark',
		isDark: true,
		colors: {
			base: '#002b36',
			surface0: '#073642',
			surface1: '#586e75',
			surface2: '#657b83',
			subtext: '#839496',
			text: '#fdf6e3',
			accent: '#268bd2',
			accentLight: '#2aa198',
			link: '#2aa198',
			green: '#859900',
			yellow: '#b58900',
			red: '#dc322f',
			purple: '#6c71c4'
		}
	},
	{
		id: 'solarized-light',
		name: 'Solarized Light',
		isDark: false,
		colors: {
			base: '#fdf6e3',
			surface0: '#eee8d5',
			surface1: '#93a1a1',
			surface2: '#839496',
			subtext: '#657b83',
			text: '#073642',
			accent: '#268bd2',
			accentLight: '#2aa198',
			link: '#2aa198',
			green: '#859900',
			yellow: '#b58900',
			red: '#dc322f',
			purple: '#6c71c4'
		}
	},
	{
		id: 'default-light',
		name: 'Default Light',
		isDark: false,
		colors: {
			base: '#f9fafb',
			surface0: '#ffffff',
			surface1: '#e5e7eb',
			surface2: '#d1d5db',
			subtext: '#6b7280',
			text: '#111827',
			accent: '#3b82f6',
			accentLight: '#60a5fa',
			link: '#2563eb',
			green: '#16a34a',
			yellow: '#ca8a04',
			red: '#dc2626',
			purple: '#9333ea'
		}
	},
	{
		id: 'default-dark',
		name: 'Default Dark',
		isDark: true,
		colors: {
			base: '#111827',
			surface0: '#1f2937',
			surface1: '#374151',
			surface2: '#4b5563',
			subtext: '#9ca3af',
			text: '#f9fafb',
			accent: '#3b82f6',
			accentLight: '#60a5fa',
			link: '#60a5fa',
			green: '#22c55e',
			yellow: '#eab308',
			red: '#ef4444',
			purple: '#a855f7'
		}
	}
];

// ============= Store =============

const STORAGE_KEY = 'wsdl-viewer-theme';

function getInitialThemeId(): string {
	if (typeof window !== 'undefined') {
		const saved = localStorage.getItem(STORAGE_KEY);
		if (saved && themes.some(t => t.id === saved)) {
			return saved;
		}
	}
	return 'catppuccin-mocha';
}

export const currentThemeId = writable<string>(getInitialThemeId());

export const currentTheme = derived(currentThemeId, ($id) => {
	return themes.find(t => t.id === $id) ?? themes[0];
});

/**
 * Apply theme CSS custom properties and dark mode class to the document
 */
export function applyTheme(theme: Theme): void {
	if (typeof document === 'undefined') return;

	const root = document.documentElement;

	// Set CSS custom properties
	root.style.setProperty('--theme-base', theme.colors.base);
	root.style.setProperty('--theme-surface0', theme.colors.surface0);
	root.style.setProperty('--theme-surface1', theme.colors.surface1);
	root.style.setProperty('--theme-surface2', theme.colors.surface2);
	root.style.setProperty('--theme-subtext', theme.colors.subtext);
	root.style.setProperty('--theme-text', theme.colors.text);
	root.style.setProperty('--theme-accent', theme.colors.accent);
	root.style.setProperty('--theme-accent-light', theme.colors.accentLight);
	root.style.setProperty('--theme-link', theme.colors.link);
	root.style.setProperty('--theme-green', theme.colors.green);
	root.style.setProperty('--theme-yellow', theme.colors.yellow);
	root.style.setProperty('--theme-red', theme.colors.red);
	root.style.setProperty('--theme-purple', theme.colors.purple);

	// Toggle dark class for flowbite/tailwind
	if (theme.isDark) {
		root.classList.add('dark');
	} else {
		root.classList.remove('dark');
	}
}

/**
 * Set a new theme by ID, persist to localStorage, and apply it
 */
export function setTheme(themeId: string): void {
	const theme = themes.find(t => t.id === themeId);
	if (!theme) return;

	currentThemeId.set(themeId);

	if (typeof localStorage !== 'undefined') {
		localStorage.setItem(STORAGE_KEY, themeId);
	}

	applyTheme(theme);
}

/**
 * Initialize theme on mount - call this from layout
 */
export function initTheme(): void {
	const id = getInitialThemeId();
	const theme = themes.find(t => t.id === id) ?? themes[0];
	currentThemeId.set(theme.id);
	applyTheme(theme);
}
