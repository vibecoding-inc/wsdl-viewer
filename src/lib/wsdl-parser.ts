/**
 * WSDL Parser - A comprehensive parser for Web Services Description Language (WSDL) documents
 * Full support for WSDL 1.1 with basic WSDL 2.0 element recognition
 */

// ============= Type Definitions =============

export interface WsdlDocument {
	targetNamespace: string;
	services: WsdlService[];
	portTypes: WsdlPortType[];
	bindings: WsdlBinding[];
	messages: WsdlMessage[];
	types: WsdlType[];
	imports: WsdlImport[];
	documentation: string;
	rawXml: string;
}

export interface WsdlService {
	name: string;
	documentation: string;
	ports: WsdlPort[];
}

export interface WsdlPort {
	name: string;
	binding: string;
	address: string;
	protocol: string;
}

export interface WsdlPortType {
	name: string;
	documentation: string;
	operations: WsdlOperation[];
}

export interface WsdlOperation {
	name: string;
	documentation: string;
	input?: WsdlOperationMessage;
	output?: WsdlOperationMessage;
	faults: WsdlOperationMessage[];
	soapAction?: string;
	style?: string;
}

export interface WsdlOperationMessage {
	name: string;
	message: string;
	parts: WsdlMessagePart[];
}

export interface WsdlBinding {
	name: string;
	type: string;
	protocol: string;
	style: string;
	transport: string;
	operations: WsdlBindingOperation[];
}

export interface WsdlBindingOperation {
	name: string;
	soapAction: string;
	style: string;
	input?: {
		body?: { use: string; namespace?: string };
		headers: WsdlBindingHeader[];
	};
	output?: {
		body?: { use: string; namespace?: string };
		headers: WsdlBindingHeader[];
	};
}

export interface WsdlBindingHeader {
	message: string;
	part: string;
	use: string;
}

export interface WsdlMessage {
	name: string;
	documentation: string;
	parts: WsdlMessagePart[];
}

export interface WsdlMessagePart {
	name: string;
	type?: string;
	element?: string;
}

export interface WsdlType {
	name: string;
	kind: 'complexType' | 'simpleType' | 'element';
	documentation: string;
	namespace?: string;
	base?: string;
	fields: WsdlTypeField[];
	restrictions?: WsdlRestriction;
	isArray?: boolean;
}

export interface WsdlTypeField {
	name: string;
	type: string;
	minOccurs: number;
	maxOccurs: string | number;
	documentation: string;
	isAttribute: boolean;
	isOptional: boolean;
}

export interface WsdlRestriction {
	base: string;
	enumeration?: string[];
	minLength?: number;
	maxLength?: number;
	pattern?: string;
	minInclusive?: string;
	maxInclusive?: string;
	minExclusive?: string;
	maxExclusive?: string;
}

export interface WsdlImport {
	namespace: string;
	location: string;
}

export interface ParseResult {
	success: boolean;
	document?: WsdlDocument;
	errors: string[];
	warnings: string[];
}

// ============= Namespace Constants =============

const WSDL_NS = {
	WSDL_1_1: 'http://schemas.xmlsoap.org/wsdl/',
	WSDL_2_0: 'http://www.w3.org/ns/wsdl',
	SOAP_1_1: 'http://schemas.xmlsoap.org/wsdl/soap/',
	SOAP_1_2: 'http://schemas.xmlsoap.org/wsdl/soap12/',
	XSD: 'http://www.w3.org/2001/XMLSchema',
	HTTP: 'http://schemas.xmlsoap.org/wsdl/http/'
};

// ============= Parser Class =============

export class WsdlParser {
	private doc: Document | null = null;
	private errors: string[] = [];
	private warnings: string[] = [];
	private namespaces: Map<string, string> = new Map();

