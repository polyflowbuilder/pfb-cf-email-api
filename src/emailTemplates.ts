export function createFeedbackEmailTemplate(
  subject: string,
  email: string | undefined,
  feedbackContent: string
) {
  return {
    subject: 'PolyFlowBuilder Feedback Submitted',
    contentHTML: `<h1>PolyFlowBuilder Feedback Submitted</h1>
    <p>Someone has submitted feedback! Take a look at it:</p>
    <p><strong>Subject:</strong> ${subject}</p>
    <p><strong>Return Email:</strong> ${email || 'Not Provided'}</p>
    <p><strong>Feedback:</strong> ${feedbackContent}</p>
    <p>This feedback has also been added to the feedback submission database.</p>
    `
  };
}
