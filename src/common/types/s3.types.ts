export interface IS3ReadObjectMetadata {
	bucket: string;
	key: string;
}

export interface IS3WriteObjectMetadata extends IS3ReadObjectMetadata {
	body: string | Buffer;
	mimeType: string;
	contentLength: number;
}