	/**
	 * Parse WSDL XML string into a structured document
	 */
	parse(xmlString: string): ParseResult {
		this.errors = [];
		this.warnings = [];
		this.namespaces.clear();

		try {
			// Parse XML
			const parser = new DOMParser();
			this.doc = parser.parseFromString(xmlString, 'text/xml');

			// Check for parse errors
			const parseError = this.doc.querySelector('parsererror');
			if (parseError) {
				this.errors.push(`XML Parse Error: ${parseError.textContent}`);
				return { success: false, errors: this.errors, warnings: this.warnings };
			}

			// Validate root element
			const root = this.doc.documentElement;
			if (!root) {
				this.errors.push('No root element found in document');
				return { success: false, errors: this.errors, warnings: this.warnings };
			}

			// Check if it's a valid WSDL document
			const rootLocalName = root.localName;
			if (rootLocalName !== 'definitions' && rootLocalName !== 'description') {
				this.errors.push(
					`Invalid WSDL document: root element is "${rootLocalName}", expected "definitions" or "description"`
				);
				return { success: false, errors: this.errors, warnings: this.warnings };
			}

			// Extract namespaces
			this.extractNamespaces(root);

			// Parse the document
			const document = this.parseDocument(root, xmlString);

			return {
				success: true,
				document,
				errors: this.errors,
				warnings: this.warnings
			};
		} catch (error) {
			this.errors.push(`Unexpected error: ${error instanceof Error ? error.message : String(error)}`);
			return { success: false, errors: this.errors, warnings: this.warnings };
		}
	}

	/**
	 * Extract all namespace declarations from the root element
	 */
	private extractNamespaces(root: Element): void {
		const attrs = root.attributes;
		for (let i = 0; i < attrs.length; i++) {
			const attr = attrs[i];
			if (attr.name.startsWith('xmlns:')) {
				const prefix = attr.name.substring(6);
				this.namespaces.set(prefix, attr.value);
			} else if (attr.name === 'xmlns') {
				this.namespaces.set('', attr.value);
			}
		}
	}

	/**
	 * Get namespace prefix for a given namespace URI
	 */
	private getNamespacePrefix(uri: string): string | undefined {
		for (const [prefix, ns] of this.namespaces) {
			if (ns === uri) {
				return prefix;
			}
		}
		return undefined;
	}

	/**
	 * Resolve a QName to its local and namespace parts
	 */
	private resolveQName(qname: string): { localName: string; namespace?: string } {
		const colonIndex = qname.indexOf(':');
		if (colonIndex === -1) {
			return { localName: qname };
		}
		const prefix = qname.substring(0, colonIndex);
		const localName = qname.substring(colonIndex + 1);
		const namespace = this.namespaces.get(prefix);
		return { localName, namespace };
	}

	/**
	 * Parse the entire WSDL document
	 */
	private parseDocument(root: Element, rawXml: string): WsdlDocument {
		const targetNamespace = root.getAttribute('targetNamespace') || '';

		return {
			targetNamespace,
			services: this.parseServices(root),
			portTypes: this.parsePortTypes(root),
			bindings: this.parseBindings(root),
			messages: this.parseMessages(root),
			types: this.parseTypes(root),
			imports: this.parseImports(root),
			documentation: this.getDocumentation(root),
			rawXml
		};
	}

	/**
	 * Get child elements by local name, ignoring namespace
	 */
	private getChildElementsByLocalName(parent: Element, localName: string): Element[] {
		const children: Element[] = [];
		for (let i = 0; i < parent.children.length; i++) {
			const child = parent.children[i];
			if (child.localName === localName) {
				children.push(child);
			}
		}
		return children;
	}

	/**
	 * Find first child element by local name
	 */
	private getFirstChildByLocalName(parent: Element, localName: string): Element | null {
		for (let i = 0; i < parent.children.length; i++) {
			const child = parent.children[i];
			if (child.localName === localName) {
				return child;
			}
		}
		return null;
	}

	/**
	 * Get documentation text from an element
	 */
	private getDocumentation(element: Element): string {
		const docElement = this.getFirstChildByLocalName(element, 'documentation');
		return docElement?.textContent?.trim() || '';
	}

	/**
	 * Parse all import elements
	 */
	private parseImports(root: Element): WsdlImport[] {
		const imports: WsdlImport[] = [];
		const importElements = this.getChildElementsByLocalName(root, 'import');

		for (const importEl of importElements) {
			imports.push({
				namespace: importEl.getAttribute('namespace') || '',
				location: importEl.getAttribute('location') || importEl.getAttribute('schemaLocation') || ''
			});
		}

		return imports;
	}

	/**
	 * Parse all service elements
	 */
	private parseServices(root: Element): WsdlService[] {
		const services: WsdlService[] = [];
		const serviceElements = this.getChildElementsByLocalName(root, 'service');

		for (const serviceEl of serviceElements) {
			const service: WsdlService = {
				name: serviceEl.getAttribute('name') || 'Unknown',
				documentation: this.getDocumentation(serviceEl),
				ports: this.parsePorts(serviceEl)
			};
			services.push(service);
		}

		return services;
	}

