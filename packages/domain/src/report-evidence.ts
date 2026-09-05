export type ReportEvidenceKind = 'text-context' | 'external-reference';

export interface ReportEvidence {
  readonly id: string;
  readonly reportId: string;
  readonly kind: ReportEvidenceKind;
  readonly context: string;
  readonly reference: string | null;
  readonly capturedAt: string;
}

export interface CreateReportEvidenceInput {
  readonly id: string;
  readonly reportId: string;
  readonly kind: ReportEvidenceKind;
  readonly context: string;
  readonly reference?: string | null;
  readonly capturedAt?: string;
}

export function createReportEvidence(input: CreateReportEvidenceInput): ReportEvidence {
  const id = input.id.trim();
  const reportId = input.reportId.trim();
  const context = input.context.trim();
  const reference = input.reference?.trim() || null;
  if (!id || !reportId) throw new Error('evidence id and report id are required');
  if (!context) throw new Error('evidence context is required');
  const captured = new Date(input.capturedAt ?? new Date().toISOString());
  if (Number.isNaN(captured.getTime())) throw new Error('capturedAt is invalid');
  return { id, reportId, kind: input.kind, context, reference, capturedAt: captured.toISOString() };
}
