export enum DocumentType {
  ACADEMIC_TRANSCRIPT = 'ACADEMIC_TRANSCRIPT',
  LETTER_OF_RECOMMENDATION = 'LETTER_OF_RECOMMENDATION',
  IDENTITY_VERIFICATION = 'IDENTITY_VERIFICATION',
  TECHNICAL_PORTFOLIO_CV = 'TECHNICAL_PORTFOLIO_CV',
  PROOF_OF_ENROLLMENT = 'PROOF_OF_ENROLLMENT',
}

export const DOCUMENT_TYPE_LABELS: Record<DocumentType, string> = {
  [DocumentType.ACADEMIC_TRANSCRIPT]: 'Academic Transcript',
  [DocumentType.LETTER_OF_RECOMMENDATION]: 'Letter of Recommendation',
  [DocumentType.IDENTITY_VERIFICATION]: 'Identity Verification',
  [DocumentType.TECHNICAL_PORTFOLIO_CV]: 'Technical Portfolio / CV',
  [DocumentType.PROOF_OF_ENROLLMENT]: 'Proof of Enrollment / Academy Acceptance Letter',
};

export const ALLOWED_FILE_TYPES = ['.pdf', '.jpg', '.jpeg', '.png'];
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes
export const MAX_ADDITIONAL_DOCUMENTS = 5;
export const MIN_MOTIVATION_LENGTH = 100;