	/**
	 * Parse all port elements within a service
	 */
	private parsePorts(serviceEl: Element): WsdlPort[] {
		const ports: WsdlPort[] = [];
		const portElements = this.getChildElementsByLocalName(serviceEl, 'port');

		for (const portEl of portElements) {
			const binding = portEl.getAttribute('binding') || '';
			const { localName: bindingName } = this.resolveQName(binding);

			// Find the address element (could be soap:address, soap12:address, http:address)
			let address = '';
			let protocol = 'SOAP';

			for (let i = 0; i < portEl.children.length; i++) {
				const child = portEl.children[i];
				if (child.localName === 'address') {
					address = child.getAttribute('location') || '';
					// Determine protocol from namespace
					const ns = child.namespaceURI;
					if (ns?.includes('soap12')) {
						protocol = 'SOAP 1.2';
					} else if (ns?.includes('soap')) {
						protocol = 'SOAP 1.1';
					} else if (ns?.includes('http')) {
						protocol = 'HTTP';
					}
				}
			}

			ports.push({
				name: portEl.getAttribute('name') || 'Unknown',
				binding: bindingName,
				address,
				protocol
			});
		}

		return ports;
	}

	/**
	 * Parse all portType elements
	 */
	private parsePortTypes(root: Element): WsdlPortType[] {
		const portTypes: WsdlPortType[] = [];
		
		// WSDL 1.1: portType
		const portTypeElements = this.getChildElementsByLocalName(root, 'portType');
		
		// WSDL 2.0: interface
		const interfaceElements = this.getChildElementsByLocalName(root, 'interface');

		for (const ptEl of [...portTypeElements, ...interfaceElements]) {
			const portType: WsdlPortType = {
				name: ptEl.getAttribute('name') || 'Unknown',
				documentation: this.getDocumentation(ptEl),
				operations: this.parseOperations(ptEl, root)
			};
			portTypes.push(portType);
		}

		return portTypes;
	}

	/**
	 * Parse all operation elements within a portType
	 */
	private parseOperations(portTypeEl: Element, root: Element): WsdlOperation[] {
		const operations: WsdlOperation[] = [];
		const operationElements = this.getChildElementsByLocalName(portTypeEl, 'operation');

		for (const opEl of operationElements) {
			const opName = opEl.getAttribute('name') || 'Unknown';
			
			// Find corresponding binding operation for SOAP action
			const { soapAction, style } = this.findBindingInfo(root, portTypeEl.getAttribute('name') || '', opName);

			const operation: WsdlOperation = {
				name: opName,
				documentation: this.getDocumentation(opEl),
				input: this.parseOperationMessage(opEl, 'input'),
				output: this.parseOperationMessage(opEl, 'output'),
				faults: this.parseOperationFaults(opEl),
				soapAction,
				style
			};
			operations.push(operation);
		}

		return operations;
	}

	/**
	 * Find binding information for an operation
	 */
	private findBindingInfo(root: Element, portTypeName: string, operationName: string): { soapAction?: string; style?: string } {
		const bindings = this.getChildElementsByLocalName(root, 'binding');
		
		for (const bindingEl of bindings) {
			const typeAttr = bindingEl.getAttribute('type') || '';
			const { localName: typeName } = this.resolveQName(typeAttr);
			
			if (typeName === portTypeName) {
				const operations = this.getChildElementsByLocalName(bindingEl, 'operation');
				for (const opEl of operations) {
					if (opEl.getAttribute('name') === operationName) {
						// Look for soap:operation element
						for (let i = 0; i < opEl.children.length; i++) {
							const child = opEl.children[i];
							if (child.localName === 'operation') {
								return {
									soapAction: child.getAttribute('soapAction') || undefined,
									style: child.getAttribute('style') || undefined
								};
							}
						}
					}
				}
			}
		}
		
		return {};
	}

	/**
	 * Parse input/output message reference within an operation
	 */
	private parseOperationMessage(opEl: Element, type: 'input' | 'output'): WsdlOperationMessage | undefined {
		const msgEl = this.getFirstChildByLocalName(opEl, type);
		if (!msgEl) return undefined;

		const messageAttr = msgEl.getAttribute('message') || '';
		const { localName: messageName } = this.resolveQName(messageAttr);

		return {
			name: msgEl.getAttribute('name') || type,
			message: messageName,
			parts: [] // Will be resolved later from messages
		};
	}

