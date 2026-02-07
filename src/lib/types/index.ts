/**
 * Shared type definitions re-exported from the WSDL parser and store modules.
 * Import types from this module for convenience.
 */
export type {
	WsdlDocument,
	WsdlService,
	WsdlPort,
	WsdlPortType,
	WsdlOperation,
	WsdlOperationMessage,
	WsdlBinding,
	WsdlBindingOperation,
	WsdlBindingHeader,
	WsdlMessage,
	WsdlMessagePart,
	WsdlType,
	WsdlTypeField,
	WsdlRestriction,
	WsdlImport,
	ParseResult
} from '$lib/wsdl-parser';

export type {
	WsdlStoreState,
	MessageReverseRef,
	TypeReverseRef
} from '$lib/stores/wsdl-store';
