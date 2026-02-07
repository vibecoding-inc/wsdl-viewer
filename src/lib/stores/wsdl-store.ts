/**
 * WSDL Store - Global state management for parsed WSDL documents
 */
import { writable, derived, get, type Readable, type Writable } from 'svelte/store';
import type {
	WsdlDocument,
	WsdlService,
	WsdlOperation,
	WsdlOperationMessage,
	WsdlType,
	WsdlMessage,
	ParseResult
} from '$lib/wsdl-parser';
import { parseWsdl, getAllOperations } from '$lib/wsdl-parser';

// ============= Store Types =============

export interface WsdlStoreState {
	isLoading: boolean;
	hasDocument: boolean;
	document: WsdlDocument | null;
	errors: string[];
	warnings: string[];
	rawXml: string;
}

// ============= Main Store =============

function createWsdlStore() {
	const initialState: WsdlStoreState = {
		isLoading: false,
		hasDocument: false,
		document: null,
		errors: [],
		warnings: [],
		rawXml: ''
	};

	const { subscribe, set, update } = writable<WsdlStoreState>(initialState);

	return {
		subscribe,

		/**
		 * Parse WSDL from XML string
		 */
		parseXml(xmlString: string): ParseResult {
			update(state => ({ ...state, isLoading: true, errors: [], warnings: [] }));

			const result = parseWsdl(xmlString);

			if (result.success && result.document) {
				set({
					isLoading: false,
					hasDocument: true,
					document: result.document,
					errors: result.errors,
					warnings: result.warnings,
					rawXml: xmlString
				});
			} else {
				set({
					isLoading: false,
					hasDocument: false,
					document: null,
					errors: result.errors,
					warnings: result.warnings,
					rawXml: xmlString
				});
			}

			return result;
		},

		/**
		 * Load WSDL from URL
		 */
		async loadFromUrl(url: string): Promise<ParseResult> {
			update(state => ({ ...state, isLoading: true, errors: [], warnings: [] }));

			try {
				const response = await fetch(url);
				
				if (!response.ok) {
					const errorMsg = `Failed to fetch WSDL: ${response.status} ${response.statusText}`;
					set({
						isLoading: false,
						hasDocument: false,
						document: null,
						errors: [errorMsg],
						warnings: [],
						rawXml: ''
					});
					return { success: false, errors: [errorMsg], warnings: [] };
				}

				const xmlString = await response.text();
				return this.parseXml(xmlString);
			} catch (error) {
				const errorMsg = `Network error: ${error instanceof Error ? error.message : String(error)}`;
				set({
					isLoading: false,
					hasDocument: false,
					document: null,
					errors: [errorMsg],
					warnings: [],
					rawXml: ''
				});
				return { success: false, errors: [errorMsg], warnings: [] };
			}
		},

		/**
		 * Load WSDL from file
		 */
		async loadFromFile(file: File): Promise<ParseResult> {
			update(state => ({ ...state, isLoading: true, errors: [], warnings: [] }));

			return new Promise((resolve) => {
				const reader = new FileReader();
				
				reader.onload = (e) => {
					const result = e.target?.result;
					if (typeof result === 'string') {
						const parseResult = this.parseXml(result);
						resolve(parseResult);
					} else {
						const errorMsg = 'Failed to read file as text';
						set({
							isLoading: false,
							hasDocument: false,
							document: null,
							errors: [errorMsg],
							warnings: [],
							rawXml: ''
						});
						resolve({ success: false, errors: [errorMsg], warnings: [] });
					}
				};

				reader.onerror = () => {
					const errorMsg = `Error reading file: ${reader.error?.message || 'Unknown error'}`;
					set({
						isLoading: false,
						hasDocument: false,
						document: null,
						errors: [errorMsg],
						warnings: [],
						rawXml: ''
					});
					resolve({ success: false, errors: [errorMsg], warnings: [] });
				};

				reader.readAsText(file);
			});
		},

		/**
		 * Clear the current document
		 */
		clear() {
			set(initialState);
		},

		/**
		 * Reset the store to initial state
		 */
		reset() {
			set(initialState);
		}
	};
}

// ============= Export Store Instance =============

export const wsdlStore = createWsdlStore();

// ============= Active Tab Store =============

/**
 * Store for the currently active tab in the viewer
 */
export const activeTab: Writable<number> = writable(0);

/**
 * Navigate to a specific tab and scroll to an element
 */
export function navigateTo(tabIndex: number, elementId?: string) {
	activeTab.set(tabIndex);
	if (elementId) {
		// Wait for tab content to render before scrolling
		requestAnimationFrame(() => {
			setTimeout(() => {
				const el = document.getElementById(elementId);
				if (el) {
					el.scrollIntoView({ behavior: 'smooth', block: 'start' });
					el.classList.add('ring-2', 'ring-blue-400');
					setTimeout(() => el.classList.remove('ring-2', 'ring-blue-400'), 2000);
				}
			}, 50);
		});
	}
}

// ============= Derived Stores =============

/**
 * Derived store for services
 */
export const services: Readable<WsdlService[]> = derived(
	wsdlStore,
	$store => $store.document?.services || []
);

/**
 * Derived store for all operations (flattened from port types)
 */
export const operations: Readable<Array<{
	serviceName: string;
	portName: string;
	operationName: string;
	soapAction?: string;
	documentation?: string;
	input?: WsdlOperationMessage;
	output?: WsdlOperationMessage;
}>> = derived(
	wsdlStore,
	$store => {
		if (!$store.document) return [];
		
		const ops = getAllOperations($store.document);
		
		// Add documentation from portTypes
		return ops.map(op => {
			const portType = $store.document?.portTypes.find(pt => {
				return pt.operations.some(o => o.name === op.operationName);
			});
			const operation = portType?.operations.find(o => o.name === op.operationName);
			
			return {
				...op,
				documentation: operation?.documentation
			};
		});
	}
);

/**
 * Derived store for types
 */
export const types: Readable<WsdlType[]> = derived(
	wsdlStore,
	$store => $store.document?.types || []
);

/**
 * Derived store for messages
 */
export const messages: Readable<WsdlMessage[]> = derived(
	wsdlStore,
	$store => $store.document?.messages || []
);

/**
 * Derived store for loading state
 */
export const isLoading: Readable<boolean> = derived(
	wsdlStore,
	$store => $store.isLoading
);

/**
 * Derived store for errors
 */
export const errors: Readable<string[]> = derived(
	wsdlStore,
	$store => $store.errors
);

/**
 * Derived store for warnings  
 */
export const warnings: Readable<string[]> = derived(
	wsdlStore,
	$store => $store.warnings
);

/**
 * Derived store for checking if document is loaded
 */
export const hasDocument: Readable<boolean> = derived(
	wsdlStore,
	$store => $store.hasDocument
);

/**
 * Derived store for target namespace
 */
export const targetNamespace: Readable<string> = derived(
	wsdlStore,
	$store => $store.document?.targetNamespace || ''
);

/**
 * Derived store for raw XML
 */
export const rawXml: Readable<string> = derived(
	wsdlStore,
	$store => $store.rawXml
);

// ============= Helper Functions =============

/**
 * Get message by name from current document
 */
export function getMessageByName(messageName: string): WsdlMessage | undefined {
	const state = get(wsdlStore);
	return state.document?.messages.find(m => m.name === messageName);
}

/**
 * Get type by name from current document
 */
export function getTypeByName(typeName: string): WsdlType | undefined {
	const state = get(wsdlStore);
	return state.document?.types.find(t => t.name === typeName);
}