	/**
	 * Parse fault messages within an operation
	 */
	private parseOperationFaults(opEl: Element): WsdlOperationMessage[] {
		const faults: WsdlOperationMessage[] = [];
		const faultElements = this.getChildElementsByLocalName(opEl, 'fault');

		for (const faultEl of faultElements) {
			const messageAttr = faultEl.getAttribute('message') || '';
			const { localName: messageName } = this.resolveQName(messageAttr);

			faults.push({
				name: faultEl.getAttribute('name') || 'fault',
				message: messageName,
				parts: []
			});
		}

		return faults;
	}

	/**
	 * Parse all binding elements
	 */
	private parseBindings(root: Element): WsdlBinding[] {
		const bindings: WsdlBinding[] = [];
		const bindingElements = this.getChildElementsByLocalName(root, 'binding');

		for (const bindingEl of bindingElements) {
			const typeAttr = bindingEl.getAttribute('type') || '';
			const { localName: typeName } = this.resolveQName(typeAttr);

			// Find soap:binding or http:binding element
			let protocol = 'SOAP';
			let style = 'document';
			let transport = '';

			for (let i = 0; i < bindingEl.children.length; i++) {
				const child = bindingEl.children[i];
				if (child.localName === 'binding') {
					const ns = child.namespaceURI;
					if (ns?.includes('soap12')) {
						protocol = 'SOAP 1.2';
					} else if (ns?.includes('soap')) {
						protocol = 'SOAP 1.1';
					} else if (ns?.includes('http')) {
						protocol = 'HTTP';
					}
					style = child.getAttribute('style') || 'document';
					transport = child.getAttribute('transport') || '';
				}
			}

			bindings.push({
				name: bindingEl.getAttribute('name') || 'Unknown',
				type: typeName,
				protocol,
				style,
				transport,
				operations: this.parseBindingOperations(bindingEl)
			});
		}

		return bindings;
	}

	/**
	 * Parse operations within a binding
	 */
	private parseBindingOperations(bindingEl: Element): WsdlBindingOperation[] {
		const operations: WsdlBindingOperation[] = [];
		const operationElements = this.getChildElementsByLocalName(bindingEl, 'operation');

		for (const opEl of operationElements) {
			// Find soap:operation element
			let soapAction = '';
			let style = '';

			for (let i = 0; i < opEl.children.length; i++) {
				const child = opEl.children[i];
				if (child.localName === 'operation') {
					soapAction = child.getAttribute('soapAction') || '';
					style = child.getAttribute('style') || '';
				}
			}

			operations.push({
				name: opEl.getAttribute('name') || 'Unknown',
				soapAction,
				style,
				input: this.parseBindingMessageBody(opEl, 'input'),
				output: this.parseBindingMessageBody(opEl, 'output')
			});
		}

		return operations;
	}

	/**
	 * Parse input/output body within a binding operation
	 */
	private parseBindingMessageBody(opEl: Element, type: 'input' | 'output'): { body?: { use: string; namespace?: string }; headers: WsdlBindingHeader[] } | undefined {
		const msgEl = this.getFirstChildByLocalName(opEl, type);
		if (!msgEl) return undefined;

		const headers: WsdlBindingHeader[] = [];
		let body: { use: string; namespace?: string } | undefined;

		for (let i = 0; i < msgEl.children.length; i++) {
			const child = msgEl.children[i];
			if (child.localName === 'body') {
				body = {
					use: child.getAttribute('use') || 'literal',
					namespace: child.getAttribute('namespace') || undefined
				};
			} else if (child.localName === 'header') {
				const messageAttr = child.getAttribute('message') || '';
				const { localName: messageName } = this.resolveQName(messageAttr);
				headers.push({
					message: messageName,
					part: child.getAttribute('part') || '',
					use: child.getAttribute('use') || 'literal'
				});
			}
		}

		return { body, headers };
	}

	/**
	 * Parse all message elements
	 */
	private parseMessages(root: Element): WsdlMessage[] {
		const messages: WsdlMessage[] = [];
		const messageElements = this.getChildElementsByLocalName(root, 'message');

		for (const msgEl of messageElements) {
			messages.push({
				name: msgEl.getAttribute('name') || 'Unknown',
				documentation: this.getDocumentation(msgEl),
				parts: this.parseMessageParts(msgEl)
			});
		}

		return messages;
	}

