'use client';

import { useState, useCallback, type FormEvent, type ChangeEvent } from 'react';
import styles from './StoryForm.module.css';

/** Shape of the form's field values. */
interface FormData {
  name: string;
  email: string;
  phone: string;
  story: string;
}

/** Per-field validation error messages (empty string = no error). */
interface FormErrors {
  name: string;
  email: string;
  story: string;
}

/** Submission lifecycle states. */
type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error';

const INITIAL_DATA: FormData = { name: '', email: '', phone: '', story: '' };
const INITIAL_ERRORS: FormErrors = { name: '', email: '', story: '' };

/**
 * Validate all required fields and return per-field error messages.
 *
 * @param data - Current form values.
 * @returns An object mapping field names to error strings.
 */
function validate(data: FormData): FormErrors {
  const errors: FormErrors = { name: '', email: '', story: '' };

  if (!data.name.trim()) {
    errors.name = 'Name is required.';
  }

  if (!data.email.trim()) {
    errors.email = 'Email is required.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Please enter a valid email address.';
  }

  if (!data.story.trim()) {
    errors.story = 'Please share your story.';
  }

  return errors;
}

/**
 * A story submission form where visitors can share their story
 * along with contact information.
 *
 * Renders a full-width section with an 800 px centred content area,
 * two-column Name/Email grid on desktop, and full-width Phone + Story.
 * Includes client-side validation, a loading spinner, and a success state.
 *
 * @example
 * ```tsx
 * <StoryForm />
 * ```
 */
export function StoryForm(): React.JSX.Element {
  const [formData, setFormData] = useState<FormData>(INITIAL_DATA);
  const [errors, setErrors] = useState<FormErrors>(INITIAL_ERRORS);
  const [status, setStatus] = useState<SubmitStatus>('idle');

  /** Update a single field value and clear its error on change. */
  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
      // Clear the field error as the user types
      if (name in errors) {
        setErrors((prev) => ({ ...prev, [name]: '' }));
      }
    },
    [errors],
  );

  /** Validate and submit (simulated). */
  const handleSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const fieldErrors = validate(formData);
      const hasErrors = Object.values(fieldErrors).some(Boolean);

      if (hasErrors) {
        setErrors(fieldErrors);
        return;
      }

      setStatus('submitting');

      // Simulate an async backend call
      setTimeout(() => {
        setStatus('success');
      }, 1500);
    },
    [formData],
  );

  // ---- Success state ----
  if (status === 'success') {
    return (
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.success} role="status">
            <svg
              className={styles.successIcon}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M9 12l2 2 4-4" />
            </svg>
            <h2 className={styles.successHeading}>Thank you for sharing your story</h2>
            <p className={styles.successText}>
              We appreciate you reaching out. We&rsquo;ll be in touch soon.
            </p>
          </div>
        </div>
      </section>
    );
  }

  // ---- Form state ----
  const isSubmitting = status === 'submitting';

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.heading}>Share your story</h2>
        <p className={styles.subtitle}>We&rsquo;d love to hear from you</p>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          {/* Name + Email — two-column on desktop */}
          <div className={styles.row}>
            {/* Name */}
            <div className={styles.field}>
              <label htmlFor="story-name" className={styles.label}>
                Name<span className={styles.required} aria-hidden="true">*</span>
              </label>
              <input
                id="story-name"
                name="name"
                type="text"
                required
                placeholder="Your name"
                value={formData.name}
                onChange={handleChange}
                disabled={isSubmitting}
                className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? 'story-name-error' : undefined}
              />
              {errors.name && (
                <p id="story-name-error" className={styles.errorMessage} aria-live="polite">
                  {errors.name}
                </p>
              )}
            </div>

            {/* Email */}
            <div className={styles.field}>
              <label htmlFor="story-email" className={styles.label}>
                Email<span className={styles.required} aria-hidden="true">*</span>
              </label>
              <input
                id="story-email"
                name="email"
                type="email"
                required
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                disabled={isSubmitting}
                className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'story-email-error' : undefined}
              />
              {errors.email && (
                <p id="story-email-error" className={styles.errorMessage} aria-live="polite">
                  {errors.email}
                </p>
              )}
            </div>
          </div>

          {/* Phone (optional) */}
          <div className={styles.field}>
            <label htmlFor="story-phone" className={styles.label}>
              Phone (optional)
            </label>
            <input
              id="story-phone"
              name="phone"
              type="tel"
              placeholder="(555) 123-4567"
              value={formData.phone}
              onChange={handleChange}
              disabled={isSubmitting}
              className={styles.input}
            />
          </div>

          {/* Story */}
          <div className={styles.field}>
            <label htmlFor="story-text" className={styles.label}>
              Your Story<span className={styles.required} aria-hidden="true">*</span>
            </label>
            <textarea
              id="story-text"
              name="story"
              required
              rows={6}
              placeholder="Tell us what happened…"
              value={formData.story}
              onChange={handleChange}
              disabled={isSubmitting}
              className={`${styles.textarea} ${errors.story ? styles.inputError : ''}`}
              aria-invalid={!!errors.story}
              aria-describedby={errors.story ? 'story-text-error' : undefined}
            />
            {errors.story && (
              <p id="story-text-error" className={styles.errorMessage} aria-live="polite">
                {errors.story}
              </p>
              )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className={styles.submit}
            disabled={isSubmitting}
          >
            {isSubmitting && <span className={styles.spinner} aria-hidden="true" />}
            {isSubmitting ? 'Sending…' : 'Send your story'}
          </button>
        </form>
      </div>
    </section>
  );
}

export default StoryForm;
