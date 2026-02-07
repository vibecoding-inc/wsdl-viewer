/**
 * Utility functions for WSDL viewer formatting and navigation
 */
import type { WsdlTypeField } from '$lib/types';

/**
 * Format field name with attribute prefix
 */
export function formatFieldPrefix(field: WsdlTypeField): string {
	return field.isAttribute ? `@${field.name}` : field.name;
}

/**
 * Format field suffix showing optional/array indicators
 */
export function formatFieldSuffix(field: WsdlTypeField): string {
	let result = '';
	if (field.isOptional) {
		result += ' (optional)';
	}
	if (field.maxOccurs === 'unbounded' || Number(field.maxOccurs) > 1) {
		result += '[]';
	}
	return result;
}

/**
 * Get badge color based on type kind
 */
export function getTypeKindColor(kind: string): 'blue' | 'green' | 'purple' {
	switch (kind) {
		case 'complexType':
			return 'blue';
		case 'simpleType':
			return 'green';
		case 'element':
			return 'purple';
		default:
			return 'blue';
	}
}

/**
 * Strip namespace prefix from a qualified name
 */
export function stripPrefix(name: string): string {
	const idx = name.indexOf(':');
	return idx >= 0 ? name.substring(idx + 1) : name;
}