	/**
	 * Parse message parts
	 */
	private parseMessageParts(msgEl: Element): WsdlMessagePart[] {
		const parts: WsdlMessagePart[] = [];
		const partElements = this.getChildElementsByLocalName(msgEl, 'part');

		for (const partEl of partElements) {
			const typeAttr = partEl.getAttribute('type');
			const elementAttr = partEl.getAttribute('element');

			let type: string | undefined;
			let element: string | undefined;

			if (typeAttr) {
				const resolved = this.resolveQName(typeAttr);
				type = resolved.localName;
			}
			if (elementAttr) {
				const resolved = this.resolveQName(elementAttr);
				element = resolved.localName;
			}

			parts.push({
				name: partEl.getAttribute('name') || 'Unknown',
				type,
				element
			});
		}

		return parts;
	}

	/**
	 * Parse all type definitions
	 */
	private parseTypes(root: Element): WsdlType[] {
		const types: WsdlType[] = [];
		const typesElement = this.getFirstChildByLocalName(root, 'types');
		
		if (!typesElement) {
			return types;
		}

		// Find all schema elements
		const schemas = this.getChildElementsByLocalName(typesElement, 'schema');

		for (const schemaEl of schemas) {
			const targetNs = schemaEl.getAttribute('targetNamespace') || '';
			
			// Parse complex types
			const complexTypes = this.getChildElementsByLocalName(schemaEl, 'complexType');
			for (const ctEl of complexTypes) {
				types.push(this.parseComplexType(ctEl, targetNs));
			}

			// Parse simple types
			const simpleTypes = this.getChildElementsByLocalName(schemaEl, 'simpleType');
			for (const stEl of simpleTypes) {
				types.push(this.parseSimpleType(stEl, targetNs));
			}

			// Parse top-level elements (which often define types inline)
			const elements = this.getChildElementsByLocalName(schemaEl, 'element');
			for (const elEl of elements) {
				const elementType = this.parseElement(elEl, targetNs);
				if (elementType) {
					types.push(elementType);
				}
			}
		}

		return types;
	}

	/**
	 * Parse a complex type definition
	 */
	private parseComplexType(ctEl: Element, namespace: string): WsdlType {
		const name = ctEl.getAttribute('name') || 'Anonymous';
		const fields: WsdlTypeField[] = [];
		let base: string | undefined;

		// Check for sequence, all, or choice
		const sequence = this.getFirstChildByLocalName(ctEl, 'sequence');
		const all = this.getFirstChildByLocalName(ctEl, 'all');
		const choice = this.getFirstChildByLocalName(ctEl, 'choice');
		const complexContent = this.getFirstChildByLocalName(ctEl, 'complexContent');
		const simpleContent = this.getFirstChildByLocalName(ctEl, 'simpleContent');

		const container = sequence || all || choice;

		if (container) {
			fields.push(...this.parseTypeFields(container));
		}

		// Handle extension/restriction in complexContent
		if (complexContent) {
			const extension = this.getFirstChildByLocalName(complexContent, 'extension');
			const restriction = this.getFirstChildByLocalName(complexContent, 'restriction');
			
			const contentEl = extension || restriction;
			if (contentEl) {
				const baseAttr = contentEl.getAttribute('base');
				if (baseAttr) {
					const resolved = this.resolveQName(baseAttr);
					base = resolved.localName;
				}
				
				const innerSequence = this.getFirstChildByLocalName(contentEl, 'sequence');
				if (innerSequence) {
					fields.push(...this.parseTypeFields(innerSequence));
				}
			}
		}

		// Handle simpleContent extension
		if (simpleContent) {
			const extension = this.getFirstChildByLocalName(simpleContent, 'extension');
			if (extension) {
				const baseAttr = extension.getAttribute('base');
				if (baseAttr) {
					const resolved = this.resolveQName(baseAttr);
					base = resolved.localName;
				}
				
				// Parse attributes
				fields.push(...this.parseAttributes(extension));
			}
		}

		// Parse attributes directly on complex type
		fields.push(...this.parseAttributes(ctEl));

		return {
			name,
			kind: 'complexType',
			documentation: this.getDocumentation(ctEl),
			namespace,
			base,
			fields
		};
	}

	/**
	 * Parse fields from a sequence/all/choice container
	 */
	private parseTypeFields(container: Element): WsdlTypeField[] {
		const fields: WsdlTypeField[] = [];
		
		for (let i = 0; i < container.children.length; i++) {
			const child = container.children[i];
			
			if (child.localName === 'element') {
				const field = this.parseFieldElement(child);
				if (field) {
					fields.push(field);
				}
			} else if (child.localName === 'sequence' || child.localName === 'choice' || child.localName === 'all') {
				// Nested container - recursively parse
				fields.push(...this.parseTypeFields(child));
			} else if (child.localName === 'any') {
				fields.push({
					name: 'any',
					type: 'any',
					minOccurs: parseInt(child.getAttribute('minOccurs') || '1', 10),
					maxOccurs: child.getAttribute('maxOccurs') || '1',
					documentation: '',
					isAttribute: false,
					isOptional: child.getAttribute('minOccurs') === '0'
				});
			}
		}

		return fields;
	}

	/**
	 * Parse a single field element within a type
	 */
	private parseFieldElement(elEl: Element): WsdlTypeField | null {
		const name = elEl.getAttribute('name') || elEl.getAttribute('ref');
		if (!name) return null;

		const resolvedName = this.resolveQName(name).localName;
		
		let type = 'any';
		const typeAttr = elEl.getAttribute('type');
		if (typeAttr) {
			type = this.resolveQName(typeAttr).localName;
		} else {
			// Check for inline complex/simple type
			const inlineComplex = this.getFirstChildByLocalName(elEl, 'complexType');
			const inlineSimple = this.getFirstChildByLocalName(elEl, 'simpleType');
			if (inlineComplex || inlineSimple) {
				type = `inline-${resolvedName}`;
			}
		}

		const minOccurs = parseInt(elEl.getAttribute('minOccurs') || '1', 10);
		const maxOccurs = elEl.getAttribute('maxOccurs') || '1';

		return {
			name: resolvedName,
			type,
			minOccurs,
			maxOccurs,
			documentation: this.getDocumentation(elEl),
			isAttribute: false,
			isOptional: minOccurs === 0
		};
	}

	/**
	 * Parse attributes from an element
	 */
	private parseAttributes(parentEl: Element): WsdlTypeField[] {
		const attributes: WsdlTypeField[] = [];
		const attrElements = this.getChildElementsByLocalName(parentEl, 'attribute');

		for (const attrEl of attrElements) {
			const name = attrEl.getAttribute('name') || attrEl.getAttribute('ref');
			if (!name) continue;

			const typeAttr = attrEl.getAttribute('type');
			let type = 'string';
			if (typeAttr) {
				type = this.resolveQName(typeAttr).localName;
			}

			const use = attrEl.getAttribute('use') || 'optional';

			attributes.push({
				name: this.resolveQName(name).localName,
				type,
				minOccurs: use === 'required' ? 1 : 0,
				maxOccurs: 1,
				documentation: this.getDocumentation(attrEl),
				isAttribute: true,
				isOptional: use !== 'required'
			});
		}

		return attributes;
	}

	/**
	 * Parse a simple type definition
	 */
	private parseSimpleType(stEl: Element, namespace: string): WsdlType {
		const name = stEl.getAttribute('name') || 'Anonymous';
		let base: string | undefined;
		let restrictions: WsdlRestriction | undefined;

		const restriction = this.getFirstChildByLocalName(stEl, 'restriction');
		if (restriction) {
			const baseAttr = restriction.getAttribute('base');
			if (baseAttr) {
				base = this.resolveQName(baseAttr).localName;
			}
			restrictions = this.parseRestrictions(restriction, base || 'string');
		}

		const union = this.getFirstChildByLocalName(stEl, 'union');
		if (union) {
			const memberTypes = union.getAttribute('memberTypes');
			if (memberTypes) {
				base = `union(${memberTypes.split(' ').map(t => this.resolveQName(t).localName).join(', ')})`;
			}
		}

		const list = this.getFirstChildByLocalName(stEl, 'list');
		if (list) {
			const itemType = list.getAttribute('itemType');
			if (itemType) {
				base = `list(${this.resolveQName(itemType).localName})`;
			}
		}

		return {
			name,
			kind: 'simpleType',
			documentation: this.getDocumentation(stEl),
			namespace,
			base,
			fields: [],
			restrictions
		};
	}

	/**
	 * Parse restrictions on a simple type
	 */
	private parseRestrictions(restriction: Element, base: string): WsdlRestriction {
		const result: WsdlRestriction = { base };

		for (let i = 0; i < restriction.children.length; i++) {
			const child = restriction.children[i];
			const value = child.getAttribute('value');

			switch (child.localName) {
				case 'enumeration':
					if (!result.enumeration) result.enumeration = [];
					if (value) result.enumeration.push(value);
					break;
				case 'minLength':
					if (value) result.minLength = parseInt(value, 10);
					break;
				case 'maxLength':
					if (value) result.maxLength = parseInt(value, 10);
					break;
				case 'pattern':
					if (value) result.pattern = value;
					break;
				case 'minInclusive':
					result.minInclusive = value || undefined;
					break;
				case 'maxInclusive':
					result.maxInclusive = value || undefined;
					break;
				case 'minExclusive':
					result.minExclusive = value || undefined;
					break;
				case 'maxExclusive':
					result.maxExclusive = value || undefined;
					break;
			}
		}

		return result;
	}

	/**
	 * Parse a top-level element definition
	 */
	private parseElement(elEl: Element, namespace: string): WsdlType | null {
		const name = elEl.getAttribute('name');
		if (!name) return null;

		// Check for inline complex type
		const inlineComplex = this.getFirstChildByLocalName(elEl, 'complexType');
		if (inlineComplex) {
			const complexType = this.parseComplexType(inlineComplex, namespace);
			return {
				...complexType,
				name,
				kind: 'element'
			};
		}

		// Check for inline simple type
		const inlineSimple = this.getFirstChildByLocalName(elEl, 'simpleType');
		if (inlineSimple) {
			const simpleType = this.parseSimpleType(inlineSimple, namespace);
			return {
				...simpleType,
				name,
				kind: 'element'
			};
		}

		// Element with type reference
		const typeAttr = elEl.getAttribute('type');
		if (typeAttr) {
			const resolvedType = this.resolveQName(typeAttr);
			return {
				name,
				kind: 'element',
				documentation: this.getDocumentation(elEl),
				namespace,
				base: resolvedType.localName,
				fields: []
			};
		}

		return null;
	}
}

// ============= Utility Functions =============

/**
 * Create a new WSDL parser and parse the given XML string
 */
export function parseWsdl(xmlString: string): ParseResult {
	const parser = new WsdlParser();
	return parser.parse(xmlString);
}

/**
 * Get all operations from a WSDL document
 */
export function getAllOperations(doc: WsdlDocument): Array<{
	serviceName: string;
	portName: string;
	operationName: string;
	soapAction?: string;
	input?: WsdlOperationMessage;
	output?: WsdlOperationMessage;
}> {
	const operations: Array<{
		serviceName: string;
		portName: string;
		operationName: string;
		soapAction?: string;
		input?: WsdlOperationMessage;
		output?: WsdlOperationMessage;
	}> = [];

	for (const portType of doc.portTypes) {
		for (const operation of portType.operations) {
			// Find corresponding service/port
			for (const service of doc.services) {
				for (const port of service.ports) {
					// Check if this port's binding references this portType
					const binding = doc.bindings.find(b => b.name === port.binding);
					if (binding && binding.type === portType.name) {
						operations.push({
							serviceName: service.name,
							portName: port.name,
							operationName: operation.name,
							soapAction: operation.soapAction,
							input: operation.input,
							output: operation.output
						});
					}
				}
			}
		}
	}

	// If no services defined, just return operations from portTypes
	if (operations.length === 0 && doc.portTypes.length > 0) {
		for (const portType of doc.portTypes) {
			for (const operation of portType.operations) {
				operations.push({
					serviceName: 'Default',
					portName: portType.name,
					operationName: operation.name,
					soapAction: operation.soapAction,
					input: operation.input,
					output: operation.output
				});
			}
		}
	}

	return operations;
}

/**
 * Get message details by name
 */
export function getMessageByName(doc: WsdlDocument, messageName: string): WsdlMessage | undefined {
	return doc.messages.find(m => m.name === messageName);
}

/**
 * Get type details by name
 */
export function getTypeByName(doc: WsdlDocument, typeName: string): WsdlType | undefined {
	return doc.types.find(t => t.name === typeName);
}

// Default export
export default WsdlParser;
